<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { FileUploadIcon } from 'vue-tabler-icons';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const requestId = route.params.requestId;

const name = ref('');
const brand = ref('');
const price = ref('0');
const category = ref('requested');
const is_top_seller = ref('No');
const description = ref('');
const image = ref(null);
const previewImage = ref('');
const loading = ref(false);
const variants = ref([]);
const newSize = ref('');
const newStock = ref(0);
const requestData = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get(`/products/request/${requestId}`);
    const data = res.data;
    requestData.value = data;

    name.value = data.name;
    brand.value = data.brand;
    previewImage.value = data.image_url; // tampilkan preview
    variants.value.push({ size: data.size, stock: 0 }); // inisialisasi dari request
  } catch (err) {
    console.error('Gagal fetch request:', err);
    Swal.fire('Error', 'Failed to load request data.', 'error');
    router.back();
  }
});

function handleFileUpload(e) {
  image.value = e.target.files[0];
  previewImage.value = URL.createObjectURL(image.value);
}

function addNewVariant() {
  if (!newSize.value || newStock.value < 0) {
    alert('Size is required and stock must be 0 or greater');
    return;
  }

  variants.value.push({
    size: newSize.value,
    stock: newStock.value
  });

  newSize.value = '';
  newStock.value = 0;
}

const formatPrice = (val) => 'Rp ' + new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(val);

async function submit() {
  const confirm = await Swal.fire({
    title: 'Add Product?',
    text: 'Are you sure you want to create this product?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Create',
    cancelButtonText: 'Cancel'
  });

  if (!confirm.isConfirmed) return;

  // ✅ VALIDASI HARGA
  const numericPrice = Number(price.value);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    Swal.fire('Invalid Price', 'Please enter a valid price greater than 0.', 'warning');
    return;
  }

  // ✅ VALIDASI VARIAN
  if (variants.value.length === 0) {
    Swal.fire('Missing Variant', 'You must add at least one size variant.', 'warning');
    return;
  }

  const hasInvalidVariant = variants.value.some((v) => !v.size || v.stock < 0);
  if (hasInvalidVariant) {
    Swal.fire('Invalid Variant', 'Each variant must have a size and stock ≥ 0.', 'warning');
    return;
  }

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('brand', brand.value);
    formData.append('price', numericPrice);
    formData.append('category', category.value);
    formData.append('description', description.value);
    formData.append('is_top_seller', is_top_seller.value === 'Yes' ? 1 : 0);
    formData.append('stock', 0);
    formData.append('request_id', requestId);

    if (image.value) {
      formData.append('image', image.value);
    } else {
      formData.append('image_url', requestData.value.image_url);
    }

    const res = await axios.post('/products/from-request', formData);
    const product_id = res.data.product_id;

    for (const v of variants.value) {
      await axios.post(`/products/${product_id}/variants`, {
        size: v.size,
        stock: Number(v.stock)
      });
    }

    await Swal.fire({
      title: 'Success!',
      text: 'Product created successfully.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    router.push('/manage-product');
  } catch (err) {
    console.error('Gagal tambah produk', err);
    Swal.fire('Error', 'Failed to add product.', 'error');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Add Product from Request">
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
                  <v-select v-model="category" label="Category" :items="['Requested']" required variant="solo" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="is_top_seller" label="Top Seller?" :items="['Yes', 'No']" required variant="solo" />
                </v-col>
              </v-row>

              <v-file-input label="Upload Product Image (optional)" accept="image/*" @change="handleFileUpload" show-size>
                <FileUploadIcon />
              </v-file-input>

              <div v-if="previewImage" class="my-3">
                <img :src="previewImage" style="max-width: 150px; border-radius: 8px" />
              </div>

              <v-textarea v-model="description" label="Product Description" auto-grow rows="3" required variant="solo" />

              <v-divider class="my-6" />
              <p class="text-subtitle-1 font-weight-medium mb-2">Add Size Variants</p>
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
              <v-list dense class="mt-4">
                <v-list-item v-for="(v, i) in variants" :key="i" class="px-0">
                  <v-list-item-content>Size Requests : {{ v.size }}</v-list-item-content>
                </v-list-item>
              </v-list>
              <v-row class="mt-6" justify="end" align="center" style="gap: 1rem">
                <v-btn variant="outlined" color="primary" @click="router.back()">Cancel</v-btn>
                <v-btn :loading="loading" color="primary" type="submit">Create Product</v-btn>
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
