import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthPage from '../views/AuthPage.vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
      },
      {
        path: "/login",
        name: "login",
        component: AuthPage,
      },
      // {
      //   path: "/services",
      //   name: "services",
      //   component: ServicesPage,
      // },
      // {
      //   path: "/cars",
      //   name: "cars",
      //   component: CarsPage,
      // },
      // {
      //   path: "/car/:id",
      //   name: "carDetails",
      //   component: CarDetails,
      // },
      // {
      //   path: "/contact",
      //   name: "contact",
      //   component: ContactPage,
      // },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }; // scroll to the top on page navigation
  },
});


export default router
