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
                      :style="statusStyle(order.status)"
                      @update:modelValue="() => updateStatus(order)"
                    />
                  </td>
                  <td>Rp {{ formatCurrency(order.total_amount) }}</td>
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
        <p><strong>Recipient:</strong> {{ selectedOrder.recipient_name }} ({{ selectedOrder.recipient_phone }})</p>
        <p><strong>Shipping:</strong> {{ selectedOrder.shipping_address }}</p>
        <div v-if="selectedOrder.status === 'shipped'" class="mt-3">
          <v-text-field
            v-model="selectedOrder.tracking_number"
            label="Tracking Number"
            density="compact"
            variant="outlined"
            placeholder="Enter tracking number"
          />
          <v-btn color="primary" class="mt-2" size="small" @click="saveTrackingNumber"> Save Tracking Number </v-btn>
        </div>
        <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
        <p><strong>Payment Method:</strong> {{ selectedOrder.payment_method }}</p>
        <p><strong>Total:</strong> Rp {{ formatCurrency(selectedOrder.total_amount) }}</p>

        <hr class="my-3" />

        <div v-if="selectedOrder.items?.length">
          <p class="font-semibold mb-1">Items:</p>
          <ul>
            <li v-for="item in selectedOrder.items" :key="item.product_id">
              {{ item.product_name }} (Size {{ item.size }} - {{ item.quantity }} pairs) - Rp {{ formatCurrency(item.price) }}
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
import { useTheme } from 'vuetify';

const theme = useTheme();

const statusStyle = (status) => {
  const bg = theme.current.value.colors[statusClass(status)] || '#f4f4f4';
  const textColor = statusTextColor(status);
  return {
    backgroundColor: bg,
    color: textColor,
    borderRadius: '8px'
  };
};
const statusTextColor = (status) => {
  switch (status) {
    case 'done':
    case 'paid':
    case 'packing':
      return 'white';
    default:
      return '#000';
  }
};

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
  await axios.put(`/orders/${order.order_id}/status`, {
    status: order.status
  });
};

const formatDate = (str) => {
  const date = new Date(str);

  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return `${datePart} ${timePart}`;
};

const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(val);

const statusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'paid':
      return 'primary';
    case 'packing':
      return 'primary';
    case 'shipped':
      return 'info';
    case 'done':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'gray100'; // fallback
  }
};

const saveTrackingNumber = async () => {
  try {
    await axios.put(`/orders/${selectedOrder.value.order_id}/tracking`, {
      tracking_number: selectedOrder.value.tracking_number
    });
    alert('Tracking number saved!');
  } catch (err) {
    console.error(err);
    alert('Failed to save tracking number.');
  }
};
</script>
