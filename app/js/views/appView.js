/* global document, $ */
import {View, Collection, history} from 'backbone';

import UserModel from './../models/userModel';
import SchemaCollection from './../models/schemaCollection';

import SidebarView from './sidebarView';
import HeaderView from './headerView';
import TableView from './tableView';
import DetailView from './detailView';
import LoginView from './loginView';
import SampleView from './sampleView';
import ErrorView from './errorView';
import BreadCrumbView from './breadCrumbView';

import template from './../../templates/app.html';

export default class AppView extends View {
  className() {
    return 'appview';
  }

  constructor(options) {
    super(options);

    this.router = options.router;
    this.config = options.config;
    this.viewClass = Object.assign(
      {
        table: TableView,
        detail: DetailView,
        sampleview: SampleView
      },
      options.viewClass
    );
    this.userModel = options.userModel;
    this.schemas = options.scheams;
    this.errorView = new ErrorView();

    if (this.userModel === undefined) {
      this.userModel = new UserModel({
        url: this.config.get('authUrl') + '/tokens'
      });
    }

    this.view = null;
    this.buildView();

    if (this.schemas === undefined) {
      this.schemas = new SchemaCollection({
        baseUrl: this.config.get('gohan').url,
        userModel: this.userModel,
        url: this.config.get('gohan').url + this.config.get('gohan').schema,
        additionalForms: this.config.get('additionalForms')
      });
    }

    if (this.userModel.authToken()) {
      this.schemas.fetch().then(() => {
        this.autoBuildUI();
      }, error => {
        this.errorView.render(...error);
      });
    } else {
      this.listenTo(this.userModel, 'change:authData', () => {
        this.$('#main_body').empty();
        this.schemas.fetch().then(() => {
          this.autoBuildUI();
        });
        this.render();
      });
    }
  }

  buildView() {
    this.sidebarView = new SidebarView({
      collection: new Collection(),
      app: this
    });
    this.headerView = new HeaderView({
      config: this.config.toJSON(),
      model: this.userModel
    });
    this.breadCrumb = new BreadCrumbView();
  }

  getParamFromQuery() {
    const params = {};
    const queryStrings = document.location.search.substr(1);

    if (queryStrings === '') {
      return params;
    }

    queryStrings.split('&').map(query => {
      const i = query.split('=');

      params[i[0].toString()] = i[1].toString();
    });

    return params;
  }

  autoBuildUIForSchema(schema) {
    const viewClass = {};
    const metadata = schema.get('metadata');
    const collection = schema.makeCollection();
    const route = schema.url().substr(1);
    const params = this.getParamFromQuery();
    const type = params.type || 'tenant';


    if (metadata.type !== undefined && metadata.type !== type) {
      return;
    }

    Object.assign(viewClass, this.viewClass, this.viewClass[schema.id]);

    if (schema.hasParent()) {
      const childTableView = () => {
        $('#alerts').empty();
        const endpoint = schema.apiEndpointBase() + '/' + history.fragment;
        const collection = schema.makeCollection(endpoint);

        if (this.view) {
          if (typeof this.view.close === 'function') {
            this.view.close();
          } else {
            this.view.remove();
          }
        }
        this.view = new viewClass.table({
          schema,
          collection,
          childview: true,
          fragment: history.fragment,
          app: this
        });

        this.$('#main_body').html(this.view.render().el);
        this.$('#main').addClass('active');
      };

      const childDetailView = (...params) => {
        $('#alerts').empty();
        const id = params[params.length - 2];
        let model = collection.get(id);

        if (model === undefined) {
          model = new collection.model({id});
        }

        if (this.view) {
          if (typeof this.view.close === 'function') {
            this.view.close();
          } else {
            this.view.remove();
          }
        }
        this.view = new viewClass.detail({
          schema,
          model,
          childview: true,
          fragment: history.fragment,
          app: this
        });

        this.$('#main_body').html(this.view.render().el);
        this.$('#main').addClass('active');
      };

      this.router.route(route, 'child_table_view', childTableView);
      this.router.route(route + '/:id', 'detail_view', childDetailView);
    } else {
      if (this.config.get('sidebar') === undefined) {
        this.sidebarView.collection.add({
          path: schema.get('url'),
          title: schema.get('title')
        });
      }

      const tableView = page => {
        $('#alerts').empty();

        if (this.view) {
          if (typeof this.view.close === 'function') {
            this.view.close();
          } else {
            this.view.remove();
          }
        }

        this.view = new viewClass.table({
          schema,
          collection,
          fragment: history.fragment,
          app: this,
          page
        });

        this.$('#main_body').html(this.view.render().el);
        this.$('#main').addClass('active');
      };

      const detailView = id => {
        $('#alerts').empty();
        let model = collection.get(id);

        if (model === undefined) {
          model = new collection.model({id});
        }

        if (this.view) {
          if (typeof this.view.close === 'function') {
            this.view.close();
          } else {
            this.view.remove();
          }
        }

        this.view = new viewClass.detail({
          schema,
          model,
          fragment: history.fragment,
          app: this
        });

        this.$('#main_body').html(this.view.render().el);
        this.$('#main').addClass('active');
      };

      this.router.route(route, 'table_view', tableView);
      this.router.route(route + '/page/:id', 'table_view', tableView);
      this.router.route(route + '/:id', 'detail_view', detailView);
    }
  }

  buildCustomUI() {
    if (this.config.get('sidebar') !== undefined) {
      this.config.get('sidebar').forEach((item, key) => {
        this.sidebarView.collection.add({
          path: item.path,
          title: item.title,
          cssClass: item.cssClass,
          order: key
        });
      });
    }

    this.config.get('routes').forEach(routes => {
      const customView = (data, ...params) => {
        const schema = this.schemas.get(routes.name);

        if (this.view) {
          if (typeof this.view.close === 'function') {
            this.view.close();
          } else {
            this.view.remove();
          }
        }

        if (schema === undefined) {
          this.view = new this.viewClass[routes.viewClass]({
            arguments: params,
            fragment: history.fragment,
            app: this,
            data
          });
          this.$('#main_body').append(this.view.render().el);
          this.$('#main').addClass('active');
        } else {
          const collection = schema.makeCollection();

          if (data !== null) {
            const model = new collection.model({id: data});

            this.view = new this.viewClass[routes.viewClass]({
              arguments: params,
              fragment: history.fragment,
              app: this,
              schema,
              model
            });

            this.$('#main_body').append(this.view.render().el);
            this.$('#main').addClass('active');
          } else {
            this.view = new this.viewClass[routes.viewClass]({
              arguments: params,
              fragment: history.fragment,
              app: this,
              schema,
              collection
            });

            this.$('#main_body').append(this.view.render().el);
            this.$('#main').addClass('active');
          }
        }
      };

      this.router.route(routes.path.substr(2), routes.name, customView);
    });
  }

  autoBuildUI() {
    this.schemas.each(schema => {
      this.autoBuildUIForSchema(schema);
    });
    this.buildCustomUI();
    history.loadUrl(history.fragment);
  }

  /**
   * Shows login page.
   */
  showLogin() {
    const loginView = new LoginView({
      model: this.userModel
    });

    this.$el.html(loginView.render().el);
  }

  /**
   * Renders page content.
   * @override View.render
   * @returns {AppView}
   */
  render() {
    if (!this.userModel.authToken()) {
      this.showLogin();
    } else {
      this.$el.html(template());
      this.$('#header').append(this.headerView.render().el);
      this.$('#sidebar').append(this.sidebarView.render().el);
      this.$('#bread-crumb').append(this.breadCrumb.render().el);
    }
    return this;
  }
}
