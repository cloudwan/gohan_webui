import React, {Component, PropTypes} from 'react';
import {Button, Intent} from '@blueprintjs/core';
import {ArraySortableItem} from './ArraySortableItem';

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
import {ArraySortableList} from './ArraySortableList';

export default class ArrayField extends Component {
  static defaultProps = {
    uiSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
  };

  static reorderList(items, oldIndex, newIndex) {
    const array = [...items];
    if (newIndex === oldIndex) {
      return array;
    }

    const target = array[oldIndex];
    const step = newIndex < oldIndex ? -1 : 1;

    for (let k = oldIndex; k !== newIndex; k += step) {
      array[k] = array[k + step];
    }
    array[newIndex] = target;
    return array;
  }

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

  onDropIndexClick = (index) => {
    return event => {
      event.preventDefault();
      event.stopPropagation();
      this.asyncSetState({
        items: this.state.items.filter((_, i) => i !== index)
      }, {validate: true});
    };
  };

  onReorderMoved = ({oldIndex, newIndex}) => {
    const {items} = this.state;
    this.asyncSetState({
      items: ArrayField.reorderList(items, oldIndex, newIndex)
    }, {validate: true});
  };

  onReorderClick = (oldIndex, newIndex) => {
    return event => {
      event.preventDefault();
      event.target.blur();
      const {items} = this.state;
      this.asyncSetState({
        items: ArrayField.reorderList(items, oldIndex, newIndex)
      }, {validate: true});
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
    const {orderable} = {orderable: true, ...uiSchema['ui:options']};

    return (
      <div className={`field field-array field-array-of-${itemsSchema.type}`}>
        <ArrayFieldTitle TitleField={TitleField}
          idSchema={idSchema}
          title={title}
          required={required}
        />
        {
          schema.description &&
            <ArrayFieldDescription DescriptionField={DescriptionField}
              idSchema={idSchema}
              description={schema.description}
            />
        }

        <ArraySortableList pressDelay={500} onSortEnd={this.onReorderMoved}
          helperClass="list-sortable-active" lockAxis="y"
          lockToContainerEdges={true}>
          {
            items.map((value, index) => {
              const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;
              const itemIdPrefix = idSchema.$id + '_' + index;
              const itemIdSchema = toIdSchema(itemsSchema, itemIdPrefix, definitions);

              return (
                <ArraySortableItem key={index} index={index}
                  disabled={!orderable}>
                  <div className="action">
                    <Button intent={Intent.PRIMARY} iconName="remove"
                      className="pt-minimal" onClick={this.onDropIndexClick(index)}
                    />
                  </div>
                  <div className="body">
                    {
                      this.renderArrayFieldItem({
                        index,
                        canMoveUp: index > 0,
                        canMoveDown: index < items.length - 1,
                        itemSchema: itemsSchema,
                        itemIdSchema,
                        itemErrorSchema,
                        itemData: items[index],
                        itemUiSchema: uiSchema.items,
                        autofocus: autofocus && index === 0
                      })
                    }
                  </div>
                  {
                    orderable && (
                      <div className="sort">
                        <Button intent={Intent.PRIMARY} iconName="chevron-up"
                          text="Up" className="pt-minimal"
                          disabled={index === 0} onClick={this.onReorderClick(index, index - 1)}
                        />
                        <Button intent={Intent.PRIMARY} iconName="chevron-down"
                          text="Down" className="pt-minimal"
                          disabled={index === items.length - 1} onClick={this.onReorderClick(index, index + 1)}
                        />
                      </div>
                    )
                  }
                </ArraySortableItem>
              );
            })
          }
          <Button intent={Intent.PRIMARY} text="Add item"
            iconName="add" onClick={this.onAddClick}
            disabled={disabled || readonly} className="pt-minimal"
          />
        </ArraySortableList>
      </div>
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
    itemSchema,
    itemData,
    itemUiSchema,
    itemIdSchema,
    itemErrorSchema,
    autofocus
  }) {
    const {SchemaField} = this.props.registry.fields;

    return (
      <div className='array-item'>
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

if (process.env.NODE_ENV !== 'production') {
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
}
