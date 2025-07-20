<template>
  <div>
    <!-- HEADER -->
    <header
      :class="headerClass"
      :style="headerStyle"
      class="flex justify-center px-6 z-50 fixed w-full top-0 drop-shadow-sm"
    >
      <div class="flex justify-between items-center w-full md:w-5/6 md:relative">
        <PageLogo />

        <!-- SEARCH -->
        <div class="flex-1 mx-8">
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
          <template v-for="link in links" :key="link.path">
            <router-link
              v-if="link.name !== 'Request Product'"
              :to="link.path"
              :class="{ 'active-link': route.path === link.path }"
            >
              {{ link.name }}
            </router-link>

            <!-- Untuk Request Product, pakai <a> jika belum login -->
            <a
              v-else-if="!isAuthenticated"
              href="#"
              @click.prevent="alertLoginRequired"
              class="text-gray-700 hover:text-blue-600"
            >
              Request Product
            </a>
            <router-link
              v-else
              :to="link.path"
              :class="{ 'active-link': route.path === link.path }"
            >
              Request Product
            </router-link>
          </template>
          <!-- Dropdown Cart -->
          <router-link
            v-if="isAuthenticated"
            to="/cart"
            class="text-[#5C4033] hover:text-[#402a1e] transition"
            title="Cart"
          >
            <BsCart3 class="text-2xl" />
          </router-link>

          <div v-if="isAuthenticated" ref="cartDropdownRef" class="relative">
            <div class="cursor-pointer flex items-center" @click="toggleProfileDropdown">
              <CgProfile class="text-2xl" />
            </div>

            <!-- DROPDOWN MENU -->
            <div
              v-if="showProfileDropdown"
              class="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fade"
            >
              <div class="py-2">
                <router-link to="/profile" class="dropdown-item" @click="closeProfileDropdown">
                  Manage Profile
                </router-link>
                <router-link to="/transactions" class="dropdown-item" @click="closeProfileDropdown">
                  Transactions
                </router-link>
              </div>
            </div>
          </div>

          <!-- Tampilkan ikon profil jika sudah login -->

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
            class="absolute top-3 right-4 text-gray-400 hover:text-black text-3xl font-bold z-[999] cursor-pointer"
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
import Swal from 'sweetalert2'
import bgNavbar from '@/assets/bg-navbar.png'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showAuthForm = ref(false)
const searchQuery = ref('')
const menuVisible = ref(false)
const showProfileDropdown = ref(false)
const profileDropdownRef = ref(null)
const isScrolled = ref(false)

const isAuthenticated = computed(() => !!authStore.accessToken)

const links = [
  { name: 'Featured', path: '/' },
  { name: 'Kids', path: '/products/kids' },
  { name: 'Men', path: '/products/men' },
  { name: 'Women', path: '/products/women' },
  { name: 'Request Product', path: '/product/request/me' },
]

onMounted(() => {
  window.addEventListener('storage', syncAuth)
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  handleScroll()
  if (authStore.accessToken) {
    checkTokenValidity()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', syncAuth)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

function syncAuth() {
  if (!localStorage.getItem('accessToken')) {
    authStore.logout()
  }
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { keyword: searchQuery.value } })
  }
}

const logout = () => {
  authStore.logout()
}

function handleLoginSuccess() {
  authStore.fetchUser()
}

const headerClass = computed(() => ({
  'sm:bg-transparent': !isScrolled.value,
  'shadow-md': isScrolled.value,
  'p-4': true,
  'sm:py-10': !isScrolled.value,
}))

const headerStyle = computed(() =>
  isScrolled.value
    ? {
        backgroundImage: `url(${bgNavbar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {},
)

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

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
}

function closeProfileDropdown() {
  showProfileDropdown.value = false
}

function handleClickOutside(event) {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    showProfileDropdown.value = false
  }
}

function alertLoginRequired() {
  Swal.fire({
    icon: 'warning',
    title: 'Login Required',
    text: 'You need to login to request a product.',
    confirmButtonText: 'Login',
  }).then((result) => {
    if (result.isConfirmed) {
      showAuthForm.value = true
    }
  })
}

// Validasi token & auto logout jika tidak valid
async function checkTokenValidity() {
  try {
    await authStore.fetchUser()
  } catch (err) {
    await Swal.fire({
      icon: 'warning',
      title: 'Session Expired',
      text: 'Your session has expired. Please login again.',
    })
    authStore.logout()
  }
}
</script>

<style scoped>
nav a {
  color: white;
  transition: color 0.3s ease;
}
nav.scrolled-nav a,
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

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade {
  animation: fade 0.2s ease-out;
}

nav .dropdown-item {
  color: #1f2937;
  padding: 0.5rem 1rem;
  display: block;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

nav .dropdown-item:hover {
  background-color: #f3f4f6;
}
</style>
