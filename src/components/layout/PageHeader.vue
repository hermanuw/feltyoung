<template>
  <div>
    <!-- HEADER -->
    <header
      :class="headerClass"
      class="flex justify-center px-6 z-50 fixed w-full top-0 p-2 bg-white drop-shadow-sm"
    >
      <div class="flex justify-between items-center w-full md:w-5/6 md:relative">
        <PageLogo />

        <!-- SEARCH -->
        <div class="hidden md:flex flex-1 mx-8">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search sneakers"
            class="w-full px-4 py-2 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm text-black"
          />
        </div>

        <!-- NAV DESKTOP -->
        <nav
          :class="[
            { 'scrolled-nav': isScrolled },
            route.path !== '/' ? 'route-not-home' : '',
            'space-x-6 hidden md:flex items-center',
          ]"
        >
          <router-link
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            :class="{ 'active-link': route.path === link.path }"
          >
            {{ link.name }}
          </router-link>
          <router-link
            v-if="isAuthenticated"
            to="/cart"
            class="text-[#5C4033] hover:text-[#402a1e] transition"
            title="Cart"
          >
            <BsCart3 class="text-2xl" />
          </router-link>

          <!-- Tampilkan ikon profil jika sudah login -->
          <router-link
            v-if="isAuthenticated"
            to="/profile"
            class="text-[#5C4033] hover:text-[#402a1e] transition"
            title="Profile"
          >
            <CgProfile class="text-2xl" />
          </router-link>

          <router-link
            v-if="!isAuthenticated"
            to="#"
            @click.prevent="showAuthForm = true"
            class="px-4 py-1 border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white font-semibold rounded-full transition"
          >
            Login
          </router-link>

          <button
            v-else
            @click="logout"
            class="text-sm text-red-500 hover:text-red-700 font-semibold cursor-pointer transition"
          >
            Logout
          </button>
        </nav>

        <!-- NAV MOBILE -->
        <div class="flex md:hidden">
          <button
            @click="toggleMenu"
            class="text-gray-800 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <FaBarsStaggered />
          </button>

          <div
            v-if="menuVisible"
            class="absolute top-16 left-0 bg-white shadow-lg w-full p-4 flex flex-col space-y-6"
          >
            <router-link
              v-for="link in links"
              :key="link.path"
              :to="link.path"
              :class="{ 'active-link': route.path === link.path }"
              @click="closeMenu"
            >
              {{ link.name }}
            </router-link>

            <router-link
              v-if="!isAuthenticated"
              to="#"
              @click.prevent="
                () => {
                  showAuthForm = true
                  closeMenu()
                }
              "
              class="px-4 py-2 border border-black text-[#5C4033] hover:bg-[#5C4033] hover:text-white font-semibold rounded-full text-center transition"
            >
              Login
            </router-link>

            <button v-else @click="logout" class="text-left text-red-500 font-semibold">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- MODAL AUTH FORM -->
    <transition name="slide-down">
      <div
        v-if="showAuthForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      >
        <!-- WRAPPER tombol dan konten auth -->
        <div class="relative w-[768px] max-w-full rounded-xl shadow-2xl overflow-hidden z-[999]">
          <!-- Tombol Close harus di sini, dalam wrapper -->
          <button
            class="absolute top-3 right-4 text-gray-400 hover:text-black text-3xl font-bold z-[999]"
            @click="showAuthForm = false"
            aria-label="Close"
          >
            ×
          </button>

          <!-- AuthForm harus berada di bawah tombol -->
          <AuthForm @close="showAuthForm = false" @login-success="handleLoginSuccess" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import PageLogo from '../composables/PageLogo.vue'
import AuthForm from '../composables/AuthForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { FaBarsStaggered } from '@kalimahapps/vue-icons'
import { CgProfile } from '@kalimahapps/vue-icons'
import { BsCart3 } from '@kalimahapps/vue-icons'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const isScrolled = ref(false)
const menuVisible = ref(false)
const isAuthenticated = ref(!!localStorage.getItem('accessToken'))
onMounted(() => {
  window.addEventListener('storage', syncAuth)
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', syncAuth)
})

function syncAuth() {
  isAuthenticated.value = !!localStorage.getItem('accessToken')
}

const searchQuery = ref('')
const showAuthForm = ref(false)

const links = [
  { name: 'Featured', path: '/' },
  { name: 'Kids', path: '/products/kids' },
  { name: 'Men', path: '/products/men' },
  { name: 'Women', path: '/products/women' },
]

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { keyword: searchQuery.value } })
  }
}

const logout = async () => {
  try {
    await axios.post('/api/logout')
  } catch (e) {
    console.warn('Logout failed, forcing logout')
  } finally {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    isAuthenticated.value = false
    router.push('/')
  }
}

function handleLoginSuccess() {
  isAuthenticated.value = true
}
const headerClass = computed(() => ({
  // 'bg-white': route.path !== '/',
  'sm:bg-transparent': !isScrolled.value,
  'sm:bg-white': isScrolled.value,
  'shadow-md': isScrolled.value,
  'p-4': true,
  'sm:py-10': !isScrolled.value,
}))

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}

const closeMenu = () => {
  menuVisible.value = false
}

watch(
  () => route.path,
  () => {
    searchQuery.value = ''
  },
)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
nav a {
  color: white;
  transition: color 0.3s ease;
}

nav.scrolled-nav a {
  color: black !important;
}

nav.route-not-home a {
  color: black !important;
}

nav a.active-link {
  color: black !important;
  font-weight: bold;
}

/* Slide animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
