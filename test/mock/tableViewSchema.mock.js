module.exports = {
  'description': 'Network',
  'id': 'network',
  'plural': 'networks',
  'prefix': '/v2.0',
  'schema': {
    'properties': {
      'description': {
        'default': '',
        'description': 'Description',
        'permission': [
          'create',
          'update'
        ],
        'title': 'Description',
        'type': 'string',
        'unique': false
      },
      'id': {
        'description': 'ID',
        'permission': [
          'create'
        ],
        'title': 'ID',
        'type': 'string',
        'unique': false
      },
      'name': {
        'description': 'Name',
        'permission': [
          'create',
          'update'
        ],
        'title': 'Name',
        'type': 'string',
        'unique': false
      },
      'tenant_id': {
        'description': 'Tenant ID',
        'permission': [
          'create'
        ],
        'title': 'Tenant',
        'type': 'string',
        'unique': false
      }
    },
    'propertiesOrder': [
      'id',
      'name',
      'description',
      'tenant_id'
    ],
    'required': null,
    'type': 'object'
  },
  'singular': 'network',
  'title': 'Network',
  'url': '/v2.0/networks'
};
