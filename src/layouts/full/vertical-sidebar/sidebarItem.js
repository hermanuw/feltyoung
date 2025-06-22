import { BuildingStoreIcon, DashboardIcon } from 'vue-tabler-icons';

const sidebarItem = [
  { header: 'Home' },
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    to: '/'
  },
  { divider: true },
  { header: 'Manage' },
  {
    title: 'Products',
    icon: BuildingStoreIcon,
    children: [
      {
        title: 'Manage Products',
        to: '/manage-product'
      },
      {
        title: 'Manage Requests Products',
        to: '/request-product'
      }
    ]
  }
  // { divider: true },
  // { header: 'Utilities' },
  // {
  //   title: 'Typography',
  //   icon: TypographyIcon,
  //   to: '/utils/typography'
  // },
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
