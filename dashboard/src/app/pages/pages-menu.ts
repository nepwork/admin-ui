import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Core Panels',
    icon: 'home-outline',
    link: '/hub/home',
    home: true,
  },
  {
    title: 'Data Entry',
    group: true,
  },
  {
    title: 'Returnees',
    icon: 'people-outline',
    children: [
      {
        title: 'Point of Entry',
        link: '/hub/secured/forms/point-of-entry',
      },
      {
        title: 'Municipality',
        link: '/hub/secured/forms/municipality',
      },
      {
        title: 'Returnees',
        link: '/hub/secured/tables/returnee-table',
      },
    ],
  },
  {
    title: 'Tests',
    icon: 'file-add-outline',
    children: [
      {
        title: 'PCR Tests',
        link: '/hub/secured/tables/pcr-table',
      },
      {
        title: 'RDT Tests',
        link: '/hub/secured/tables/rdt-table',
      },
    ],
  },
  {
    title: 'Visual Stats',
    group: true,
  },
  {
    title: 'Covid Maps',
    icon: 'map-outline',
    children: [
      {
        title: 'Kathmandu Valley',
        link: '/hub/maps/area/kathmandu_valley',
      },
      {
        title: 'Nepal',
        link: '/hub/maps/nepal',
      },
      {
        title: 'Custom Map (Sample)',
        link: '/hub/maps/bubble',
      },
    ],
  },
  {
    title: 'Returnee Stats',
    icon: 'people-outline',
    link: '/hub/charts/echarts',
  },
  {
    title: 'COVID-19 Charts',
    icon: 'activity-outline',
    children: [
      {
        title: 'Preventive Measures',
        link: '/hub/charts/chartjs',
      },
      {
        title: 'Medical Stats',
        link: '/hub/charts/d3',
      },
    ],
  },
];
