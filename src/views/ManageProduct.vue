<script setup>
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useRouter } from 'vue-router';
import { EditCircleIcon, TrashIcon } from 'vue-tabler-icons';

// Data produk
const page = ref({ title: 'Manage Products' });
const breadcrumbs = ref([
  { title: 'Products', disabled: false },
  { title: 'Manage Products', disabled: true, href: '#' }
]);

const router = useRouter();

// Daftar produk
const products = ref([
  { id: 1, name: 'Product A', price: 50, description: 'Description of product A', lastUpdated: '2023-08-30' },
  { id: 2, name: 'Product B', price: 30, description: 'Description of product B', lastUpdated: '2023-08-28' },
  { id: 3, name: 'Product C', price: 70, description: 'Description of product C', lastUpdated: '2023-08-25' },
  { id: 4, name: 'Product D', price: 100, description: 'Description of product D', lastUpdated: '2023-08-20' },
  { id: 5, name: 'Product E', price: 150, description: 'Description of product E', lastUpdated: '2023-08-15' }
]);

// Fungsi untuk mengarahkan ke halaman tambah produk
function goToAddProduct() {
  router.push('/add-product');
}

// Fungsi untuk edit produk (dapat diubah sesuai kebutuhan)
function editProduct(productId) {
  console.log('Edit product with ID:', productId);
}

// Fungsi untuk hapus produk (dapat diubah sesuai kebutuhan)
function deleteProduct(productId) {
  products.value = products.value.filter((product) => product.id !== productId);
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-row>
    <!-- Tombol untuk Add Product -->
    <v-col cols="12" md="12">
      <UiParentCard title="Product List">
        <!-- Tombol Add New -->
        <v-btn color="primary" @click="goToAddProduct" class="mb-4">Add New Product</v-btn>

        <!-- Tabel Data Produk -->
        <v-data-table
          :headers="[
            { text: 'Name', align: 'start', value: 'name' },
            { text: 'Price', value: 'price' },
            { text: 'Last Update', value: 'lastUpdated' },
            { text: 'Actions', value: 'actions', sortable: false }
          ]"
          :items="products"
          item-key="id"
          :pagination="{
            page: 1,
            itemsPerPage: 5
          }"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <!-- Tombol Edit -->
            <v-btn icon @click="editProduct(item.id)">
              <EditCircleIcon />
            </v-btn>
            <!-- Tombol Hapus -->
            <v-btn icon @click="deleteProduct(item.id)">
              <TrashIcon />
            </v-btn>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<style scoped>
/* Custom styles for the page */
</style>
