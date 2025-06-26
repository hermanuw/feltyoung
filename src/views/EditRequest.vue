<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import Swal from 'sweetalert2';
import UiParentCard from '@/components/shared/UiParentCard.vue';

// Inisialisasi router dan route
const router = useRouter();
const route = useRoute();
const requestId = route.params.requestId; // Mendapatkan ID permintaan produk dari route

// Variabel untuk menyimpan data permintaan produk yang akan diedit
const name = ref('');
const brand = ref('');
const size = ref('');
const status = ref('');
const description = ref('');
const image_url = ref('');
const user_name = ref('');
const loading = ref(false);

// Ambil data permintaan produk saat mounted
onMounted(async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/products/request/${requestId}`);
    const requestData = res.data;

    // Menyimpan data permintaan produk untuk ditampilkan di form
    name.value = requestData.name;
    brand.value = requestData.brand;
    size.value = requestData.size;
    status.value = requestData.status;
    description.value = requestData.description;
    image_url.value = requestData.image_url;
    user_name.value = requestData.user_name;
  } catch (err) {
    console.error('Failed to fetch request:', err);
    Swal.fire('Error', 'Failed to fetch request details.', 'error');
  } finally {
    loading.value = false;
  }
});

// Fungsi untuk mengubah status permintaan produk
async function updateStatus(newStatus) {
  const confirm = await Swal.fire({
    title: `Set status to ${newStatus}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: `Yes, ${newStatus}`,
    cancelButtonText: 'Cancel'
  });

  if (!confirm.isConfirmed) return;

  try {
    await axios.put(`/products/request/${requestId}`, { status: newStatus });

    Swal.fire({
      title: 'Success!',
      text: `Request status updated to ${newStatus}.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    // Redirect ke halaman manage requests
    router.push('/product-requests');
  } catch (err) {
    console.error('Failed to update status:', err);
    Swal.fire('Error', 'Failed to update request status.', 'error');
  }
}

// Fungsi untuk mengedit permintaan produk
async function submit() {
  loading.value = true;
  try {
    const updatedRequest = {
      name: name.value,
      brand: brand.value,
      size: size.value,
      description: description.value,
      status: status.value,
      image_url: image_url.value
    };

    await axios.put(`/products/request/${requestId}`, updatedRequest);

    Swal.fire({
      title: 'Updated!',
      text: 'Product request updated successfully.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    // Redirect ke halaman manage requests setelah sukses update
    router.push('/product-requests');
  } catch (err) {
    console.error('Failed to update request:', err);
    Swal.fire('Error', 'Failed to update request.', 'error');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Edit Product Request">
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
                  <v-text-field v-model="size" label="Size" required variant="solo" />
                </v-col>

                <v-col cols="12" md="8">
                  <v-textarea v-model="description" label="Description" rows="3" auto-grow required variant="solo" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select v-model="status" label="Status" :items="['pending', 'accepted', 'declined']" required variant="solo" />
                </v-col>
              </v-row>

              <v-row class="mt-3">
                <v-col cols="12">
                  <v-img :src="image_url" max-width="150" class="mb-3" />
                </v-col>
              </v-row>

              <v-row class="mt-6" justify="end" align="center" style="gap: 1rem">
                <v-btn variant="outlined" color="primary" @click="router.back()">Cancel</v-btn>
                <v-btn :loading="loading" color="primary" type="submit">Save Changes</v-btn>
              </v-row>
            </v-form>

            <v-row class="mt-5" justify="space-between">
              <v-btn color="green" @click="updateStatus('accepted')">Accept Request</v-btn>
              <v-btn color="red" @click="updateStatus('declined')">Decline Request</v-btn>
            </v-row>
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
