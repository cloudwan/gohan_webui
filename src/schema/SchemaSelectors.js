import {createSelector} from 'reselect';

const schemas = state => state.schemaReducer.data;
const schema = (state, id) => state.schemaReducer.data.find(item => item.id === id);

const schemaParents = (state, id) => {
  const result = [];

  let parentSchema = schema(state, id);

  result.unshift(parentSchema);

  while (parentSchema.parent) {
    parentSchema = schema(state, parentSchema.parent);
    result.unshift(parentSchema);
  }
  return result;
};

const singularSchemaUrl = (state, id, params) => {
  const parents = schemaParents(state, id);

  return parents.reduce(
    (result, parent, index) => (
      `${result}${(index === 0) ? parent.prefix : ''}/${parent.plural}/${params[`${parent.id}_id`]}`
    ),
    ''
  );
};

const collectionSchemaUrl = (state, id, params) => {
  const parents = schemaParents(state, id);

  return parents.reduce(
    (result, parent, index, array) => (
      `${result}${(index === 0) ? `${parent.prefix}` : ''}` +
      `${(params[`${parent.id}_id`] && (index !== array.length - 1)) ?
        `/${parent.plural}/${params[`${parent.id}_id`]}` : (index === array.length - 1) ? `/${parent.plural}` : ''}`
    ),
    ''
  );
};

const breadcrumb = (state, id, params) => {
  const parents = schemaParents(state, id);

  return parents.reduce((result, item) => {
    if (item.parent === '') {
      result.push({
        title: item.title,
        url: `${item.url}`
      });
    }
    const singularLink = singularSchemaUrl(state, item.id, params);

    result.push({
      singular: item.singular,
      requestUrl: singularLink,
      url: singularLink
    });

    return result;
  }, []);
};

export const getSingularUrl = createSelector(
  [singularSchemaUrl],
  url => url
);

export const getCollectionUrl = createSelector(
  [collectionSchemaUrl],
  url => url
);

export const getSidebarMenuItems = createSelector(
  [schemas],
  schemas => {
    if (schemas !== undefined && Array.isArray(schemas)) {
      return schemas.filter(item => (!item.parent && item.metadata.type !== 'metaschema')).map(item => (
        {
          title: item.title,
          path: '#' + item.url
        }
      ));
    }
    return [];
  }
);

export const getSchema = createSelector(
  [schema],
  schema => {
    return schema;
  }
);

export const getAllSchemas = createSelector(
  [schemas],
  schemas => schemas
);

export const hasReadPermission = createSelector(
  [schema],
  schema => schema.schema.permission.includes('read')
);

export const hasCreatePermission = createSelector(
  [schema],
  schema => schema.schema.permission.includes('create')
);

export const hasUpdatePermission = createSelector(
  [schema],
  schema => schema.schema.permission.includes('update')
)
;
export const hasDeletePermission = createSelector(
  [schema],
  schema => schema.schema.permission.includes('delete')
);

export const getBreadcrumb = createSelector(
  [breadcrumb],
  breadcrumb => breadcrumb
);

export const isValidFieldName = createSelector(
  [schema, (state, id, name) => name],
  (schema, name) => Boolean(schema !== undefined && schema.schema.properties[name])
);
