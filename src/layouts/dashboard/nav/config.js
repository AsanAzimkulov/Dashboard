// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Админ-панель',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Товары',
    path: '/dashboard/products',
    icon: icon('ic_product'),
  },
  {
    title: 'Авторизация',
    path: '/login',
    icon: icon('ic_lock'),
  }
];

export default navConfig;
