import App from './../app/App';
import TableView, {onTableEnter} from '../TableView';
import DetailView from '../DetailView';
import NotFound from '../NotFoundView';
import requestAuth from '../auth/requestAuth';
import components from './componentsList';

export const createRoutes = store => {
  const {routes} = store.getState().configReducer;
  const {data} = store.getState().schemaReducer;

  const schemaRoutes = data.reduce((result, item) => {
    const singular = {
      path: /* item.prefix + '/' + */ item.singular + '/:id',
      singular: item.singular,
      getComponent(nextState, cb) {
        return cb(null, DetailView(store));
      }
    };
    const plural = {
      path: /* item.prefix + '/' + */ item.plural,
      plural: item.plural,
      getComponent(nextState, cb) {
        return cb(null, TableView);
      },
      onEnter: (...params) => {
        onTableEnter(store, item.plural, ...params);
      }
    };
    result.push(singular, plural);

    return result;
  }, []);

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
      component: requestAuth(App),
      childRoutes: [
        ...prepareRoutes(routes),
        ...schemaRoutes,
        {
          path: '*',
          component: NotFound
        }
      ]
    }
  ];
};

export default createRoutes;
