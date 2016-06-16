/* global $ */
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

  get className() {
    return 'appview';
  }

  constructor(options) {
    super(options);

    this.template = options.template || template;
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

    this.menuCollection = new Collection();

    this.userModel = options.userModel || new UserModel({
      url: this.config.get('authUrl')
    });

    this.schemas = options.schemas || new SchemaCollection({
      baseUrl: this.config.get('gohan').url,
      userModel: this.userModel,
      url: this.config.get('gohan').url + this.config.get('gohan').schema,
      additionalForms: this.config.get('additionalForms'),
      pageLimit: this.config.get('pageLimit'),
      addingRelationDialog: this.config.get('addingRelationDialog')
    });

    this.view = null;

    if (this.userModel.authToken()) {
      this.schemas.fetch().then(() => {
        this.buildUi();
      }, error => {
        this.errorView.render(...error);
      });
    } else {
      this.listenTo(this.userModel, 'change:authData', () => {
        this.$('#main_body').empty();
        this.schemas.fetch().then(() => {
          this.buildUi();
        });
        this.render();
      });
    }
    this.SidebarClass = options.SidebarClass || SidebarView;
    this.HeaderClass = options.HeaderClass || HeaderView;
    this.BreadCrumbClass = options.BreadCrumbClass || BreadCrumbView;
    this.LoginClass = options.LoginClass || LoginView;

    this.ErrorClass = options.ErrorClass || ErrorView;

    this.errorView = new this.ErrorClass();
    this.breadCrumb = new this.BreadCrumbClass();
    this.sidebarView = new this.SidebarClass({
      collection: this.menuCollection,
      config: this.config.toJSON(),
      app: this
    });

    this.headerView = new this.HeaderClass({
      collection: this.menuCollection,
      config: this.config.toJSON(),
      model: this.userModel,
      app: this
    });
  }

  closeActivePage() {
    if (this.view) {
      if (this.view.close) {
        this.view.close();
      } else {
        this.view.remove();
      }
    }
  }

  buildUi() {
    this.schemas.each(schema => {
      const params = this.router.getQueryParams();
      const metadata = schema.get('metadata');
      const type = params.type || 'tenant';

      if (metadata && metadata.type !== undefined && metadata.type !== type) {
        return;
      }

      const viewClass = Object.assign({}, this.viewClass, this.viewClass[schema.id]);
      const route = schema.url().substr(1);

      if (!schema.hasParent() && this.config.get('sidebar') === undefined) {
        this.menuCollection.add({
          path: schema.get('url'),
          title: schema.get('title')
        });
      }
      const tableView = () => {
        let collection = {};
        if (schema.hasParent()) {
          const endpoint = schema.apiEndpointBase() + '/' + history.fragment;
          collection = schema.makeCollection(endpoint);
        } else {
          collection = schema.makeCollection();
        }

        $('#alerts').empty();
        this.closeActivePage();

        this.view = new viewClass.table({
          schema,
          collection,
          childview: schema.hasParent(),
          fragment: history.fragment,
          app: this
        });

        this.$('#main_body').html(this.view.render().el);
      };

      const detailView = (...rest) => {
        const id = rest.length >= 2 ? rest[rest.length - 2] : '';
        const collection = schema.makeCollection();
        const model = collection.get(id) || new collection.model({id});

        $('#alerts').empty();
        this.closeActivePage();
        this.view = new viewClass.detail({
          schema,
          collection,
          model,
          fragment: history.fragment,
          app: this,
          polling: this.config.get('polling'),
          params
        });

        this.$('#main_body').html(this.view.render().el);
      };

      this.router.route(route, 'table_view', tableView);
      this.router.route(route + '/:id', 'detail_view', detailView);
    });

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

    this.config.get('routes').forEach(route => {
      const customView = (...rest) => {
        const schema = this.schemas.get(route.name);
        this.closeActivePage();
        if (schema === undefined) {
          this.view = new this.viewClass[route.viewClass]({
            arguments: rest,
            fragment: history.fragment,
            app: this
          });
          this.$('#main_body').append(this.view.render().el);
        } else {
          const collection = schema.makeCollection();
          if (rest) {
            const id = rest.length >= 2 ? rest[rest.length - 2] : '';
            const model = collection.get(id) || new collection.model({id});

            this.view = new this.viewClass[route.viewClass]({
              arguments: rest,
              fragment: history.fragment,
              app: this,
              schema,
              model,
              collection
            });
            this.$('#main_body').append(this.view.render().el);
          } else {
            this.view = new this.viewClass[route.viewClass]({
              arguments: rest,
              fragment: history.fragment,
              app: this,
              schema,
              collection
            });

            this.$('#main_body').append(this.view.render().el);
          }
        }
      };

      this.router.route(route.path.substr(2), route.name, customView);
    });

    history.loadUrl(history.fragment);
  }

  /**
   * Shows login page.
   */
  showLogin() {
    const loginView = new this.LoginClass({
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
      this.$el.html(this.template());
      this.$('#header').append(this.headerView.render().el);
      this.$('#sidebar').append(this.sidebarView.render().el);
      this.$('#bread-crumb').append(this.breadCrumb.render().el);
    }
    return this;
  }
}
