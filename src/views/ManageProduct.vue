<script setup>
import { ref, onMounted } from 'vue';
import axios from '../axios';
import Swal from 'sweetalert2';
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
async function deleteProduct(product_id) {
  const result = await Swal.fire({
    title: 'Are you sure delete this product?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/products/${product_id}`);
      products.value = products.value.filter((p) => p.product_id !== product_id);

      Swal.fire({
        title: 'Deleted!',
        text: 'Product has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Gagal hapus produk:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete product.',
        icon: 'error'
      });
    }
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
            <v-btn icon class="mr-3" @click="editProduct(item.product_id)">
              <EditCircleIcon class="text-success" />
            </v-btn>
            <v-btn icon @click="deleteProduct(item.product_id)">
              <TrashIcon class="text-error" />
            </v-btn>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
