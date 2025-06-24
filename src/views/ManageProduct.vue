<script setup>
import { ref, onMounted } from 'vue';
import axios from '../axios';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useRouter } from 'vue-router';
import { EditCircleIcon, TrashIcon } from 'vue-tabler-icons';
const formatPrice = (price) => 'Rp ' + new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(price);
const page = ref({ title: 'Manage Products' });
const breadcrumbs = ref([
  { title: 'Products', disabled: false },
  { title: 'Manage Products', disabled: true, href: '#' }
]);

const router = useRouter();
const products = ref([]);
const loading = ref(false);

// Fungsi ambil data dari backend
async function fetchProducts() {
  loading.value = true;
  try {
    const res = await axios.get('/products/'); // sesuaikan URL jika beda
    products.value = res.data;
  } catch (error) {
    console.error('Gagal ambil produk:', error);
  } finally {
    loading.value = false;
  }
}

// Fungsi hapus produk
async function deleteProduct(productId) {
  try {
    await axios.delete(`/products/${productId}`);
    products.value = products.value.filter((p) => p.id !== productId);
  } catch (error) {
    console.error('Gagal hapus produk:', error);
  }
}

function goToAddProduct() {
  router.push('/add-product');
}

function editProduct(product_id) {
  router.push(`/manage-product/edit/${product_id}`);
}

// Fetch data saat komponen dimount
onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-row>
    <v-col cols="12">
      <UiParentCard title="Product List">
        <v-btn color="primary" @click="goToAddProduct" class="mb-4">Add New Product</v-btn>

        <v-data-table
          :loading="loading"
          :headers="[
            { text: 'Name', value: 'name' },
            { text: 'Price', value: 'price', sortable: true },
            { text: 'Brand', value: 'brand' },
            { text: 'Category', value: 'category', sortable: true },
            { text: 'Stock', value: 'stock' },
            { text: 'Actions', value: 'actions', sortable: false }
          ]"
          :items="products"
          item-key="id"
        >
          <!-- Format harga -->
          <template #item.price="{ item }">
            {{ formatPrice(item.price) }}
          </template>
          <template #item.actions="{ item }">
            <v-btn icon class="mr-3" @click="editProduct(item.id)">
              <EditCircleIcon class="text-success" />
            </v-btn>
            <v-btn icon @click="deleteProduct(item.id)">
              <TrashIcon class="text-error" />
            </v-btn>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
