import { BuildingStoreIcon, DashboardIcon, ShoppingCartIcon, UserCircleIcon } from 'vue-tabler-icons';

const sidebarItem = [
  { 
    header: 'Home',
    meta: { requiredRoles: ['super admin'] },
  },
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    meta: { requiredRoles: ['super admin'] },
    to: '/'
  },
  { 
    divider: true,
    meta: { requiredRoles: ['super admin'] },
   },
  { header: 'Manage' },
  {
    title: 'Products',
    icon: BuildingStoreIcon,
    children: [
      {
        title: 'Products',
        meta: { requiredRoles: ['super admin', 'admin'] },
        to: '/manage-product'
      },
      {
        title: 'Requests Products',
        meta: { requiredRoles: ['super admin', 'admin'] },
        to: '/request-product'
      }
    ]
  },
  {
    title: 'Orders',
    icon: ShoppingCartIcon,
    children: [
      {
        title: 'Manage Orders',
        meta: { requiredRoles: ['super admin', 'admin'] },
        to: '/manage-orders'
      }
    ]
  },
  // {
  //   title: 'Manage Users',
  //   icon: UserCircleIcon,
  //   to: '/manage-users'
  // }
  // {
  //   title: 'Shadows',
  //   icon: ShadowIcon,
  //   to: '/utils/shadows'
  // },
  // {
  //   title: 'Colors',
  //   icon: PaletteIcon,
  //   to: '/utils/colors'
  // },
  // {
  //   title: 'Icons',
  //   icon: WindmillIcon,
  //   to: '/forms/radio',
  //   children: [
  //     {
  //       title: 'Tabler Icons',
  //       to: '/icons/tabler'
  //     },
  //     {
  //       title: 'Material Icons',
  //       to: '/icons/material'
  //     }
  //   ]
  // },
  // { divider: true },
  // {
  //   title: 'Sample Page',
  //   icon: BrandChromeIcon,
  //   to: '/starter'
  // },
  // {
  //   title: 'Documentation',
  //   icon: HelpIcon,
  //   to: 'https://codedthemes.gitbook.io/berry-vuetify/',
  //   type: 'external'
  // }
];

export default sidebarItem;
