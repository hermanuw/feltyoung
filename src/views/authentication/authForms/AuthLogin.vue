<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import { Form } from 'vee-validate';
import { useRouter } from 'vue-router';
const router = useRouter();
const valid = ref(false);
const show1 = ref(false);
const password = ref();
const username = ref();

const passwordRules = ref([
  (v) => !!v || 'Password is required',
  (v) => (v && v.length <= 10) || 'Password must be less than 10 characters'
]);

const emailRules = ref([(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

function validate() {
  // Simpan data user dummy ke localStorage dan authStore kalau mau
  const authStore = useAuthStore();
  authStore.user = {
    id: 1,
    username: username.value,
    token: 'dummy-token'
  };
  localStorage.setItem('user', JSON.stringify(authStore.user));

  // Langsung redirect ke dashboard
  router.push('main/dashboard/default');
}
</script>

<template>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <v-text-field
      v-model="username"
      :rules="emailRules"
      label="Email Address"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
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

    <div class="d-sm-flex align-center mt-2 mb-7 mb-sm-0">
      <div class="ml-auto">
        <a href="javascript:void(0)" class="text-primary text-decoration-none">Forgot password?</a>
      </div>
    </div>

    <v-btn color="secondary" :loading="isSubmitting" block class="mt-2" variant="flat" size="large" :disabled="valid" type="submit">
      Sign In
    </v-btn>

    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>

<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
