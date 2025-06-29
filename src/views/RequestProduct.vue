<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import Swal from 'sweetalert2';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useRouter } from 'vue-router';
import { CheckIcon, XIcon } from 'vue-tabler-icons';

const requests = ref([]);
const loading = ref(false);
const router = useRouter();

// Fungsi untuk mengambil semua data request produk
onMounted(fetchRequests);

async function fetchRequests() {
  loading.value = true;
  try {
    const res = await axios.get('/products/request');
    requests.value = res.data;
  } catch (err) {
    console.error('Failed to fetch requests:', err);
  } finally {
    loading.value = false;
  }
}

// Fungsi untuk mengubah status permintaan produk (accepted/declined)
async function updateStatus(requestId, status) {
  const confirm = await Swal.fire({
    title: `Are you sure want to ${status}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: `Yes, ${status}`,
    cancelButtonText: 'Cancel'
  });

  if (!confirm.isConfirmed) return;

  try {
    await axios.put(`/products/request/${requestId}`, { status });
    const target = requests.value.find((r) => r.request_id === requestId);
    if (target) target.status = status;

    if (status === 'accepted') {
      await Swal.fire({
        title: 'Accepted!',
        text: 'Please proceed to add the product manually.',
        icon: 'success'
      });
    } else {
      Swal.fire('Declined', 'Request has been declined.', 'info');
    }
  } catch (err) {
    console.error('Failed to update status:', err);
    Swal.fire('Error', 'Failed to update request status.', 'error');
  }
}
async function goToAddProductFromRequest(requestId) {
  const confirm = await Swal.fire({
    title: 'Accept this request?',
    text: 'You will be redirected to add the requested product.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Accept',
    cancelButtonText: 'Cancel'
  });

  if (!confirm.isConfirmed) return;

  router.push(`/add-product-request/${requestId}`);
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Product Requests">
        <v-card flat>
          <v-card-text>
            <!-- Tabel untuk menampilkan data permintaan produk -->
            <v-table density="comfortable" fixed-header>
              <thead>
                <tr>
                  <th>No</th>
                  <th>User</th>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(req, index) in requests" :key="req.request_id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ req.user_name }}</td>
                  <td>{{ req.name }}</td>
                  <td>{{ req.brand }}</td>
                  <td>{{ req.size }}</td>
                  <td>
                    <v-chip :color="req.status === 'requested' ? 'primary' : req.status === 'accepted' ? 'green' : 'red'" size="small">
                      {{ req.status }}
                    </v-chip>
                  </td>
                  <td>
                    <template v-if="req.status === 'requested'">
                      <v-btn size="small" class="mr-2" icon @click="goToAddProductFromRequest(req.request_id)">
                        <CheckIcon color="green" />
                      </v-btn>
                      <v-btn size="small" icon @click="updateStatus(req.request_id, 'declined')">
                        <XIcon color="red" />
                      </v-btn>
                    </template>

                    <template v-else-if="req.status === 'accepted'">
                      <v-icon color="green">
                        <CheckIcon />
                      </v-icon>
                    </template>

                    <template v-else-if="req.status === 'declined'">
                      <v-icon color="red">
                        <XIcon />
                      </v-icon>
                    </template>
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
/* Sesuaikan dengan kebutuhan Anda */
</style>
