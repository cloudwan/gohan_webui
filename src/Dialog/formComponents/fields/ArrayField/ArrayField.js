import React, {Component, PropTypes} from 'react';
import {Button, Intent, Tabs2, Tab2} from '@blueprintjs/core';

import {
  getWidget,
  getDefaultFormState,
  isMultiSelect,
  isFilesArray,
  isFixedItems,
  allowAdditionalItems,
  optionsList,
  retrieveSchema,
  toIdSchema,
  shouldRender,
  getDefaultRegistry,
  setState
} from 'react-jsonschema-form/lib/utils';
import FileWidget from '../../widgets/FileWidget';
import ArrayFieldTitle from './ArrayFieldTitle';
import ArrayFieldDescription from './ArrayFieldDescription';
import AddButton from './AddButton';

class ArrayField extends Component {
  static defaultProps = {
    uiSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
  };

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  getStateFromProps(props) {
    const formData = Array.isArray(props.formData) ? props.formData : null;
    const {definitions} = this.props.registry;
    return {
      items: getDefaultFormState(props.schema, formData, definitions) || []
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  get itemTitle() {
    const {schema} = this.props;
    return schema.items.title || schema.items.description || 'Item';
  }

  isItemRequired(itemsSchema) {
    return itemsSchema.type === 'string' && itemsSchema.minLength > 0;
  }

  asyncSetState(state, options = {validate: false}) {
    setState(this, state, () => {
      this.props.onChange(this.state.items, options);
    });
  }

  onAddClick = event => {
    event.preventDefault();
    const {items} = this.state;
    const {schema, registry} = this.props;
    const {definitions} = registry;
    let itemSchema = schema.items;
    if (isFixedItems(schema) && allowAdditionalItems(schema)) {
      itemSchema = schema.additionalItems;
    }
    this.asyncSetState({
      items: items.concat([
        getDefaultFormState(itemSchema, undefined, definitions)
      ])
    });
  };

  selectedTab = 'item0';

  onDropIndexClick = (index, changeTab) => {
    return event => {
      event.preventDefault();
      event.stopPropagation();
      this.asyncSetState({
        items: this.state.items.filter((_, i) => i !== index)
      }, {validate: true}); // refs #195
      if (changeTab) {
        const itemsLength = this.state.items.length;
        let newIndex = index - 1 < 0 ? 0 : index;
        newIndex = newIndex >= (itemsLength - 1) ? itemsLength - 2 : newIndex;
        this.selectedTab = `item${newIndex}`;
        this.forceUpdate();
      }
    };
  };

  onReorderClick = (index, newIndex, changeTab) => {
    return event => {
      event.preventDefault();
      event.target.blur();
      const {items} = this.state;
      this.asyncSetState({
        items: items.map((item, i) => {
          if (i === newIndex) {
            return items[index];
          } else if (i === index) {
            return items[newIndex];
          }
          return item;
        })
      }, {validate: true});
      if (changeTab) {
        this.selectedTab = `item${newIndex}`;
        this.forceUpdate();
      }
    };
  };

  onChangeForIndex = index => {
    return value => {
      this.asyncSetState({
        items: this.state.items.map((item, i) => {
          return index === i ? value : item;
        })
      });
    };
  };

  onSelectChange = value => {
    this.asyncSetState({items: value});
  };

  onTabChange = newTabId => {
    this.selectedTab = newTabId;
    this.forceUpdate();
  };


  render() {
    const {schema, uiSchema} = this.props;
    if (isFilesArray(schema, uiSchema)) {
      return this.renderFiles();
    }
    if (isFixedItems(schema)) {
      return this.renderFixedArray();
    }
    if (isMultiSelect(schema)) {
      return this.renderMultiSelect();
    }
    return this.renderNormalArray();
  }

  renderNormalArray() {
    const {
      schema,
      uiSchema,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      autofocus,
    } = this.props;
    const title = (schema.title === undefined) ? name : schema.title;
    const {items} = this.state;
    const {definitions, fields} = this.props.registry;
    const {TitleField, DescriptionField} = fields;
    const itemsSchema = retrieveSchema(schema.items, definitions);

    return (
      <fieldset className={`field field-array field-array-of-${itemsSchema.type}`}>
        <ArrayFieldTitle TitleField={TitleField}
          idSchema={idSchema}
          title={title}
          required={required}
        />
        {schema.description ?
          <ArrayFieldDescription DescriptionField={DescriptionField}
            idSchema={idSchema}
            description={schema.description}
          /> : null}

        <Button intent={Intent.PRIMARY} text="Add item"
          iconName="add" onClick={this.onAddClick}
          disabled={disabled || readonly}
        />
        {items.length ? <Tabs2 id={`tabs-${title}`} className="gohan-tabs"
          selectedTabId={this.selectedTab} onChange={this.onTabChange}>
          {
            items.map((item, index) => {
              const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;
              const itemIdPrefix = idSchema.$id + '_' + index;
              const itemIdSchema = toIdSchema(itemsSchema, itemIdPrefix, definitions);

              const panel = this.renderArrayFieldItem({
                index,
                canMoveUp: index > 0,
                canMoveDown: index < items.length - 1,
                itemSchema: itemsSchema,
                itemIdSchema,
                itemErrorSchema,
                itemData: items[index],
                itemUiSchema: uiSchema.items,
                autofocus: autofocus && index === 0
              });

              return (
                <Tab2 key={index} id={`item${index}`}
                  title={
                    <span>Item {index + 1}
                      <span className="pt-icon-remove" onClick={this.onDropIndexClick(index, true)}/>
                    </span>}
                  panel={panel}
                />
              );
            })
            }
        </Tabs2> : null
        }

      </fieldset>
    );
  }

  renderMultiSelect() {
    const {schema, idSchema, uiSchema, disabled, readonly, autofocus} = this.props;
    const {items} = this.state;
    const {widgets, definitions} = this.props.registry;
    const itemsSchema = retrieveSchema(schema.items, definitions);

    const Widget = getWidget(schema, uiSchema['ui:widget'] || 'select', widgets);
    return (
      <Widget id={idSchema && idSchema.$id}
        multiple={true}
        onChange={this.onSelectChange}
        options={{
          ...Widget.defaultProps.options,
          enumOptions: optionsList(itemsSchema),
        }}
        schema={schema}
        value={items}
        disabled={disabled}
        readonly={readonly}
        autofocus={autofocus}
      />
    );
  }

  renderFiles() {
    const {schema, idSchema, name, disabled, readonly, autofocus} = this.props;
    const title = schema.title || name;
    const {items} = this.state;
    return (
      <FileWidget id={idSchema && idSchema.$id}
        multiple={true}
        onChange={this.onSelectChange}
        schema={schema}
        title={title}
        value={items}
        disabled={disabled}
        readonly={readonly}
        autofocus={autofocus}
      />
    );
  }

  renderFixedArray() {
    const {
      schema,
      uiSchema,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      autofocus,
    } = this.props;
    const title = schema.title || name;
    let {items} = this.state;
    const {definitions, fields} = this.props.registry;
    const {TitleField} = fields;
    const itemSchemas = schema.items.map(item =>
      retrieveSchema(item, definitions));
    const additionalSchema = allowAdditionalItems(schema) ?
      retrieveSchema(schema.additionalItems, definitions) : null;

    if (!items || items.length < itemSchemas.length) {
      // to make sure at least all fixed items are generated
      items = items || [];
      items = items.concat(new Array(itemSchemas.length - items.length));
    }

    return (
      <fieldset className='field field-array field-array-fixed-items'>
        <ArrayFieldTitle TitleField={TitleField}
          idSchema={idSchema}
          title={title}
          required={required}
        />
        {schema.description ?
          <div className='field-description'>{schema.description}</div> : null}
        <div className='row array-item-list'>{
          items.map((item, index) => {
            const additional = index >= itemSchemas.length;
            const itemSchema = additional ?
              additionalSchema : itemSchemas[index];
            const itemIdPrefix = idSchema.$id + '_' + index;
            const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, definitions);
            const itemUiSchema = additional ?
              uiSchema.additionalItems || {} :
              Array.isArray(uiSchema.items) ?
                uiSchema.items[index] : uiSchema.items || {};
            const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;

            return this.renderArrayFieldItem({
              index,
              removable: additional,
              canMoveUp: index >= itemSchemas.length + 1,
              canMoveDown: additional && index < items.length - 1,
              itemSchema,
              itemData: item,
              itemUiSchema,
              itemIdSchema,
              itemErrorSchema,
              autofocus: autofocus && index === 0
            });
          })
        }</div>
        {
          additionalSchema ? <AddButton onClick={this.onAddClick}
            disabled={disabled || readonly}
          /> : null
        }
      </fieldset>
    );
  }

  renderArrayFieldItem({
    index,
    canMoveUp = true,
    canMoveDown = true,
    itemSchema,
    itemData,
    itemUiSchema,
    itemIdSchema,
    itemErrorSchema,
    autofocus
  }) {
    const {SchemaField} = this.props.registry.fields;
    const {uiSchema} = this.props;

    const {orderable} = {orderable: true, ...uiSchema['ui:options']};

    const _canMoveUp = orderable && canMoveUp;
    const _canMoveDown = orderable && canMoveDown;

    return (
      <div key={index} className='array-item'>
        <div style={{
          display: (_canMoveUp || _canMoveDown) ? 'flex' : 'none',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          fontSize: '0.9em'
        }}>
          <a onClick={this.onReorderClick(index, index - 1, true)} style={{
            order: 1,
            visibility: _canMoveUp ? 'visible' : 'hidden'
          }}>
            <span className="pt-icon-chevron-left"/> Move left
          </a>
          <a onClick={this.onReorderClick(index, index + 1, true)} style={{
            order: 2,
            visibility: _canMoveDown ? 'visible' : 'hidden'
          }}>
            Move right <span className="pt-icon-chevron-right"/>
          </a>
        </div>
        <div className="gohan-form-array-item">
          <SchemaField schema={itemSchema}
            uiSchema={itemUiSchema}
            formData={itemData}
            errorSchema={itemErrorSchema}
            idSchema={itemIdSchema}
            required={this.isItemRequired(itemSchema)}
            onChange={this.onChangeForIndex(index)}
            registry={this.props.registry}
            disabled={this.props.disabled}
            readonly={this.props.readonly}
            autofocus={autofocus}
          />
        </div>
      </div>
    );
  }
}

ArrayField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      orderable: PropTypes.bool
    })
  }),
  idSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.array,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  autofocus: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ])).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired
  }),
};

export default ArrayField;
