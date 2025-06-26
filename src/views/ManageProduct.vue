<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
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

        <!-- Tabel produk dengan struktur thead, tr, th -->
        <v-card flat>
          <v-card-text>
            <v-table density="comfortable" fixed-header>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in products" :key="product.product_id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ formatPrice(product.price) }}</td>
                  <td>{{ product.brand }}</td>
                  <td>{{ product.category }}</td>
                  <td>{{ product.stock }}</td>
                  <td>
                    <v-chip :color="product.is_top_seller ? 'green' : 'red'" size="small">
                      {{ product.is_top_seller ? 'Top Seller' : 'Regular' }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn icon class="mr-3" @click="editProduct(product.product_id)">
                      <EditCircleIcon class="text-success" />
                    </v-btn>
                    <v-btn icon @click="deleteProduct(product.product_id)">
                      <TrashIcon class="text-error" />
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<style scoped>
/* Custom styles for the page */
</style>
