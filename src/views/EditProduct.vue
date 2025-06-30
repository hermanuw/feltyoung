<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { FileUploadIcon } from 'vue-tabler-icons';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const productId = route.params.productId;

const name = ref('');
const brand = ref('');
const price = ref('0');
const category = ref('');
const is_top_seller = ref('No');
const description = ref('');
const image = ref(null);
const previewImage = ref('');
const loading = ref(false);
const variants = ref([]);
const selectedSize = ref('');
const selectedStock = ref(null);
const selectedVariantId = ref(null);
const newSize = ref('');
const newStock = ref(0);

const formatPrice = (val) => 'Rp ' + new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(val);

// Ambil data produk
onMounted(async () => {
  try {
    const res = await axios.get(`/products/id/${productId}`);
    const product = res.data;
    name.value = product.name;
    brand.value = product.brand;
    price.value = product.price;
    category.value = product.category;
    is_top_seller.value = product.is_top_seller ? 'Yes' : 'No';
    description.value = product.description;
    previewImage.value = product.image_url;
    variants.value = product.variants;
  } catch (err) {
    console.error('Gagal fetch produk', err);
  }
});

function handleFileUpload(e) {
  image.value = e.target.files[0];
  previewImage.value = URL.createObjectURL(image.value);
}

async function submit() {
  const confirm = await Swal.fire({
    title: 'Save Product?',
    text: 'Are you sure you want to update this product?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Save',
    cancelButtonText: 'Cancel'
  });

  if (!confirm.isConfirmed) return;

  // Length validation
  if (name.value.length > 100) {
    Swal.fire('Too Long', 'Product name must be max 100 characters.', 'warning');
    return;
  }
  if (brand.value.length > 100) {
    Swal.fire('Too Long', 'Brand must be max 100 characters.', 'warning');
    return;
  }
  if (category.value.length > 50) {
    Swal.fire('Too Long', 'Category must be max 50 characters.', 'warning');
    return;
  }
  if (description.value.length > 1000) {
    Swal.fire('Too Long', 'Description must be max 1000 characters.', 'warning');
    return;
  }

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('brand', brand.value);
    formData.append('price', price.value);
    formData.append('category', category.value);
    formData.append('description', description.value);
    if (image.value) formData.append('image', image.value);
    formData.append('is_top_seller', is_top_seller.value === 'Yes' ? 1 : 0);

    await axios.put(`/products/${productId}`, formData);

    await Swal.fire({
      title: 'Success!',
      text: 'Product updated successfully.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    router.push('/manage-product');
  } catch (err) {
    console.error('Gagal update', err);
    Swal.fire('Error', 'Failed to update product.', 'error');
  } finally {
    loading.value = false;
  }
}

function handleSelectSize(size) {
  const found = variants.value.find((v) => v.size === size);
  if (found) {
    selectedVariantId.value = found.variant_id;
    selectedStock.value = found.stock;
    selectedSize.value = found.size;
  }
}

async function updateSelectedStock() {
  if (!selectedVariantId.value) return;

  if (selectedStock.value < 0) {
    Swal.fire('Invalid Input', 'Stock must be at least 0.', 'warning');

    return;
  }

  try {
    await axios.put(`/products/variant/${selectedVariantId.value}/stock`, {
      stock: Number(selectedStock.value)
    });

    const match = variants.value.find((v) => v.variant_id === selectedVariantId.value);
    if (match) match.stock = selectedStock.value;

    selectedSize.value = '';
    selectedStock.value = null;
    selectedVariantId.value = null;
  } catch (err) {
    console.error('Gagal update stok', err);
  }
}
async function addNewVariant() {
  if (!newSize.value || newStock.value < 0) {
    Swal.fire('Invalid Input', 'Size is required and stock must be 0 or greater.', 'warning');
    return;
  }

  try {
    const res = await axios.post(`/products/${productId}/variants`, {
      size: newSize.value,
      stock: Number(newStock.value)
    });

    variants.value.push({
      size: newSize.value,
      stock: newStock.value,
      variant_id: res.data.variant_id
    });

    newSize.value = '';
    newStock.value = 0;
  } catch (err) {
    console.error('Gagal tambah variant', err);
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Edit Product">
        <v-card flat>
          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field v-model="name" label="Product Name" required variant="solo" />
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field v-model="brand" label="Brand" required variant="solo" />
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field v-model="price" label="Price" required variant="solo" :formatter="formatPrice" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="category" label="Category" :items="['Kids', 'Men', 'Women']" required variant="solo" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="is_top_seller" label="Top Seller?" :items="['Yes', 'No']" required variant="solo" />
                </v-col>
              </v-row>

              <v-file-input label="Upload Product Image" accept="image/*" @change="handleFileUpload" show-size>
                <FileUploadIcon />
              </v-file-input>

              <div v-if="previewImage" class="my-3">
                <img :src="previewImage" style="max-width: 150px; border-radius: 8px" />
              </div>

              <v-textarea v-model="description" label="Product Description" auto-grow rows="3" required variant="solo" />

              <!-- Variant section -->
              <v-divider class="my-4" />
              <p class="text-subtitle-1 font-weight-medium mb-2">Stock per Size</p>
              <v-list dense>
                <v-list-item v-for="v in variants" :key="v.variant_id" class="px-0">
                  <v-list-item-content>Size {{ v.size }} — {{ v.stock }} pairs</v-list-item-content>
                </v-list-item>
              </v-list>

              <v-select
                v-model="selectedSize"
                :items="variants.map((v) => v.size)"
                label="Choose Size to Edit"
                class="mt-5"
                @update:modelValue="handleSelectSize"
                variant="solo"
              />
              <v-text-field v-if="selectedSize" v-model="selectedStock" label="Stock Size" type="number" class="mt-2" variant="solo" />
              <v-btn v-if="selectedSize" class="mt-2 mb-4" color="primary" @click="updateSelectedStock">Save Size Stock</v-btn>

              <!-- Tambah size baru -->
              <v-divider class="my-6" />
              <p class="text-subtitle-1 font-weight-medium mb-2">Add New Size</p>
              <v-row>
                <v-col cols="6" md="3">
                  <v-text-field v-model="newSize" label="Size (ex: 39)" variant="solo" />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field v-model="newStock" type="number" label="Stock" variant="solo" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn color="secondary" @click="addNewVariant">Add Size</v-btn>
                </v-col>
              </v-row>

              <v-row class="mt-6" justify="end" align="center" style="gap: 1rem">
                <v-btn variant="outlined" color="primary" @click="router.back()">Cancel</v-btn>
                <v-btn :loading="loading" color="primary" type="submit">Save Product</v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<style scoped>
img {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
