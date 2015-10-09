Gohan.SchemaView = Gohan.TableView.extend({
  toLocal: function(data){
    return data;
  },
  toServer: function(data){
    return data;
  },
  dialogForm: function(action, form_title, data, onsubmit) {
    var self = this;
    var form = $("<form></form>", self.$el);
    var schema = self.schema.filterByAction(action, self.parent_property);
    schema.propertiesOrder = ["id",
                              "singular",
                              "plural",
                              "title",
                              "description",
                              "parent",
                              "namespace",
                              "prefix"]
    schema.required = []

    var propertyColumns = [
        {
          id: "title",
          type: "string",
        },
        {
          id: "type",
          type: "string",
          enum: [
            "string",
            "boolean",
            "integer",
            "number",
            "array",
            "object",
          ]
        },
        {
          id: "description",
          type: "string",
        },
        {
          id: "required",
          type: "checkbox",
        }
    ];
    var properties = [];
    if(_.isUndefined(data.schema)){
        data.schema = {
            properties: {
                id: {
                    title: "ID",
                    type: "string",
                    description: "ID",
                    permission: ["create"],
                    view: ["detail"]
                },
                name: {
                    title: "Name",
                    type: "string",
                    description: "Name",
                    permission: ["create", "update"],
                },
                description: {
                    title: "Description",
                    type: "string",
                    description: "Description",
                    permission: ["create", "update"],
                },
                tenant_id: {
                    title: "Tenant ID",
                    type: "string",
                    description: "Tenant ID",
                    permission: ["create"],
                    view: ["detail"]
                }
            },
            propertiesOrder: [
                "id",
                "name",
                "description",
                "tenant_id"
            ]
        }
    }
    form.jsonForm({
      schema: schema,
      value: data,
      form: ['*'],
      onSubmit: function(errors, values) {
        var propertiesOrder = [];
        var required = [];
        var properties = {};
        $("#properties_table tbody tr").each(function(){
          var property = $(this).data("property");
          var id = property.id;
          if(_.isUndefined(id)){
            return;
          }
          if(properties[id]){
            return;
          }
          propertiesOrder.push(property.id);
          if(property.required){
            required.push(id);
          }
          delete property.id;
          delete property.required;
          properties[id] = property;
        });
        var schema = {
          type: "object",
          propertiesOrder: propertiesOrder,
          required: required,
          properties: properties
        };
        values.schema = schema;
        console.log(values)
        if (errors) {
          self.dialog.getButton('submit').stopSpin();
          self.dialog.enableButtons(true);
          self.dialog.setClosable(true);
          return
        }
        onsubmit(values);
      }
    });
    form.append($(JST["schema_form.html"]({
      JST: JST,
      propertyColumns: propertyColumns,
    })));
    var data_schema = data.schema || {}
    _.each(data_schema.propertiesOrder, function(id){
      var property = _.extend({}, data_schema.properties[id]);
      if(_.isUndefined(property)){
          return
      }
      var required = false;
      if(data_schema.required && data_schema.required.indexOf(id) >= 0){
        required = true;
      }
      property.id = id;
      property.required = required;
      properties.push(property);
    });
    var defaultProperty = {
      type: "string",
      permission: ["create", "update"]
    };
    properties.push(_.extend({}, defaultProperty));

    var addNewRow = function(property){
      var newRow = $(JST["property_form.html"]({
        propertyColumns: propertyColumns,
        property: property
      }));
      $(".id_form", newRow).change(ensureNewRow);
      $("#properties_table tbody", form).append(newRow);
      $("#id", newRow).change(function(){
        property["id"] = $(this).val();
      });
      newRow.data("property", property);
      _.each(propertyColumns, function(column){
        $("#" + column.id, newRow).change(function(){
          if(column.type == "checkbox") {
            property[column.id] = $(this).is(':checked');
          }else{
            property[column.id] = $(this).val();
          }
          console.log(property);
        });
      });
      $("button#detail", newRow).click(function(){
        var detailPane = $("<div style='width:500px;height:200px;'></div>")
        var ace = window.ace;
        var editor = ace.edit(detailPane.get(0));
        editor.getSession().setNewLineMode('unix');
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/yaml");
        editor.getSession().setTabSize(2);
        editor.$blockScrolling = "Infinity";
        var yaml = jsyaml.safeDump(property)
        editor.getSession().setValue(yaml);
        var dialog = BootstrapDialog.show({
          title: "Property Detail",
          closeByKeyboard: false,
          message: detailPane,
          spinicon: 'glyphicon glyphicon-refresh',
          onshown: function() {
            $('.modal-body').css({
              "max-height": $(window).height() - 200 + 'px'
            });
          },
          buttons: [{
            id: 'submit',
            label: 'Submit',
            cssClass: 'btn-primary btn-raised btn-material-blue-600',
            action: function(dialog) {
              var yaml = editor.getSession().getValue()
              var data = jsyaml.safeLoad(yaml);
              _.each(property, function(value, key){
                delete property[key];
              });
              _.each(data, function(value, key){
                property[key] = value;
              });
              dialog.close();
            }
          }]
        });
      });
    };
    var ensureNewRow = function(){
      var requireRow = true;
      $(".id_form", form).each(function(){
        if($(this).val() == ""){
          requireRow = false;
        }
      });
      if(requireRow){
        addNewRow(_.extend({}, defaultProperty));
      }
    };
    _.each(properties, function(property){
      addNewRow(property);
    });

    $("#properties_table tbody", form).sortable();
    form.prepend("<div id='alerts_form'></div>");
    self.dialog = BootstrapDialog.show({
      size: BootstrapDialog.SIZE_WIDE,
      type: BootstrapDialog.TYPE_DEFAULT,
      title: form_title,
      closeByKeyboard: false,
      message: form,
      spinicon: 'glyphicon glyphicon-refresh',
      onshown: function() {
        $('.modal-body').css({
          "max-height": $(window).height() - 200 + 'px'
        });
      },
      buttons: [{
        id: 'submit',
        label: 'Submit',
        cssClass: 'btn-primary btn-raised btn-material-blue-600',
        action: function(dialog) {
          self.dialog.enableButtons(false);
          self.dialog.setClosable(false);
          this.spin();
          form.submit();
        }
      }]
    });
  },

})
