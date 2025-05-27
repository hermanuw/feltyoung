import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import CartView from '@/views/CartView.vue'
import ProfileView from '@/views/ProfileView.vue'
import BrandView from '@/views/BrandView.vue'
import CategoryView from '@/views/CategoryView.vue'
import SearchResults from '@/views/SearchResults.vue'
import DetailView from '@/views/DetailView.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/cart',
        name: 'cart',
        component: CartView,
      },
      {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
      },
      {
        path: '/brand/:slug',
        name: 'brand',
        component: BrandView,
      },
      {
        path: '/products/:category',
        name: 'category',
        component: CategoryView,
      },
      {
        path: '/search',
        name: 'SearchResults',
        component: SearchResults,
      },
      {
        path: '/products/id/:id',
        name: 'DetailView',
        component: DetailView,
      },
      // {
      //   path: "/blog",
      //   name: "blog",
      //   component: BlogPage,
      // },
      // {
      //   path: "/blog/:id",
      //   name: "blogDetails",
      //   component: BlogDetails,
      // },
      // {
      //   path: "/pricing",
      //   name: "pricing",
      //   component: PricingPage,
      // },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 } // scroll to the top on page navigation
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const protectedRoutes = ['/profile', '/cart']

  if (protectedRoutes.includes(to.path) && !token) {
    next('/') // Atau redirect ke halaman login
  } else {
    next()
  }
})

export default router
