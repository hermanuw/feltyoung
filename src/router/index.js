import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import { useAuthStore } from '../stores/auth';

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
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/authentication/auth/RegisterPage.vue')
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

  if (requiresAuth && !isLoggedIn) {
    auth.returnUrl = to.fullPath;
    return next('/login');
  }

  if (isLoggedIn && to.path === '/login') {
    return next('/main/dashboard/default');
  }

  next();
});

export default router;
