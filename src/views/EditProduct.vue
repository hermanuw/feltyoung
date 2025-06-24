<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { FileUploadIcon } from 'vue-tabler-icons';
const router = useRouter();
const route = useRoute();
const productId = route.params.id;

const name = ref('');
const status = ref('Disetujui');
const description = ref('');
const image = ref(null);
const previewImage = ref('');
const loading = ref(false);

// ambil data produk saat mounted
onMounted(async () => {
  try {
    const res = await axios.get(`/products/${productId}`);
    name.value = res.data.name;
    status.value = res.data.status;
    description.value = res.data.description;
    previewImage.value = res.data.image_url;
  } catch (err) {
    console.error('Gagal fetch produk', err);
  }
});

function handleFileUpload(e) {
  image.value = e.target.files[0];
  previewImage.value = URL.createObjectURL(image.value);
}

async function submit() {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('status', status.value);
    formData.append('description', description.value);
    if (image.value) formData.append('image', image.value);

    await axios.put(`/products/${productId}`, formData);
    router.push('/manage-products');
  } catch (err) {
    console.error('Gagal update', err);
  } finally {
    loading.value = false;
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
                  <v-text-field v-model="price" label="Price" required variant="solo" />
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field v-model="stock" label="Stock" required variant="solo" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="category" label="Category" :items="['Kids', 'Men', 'Women']" required variant="solo" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="is_top_seller" label="Top Seller?" :items="['Yes', 'No']" required variant="solo" />
                </v-col>
              </v-row>

              <v-file-input label="Upload Product Image" accept="image/*" @change="handleFileUpload" show-size
                ><FileUploadIcon
              /></v-file-input>

              <div v-if="previewImage" class="my-3">
                <img :src="previewImage" style="max-width: 150px; border-radius: 8px" />
              </div>

              <v-textarea v-model="description" label="Product Description" auto-grow rows="3" required></v-textarea>

              <v-row class="mt-4" justify="end" align="center" style="gap: 1rem">
                <v-btn variant="outlined" color="primary" @click="router.back()">Cancel</v-btn>
                <v-btn :loading="loading" color="primary" type="submit">Save</v-btn>
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
