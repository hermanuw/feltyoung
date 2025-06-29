<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-row>
    <v-col cols="12">
      <UiParentCard title="Order List">
        <!-- Tabel order -->
        <v-card flat>
          <v-card-text>
            <v-table density="comfortable" fixed-header>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in orders" :key="order.order_id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ order.order_id }}</td>
                  <td>{{ order.user_name }}</td>
                  <td>{{ formatDate(order.order_date) }}</td>
                  <td>
                    <v-select
                      v-model="order.status"
                      :items="statuses"
                      hide-details
                      density="compact"
                      variant="outlined"
                      style="max-width: 140px"
                      @change="updateStatus(order)"
                    />
                  </td>
                  <td>{{ formatCurrency(order.total_amount) }}</td>
                  <td>
                    <v-btn size="small" @click="viewOrder(order)">View</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </UiParentCard>
    </v-col>
  </v-row>

  <!-- Dialog detail order -->
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="text-lg font-semibold">Order Detail</v-card-title>
      <v-card-text v-if="selectedOrder">
        <p><strong>User:</strong> {{ selectedOrder.user_name }} ({{ selectedOrder.email }})</p>
        <p><strong>Recipient:</strong> {{ selectedOrder.recipient_name }} ({{ selectedOrder.recipient_phone }})</p>
        <p><strong>Shipping:</strong> {{ selectedOrder.shipping_address }}</p>
        <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
        <p><strong>Payment Method:</strong> {{ selectedOrder.payment_method }}</p>
        <p><strong>Total:</strong> {{ formatCurrency(selectedOrder.total_amount) }}</p>

        <hr class="my-3" />

        <div v-if="selectedOrder.items?.length">
          <p class="font-semibold mb-1">Items:</p>
          <ul>
            <li v-for="item in selectedOrder.items" :key="item.product_id">
              {{ item.name }} ({{ item.quantity }} pcs) - {{ formatCurrency(item.price) }}
            </li>
          </ul>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false" text>Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = { title: 'Manage Orders' };
const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/' },
  { text: 'Orders', disabled: true }
];

const orders = ref([]);
const selectedOrder = ref(null);
const dialog = ref(false);

const statuses = ['pending', 'paid', 'packing', 'shipped', 'done', 'cancelled'];

onMounted(async () => {
  const res = await axios.get('/orders/admin/all');
  orders.value = res.data;
});

const viewOrder = async (order) => {
  const res = await axios.get(`/orders/${order.order_id}`);
  selectedOrder.value = res.data;
  dialog.value = true;
};

const updateStatus = async (order) => {
  await axios.patch(`/orders/${order.order_id}/status`, { status: order.status });
};

const formatDate = (str) =>
  new Date(str).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);
</script>
