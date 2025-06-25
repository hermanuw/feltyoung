<script setup>
import { ref } from 'vue';
import { Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useAuthStore } from '@/stores/auth'; // pastikan path sesuai

const router = useRouter();
const authStore = useAuthStore();

const show1 = ref(false);
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const passwordRules = ref([(v) => !!v || 'Password is required', (v) => (v && v.length <= 20) || 'Max 20 characters']);
const emailRules = ref([(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

const login = async () => {
  loading.value = true;
  errorMsg.value = '';

  try {
    const res = await axios.post('/login', {
      email: email.value,
      password: password.value
    });

    const { accessToken, user } = res.data;

    if (user.role !== 'admin') {
      errorMsg.value = 'Only Admin Can Access This Page';
      return;
    }

    // ✅ Simpan ke pinia + localStorage
    authStore.setAuth(user, accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);

    router.push('/main/dashboard');
  } catch (err) {
    errorMsg.value = 'Email atau password salah';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Form @submit="login" class="mt-7 loginForm" v-slot="{ isSubmitting }">
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Email Address"
      class="mt-4 mb-4"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
    />

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Password"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput"
    />

    <div class="d-sm-flex align-center mt-2 mb-6">
      <div class="ml-auto">
        <a href="#" class="text-primary text-decoration-none">Forgot password?</a>
      </div>
    </div>

    <v-btn :loading="loading" block class="mt-2" variant="flat" size="large" color="secondary" type="submit"> Sign In </v-btn>

    <v-alert v-if="errorMsg" class="mt-4" color="error" variant="tonal" density="comfortable">
      {{ errorMsg }}
    </v-alert>
  </Form>
</template>

<style lang="scss">
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
