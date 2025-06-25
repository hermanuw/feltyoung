const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true // semua di bawah ini butuh login
  },
  redirect: '/main/dashboard',
  component: () => import('../layouts/full/FullLayout.vue'),
  children: [
    {
      path: '/main/dashboard',
      name: 'Dashboard',
      component: () => import('../views/dashboards/default/DefaultDashboard.vue')
    },
    {
      path: '/manage-product',
      name: 'Manage Products',
      component: () => import('../views/ManageProduct.vue')
    },
    {
      path: '/manage-product/edit/:productId',
      name: 'Edit Product',
      component: () => import('../views/EditProduct.vue')
    },
    {
      path: '/request-product',
      name: 'Request Products',
      component: () => import('../views/utilities/colors/ColorPage.vue')
    },
    {
      path: 'icons/material',
      name: 'Material Icons',
      component: () => import('../views/utilities/icons/MaterialIcons.vue')
    },
    {
      path: 'utils/typography',
      name: 'Typography',
      component: () => import('../views/utilities/typography/TypographyPage.vue')
    },
    {
      path: 'utils/shadows',
      name: 'Shadows',
      component: () => import('../views/utilities/shadows/ShadowPage.vue')
    },
    {
      path: 'utils/colors',
      name: 'Colors',
      component: () => import('../views/utilities/colors/ColorPage.vue')
    }
  ]
};

export default MainRoutes;
