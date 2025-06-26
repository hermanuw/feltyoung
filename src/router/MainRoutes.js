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
      path: '/add-product',
      name: 'Add Product',
      component: () => import('../views/AddProduct.vue')
    },
    {
      path: '/request-product',
      name: 'Request Products',
      component: () => import('../views/RequestProduct.vue')
    },
    {
      path: '/request-product/edit/:requestId',
      name: 'Edit Request',
      component: () => import('../views/EditRequest.vue')
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
      component: () => import('../views/ColorPage.vue')
    }
  ]
};

export default MainRoutes;
