import App from './../app/App';
import components from './componentsList';
import dynamicRoutes from '../dynamicRoutes/dynamicRoutes';

export const createRoutes = store => {
  const {routes} = store.getState().configReducer;
  const prepareRoutes = item => {

    if (Array.isArray(item.childRoutes)) {
      return item.childRoutes.map(item => {
        const childRoutes = prepareRoutes(item);
        const component = components[item.componentName];

        if (component === undefined) {
          throw new Error('Cannot select component! Check config.json!');
        }

        const result = {
          path: item.path,
          component,
        };

        if (childRoutes) {
          result.childRoutes = childRoutes;
        }

        return result;
      });
    }
  };

  return [
    {
      path: '/',
      component: App,
      childRoutes: [
        ...prepareRoutes(routes),
        dynamicRoutes(store)
      ]
    }
  ];
};

export default createRoutes;
