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
    previewImage.value = data.image_url;

    // Reset and add variant once only
    variants.value = [{ size: data.size, stock: data.quantity }];
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

  const exists = variants.value.find((v) => v.size === newSize.value);
  if (exists) {
    alert('This size already exists.');
    return;
  }

  variants.value.push({ size: newSize.value, stock: newStock.value });
  newSize.value = '';
  newStock.value = 0;
}

const formatPrice = (val) => 'Rp' + new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(val);

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

  if (name.value.length > 100 || brand.value.length > 100 || category.value.length > 50 || description.value.length > 1000) {
    Swal.fire('Invalid Input', 'Some fields are too long.', 'warning');
    return;
  }

  const numericPrice = Number(price.value);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    Swal.fire('Invalid Price', 'Please enter a valid price.', 'warning');
    return;
  }

  if (variants.value.length === 0 || variants.value.some((v) => !v.size || v.stock < 0)) {
    Swal.fire('Invalid Variants', 'Each variant must have a size and stock ≥ 0.', 'warning');
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

    // ✅ Add each variant
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
