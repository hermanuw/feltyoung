import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import { useAuthStore } from '../stores/auth';
import Swal from 'sweetalert2';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/authentication/LoginPage.vue')
    },
    MainRoutes,
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/pages/maintenance/error/Error404Page.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isLoggedIn = !!auth.user;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRoles = to.meta.requiredRoles;

  if (requiresAuth && !isLoggedIn) {
    auth.returnUrl = to.fullPath;
    return next('/login');
  }

  // Role check
  if (isLoggedIn && requiredRoles && !auth.user.role.includes(requiredRoles)) {
    Swal.fire({
      icon: 'warning',
      title: 'Access Denied',
      text: 'You do not have permission to access this page',
      showConfirmButton: false
    });
    return false; // prevent navigation
  }

  // Jika user sudah login dan buka halaman login lagi, arahkan sesuai role
  if (isLoggedIn && to.path === '/login') {
    if (auth.user.role.includes('super admin') && to.path !== '/main/dashboard') {
      return next('/main/dashboard');
    } else if (auth.user.role.includes('admin') && to.path !== '/manage-product') {
      return next('/manage-product');
    }
    return next(); // biarkan jika path sudah benar
  }

  next();
});

export default router;

