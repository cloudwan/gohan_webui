Gohan.SidebaritemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click a': function(e) {
      e.preventDefault();
      Backbone.history.navigate(this.model.get('path'), true);
    }
  },
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'remove', this.remove);
    this.$el.addClass('withripple');
    this.$el.addClass(this.model.get('class'));
  },
  // View methods
  // ------------
  render: function() {
    this.$el.html(JST['sideview_item.html']({
      source: this.model.toJSON()
    }));
    return this;
  }
});

Gohan.SidebarView = Backbone.View.extend({
  tagName: 'ul',
  className: 'document-row',
  initialize: function(options) {
    this.schemas = options.schemas;
    this.listenTo(this.collection, 'add', this.append);
  },
  // View methods
  // ------------
  render: function() {
    this.collection.each(function(model) {
      this.append(model);
    }, this);
    return this;
  },
  append: function(model) {
    var item_view = (new Gohan.SidebaritemView({
      model: model
    })).render();
    var index = this.collection.indexOf(model);
    if (index === 0) {
      this.$el.prepend(item_view.el);
    } else {
      item_view.$el.insertAfter(this.$el.children()[index - 1]);
    }
  },
  select: function(model) {
    this.$('.active').removeClass('active');
    if (model) {
      var index = this.collection.indexOf(model);
      $(this.$el.children()[index]).addClass('active');
    }
  }
});
