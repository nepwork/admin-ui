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
        title: 'Quarantine Facility',
        link: '/hub/secured/forms/quarantine-facility',
      },
      {
        title: 'RDT Lab',
        link: '/hub/secured/forms/rdt-lab',
      },
      {
        title: 'PCR Lab',
        link: '/hub/secured/forms/pcr-lab',
      },
      {
        title: 'Isolation',
        link: '/hub/secured/forms/isolation',
      },
      {
        title: 'Hospital',
        link: '/hub/secured/forms/hospital',
      },
      {
        title: 'Municipality',
        link: '/hub/secured/forms/municipality',
      },
    ],
  },
  {
    title: 'Regional Totals',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'PCR Tests',
        link: '/hub/secured/tables/pcr-table',
      },
      {
        title: 'RDT Tests',
        link: '/hub/secured/tables/rdt-table',
      },
      {
        title: 'Returnees',
        link: '/hub/secured/tables/returnee-table',
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
