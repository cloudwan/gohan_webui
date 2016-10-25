import App from './../app/App';
import dynamicRoutes from '../dynamicRoutes/dynamicRoutes';
import requireAuthentication from '../auth/requireAuthentication';
import Login from '../auth/Auth';

export const createRoutes = () => {
  return [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: requireAuthentication(App),
      childRoutes: [
        {
          path: '*',
          component: dynamicRoutes()
        }
      ]
    }
  ];
};

export default createRoutes;
