import React, {Component,} from 'react';

import Asterisk from '../../components/Asterisk';
import Label from '../../components/Label';
import Description from '../../components/Description';
import Errors from '../../components/Errors';
import SortableList from '../../components/SortableList';
import SortableListItem from '../../components/SortableListItem';
import Button from '../../components/Button';

import Tabs from '../../components/Tabs/Tabs';
import Tab from '../../components/Tabs/Tab';

import Input from './Input';
import Checkbox from './Checkbox';
import Select from './Select';

import ArrayItemActions from './components/ArrayItemActions';
import ArrayItemBody from './components/ArrayItemBody';
import ArrayItemSort from './components/ArrayItemSort';
import ArrayItemBar from './components/ArrayItemBar';
import ObjectField from './ObjectField';

export default class ArrayField extends Component {
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

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: this.props.value === undefined ? [] : this.props.value,
      errors: [],
      selectedTabId: 0
    };
  }

  items = [];

  get value() {
    if (this.state.value === null) {
      return this.state.value;
    }

    return this.items.filter(item => Boolean(item)).map(item => item.value);
  }

  get isValid() {
    const value = this.value;
    const errors = [];
    const {
      isRequired,
    } = this.props;

    if (isRequired && Array.isArray(value) && value.length === 0) {
      errors.push({
        message: 'required',
      });
    }

    this.setState({errors});

    return this.items.filter(item => Boolean(item)).reduce((result, item) => {
      const testedItem = item.isValid;

      if (result === false) {
        return result;
      } else if (testedItem === false) {
        return false;
      }

      return result;
    }, errors.length === 0);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  }

  handlerAddButtonClick = () => {
    const newValue = this.value.concat([this.props.schema.items.default]);

    this.setState({value: newValue});
  };

  handlerRemoveButtonClick = itemIndex => event => {
    event.preventDefault();
    event.stopPropagation();

    const newValue = this.value.filter((_, index) => index !== itemIndex);
    let {selectedTabId} = this.state;

    if (selectedTabId >= newValue.length && selectedTabId !== 0) {
      selectedTabId -= 1;
    }

    this.setState({value: newValue, selectedTabId});
  };

  handlerReorderClick = (oldIndex, newIndex) => {
    return event => {
      event.preventDefault();
      event.target.blur();

      const newValue = this.value;

      this.setState({
        selectedTabId: newIndex,
        value: ArrayField.reorderList(newValue, oldIndex, newIndex)
      });
    };
  };

  handlerReorderMoved = ({oldIndex, newIndex}) => {
    const newValue = this.value;

    this.setState({
      value: ArrayField.reorderList(newValue, oldIndex, newIndex)
    });
  };

  handlerReorderStarted = () => {
    this.setState({value: this.value});
  };

  handlerTabChange = indexTab => {
    this.setState({
      selectedTabId: indexTab,
      value: this.value
    });
  };

  renderArrayFieldItem(index, value) {
    const {
      items,
    } = this.props.schema;

    const property = items;
console.log(property);
    const type = Array.isArray(property.type) ? property.type[0] : property.type;
    const isNullable = Array.isArray(property.type) && property.type.includes('null');

    if (type === 'boolean') {
      return (
        <Checkbox ref={c => {this.items[index] = c;}}
          name={property.title || index}
          description={property.description}
          schema={property}
          type={type}
          value={value}
        />
      );
    } else if (property.enum) {
      return (
        <Select ref={c => {this.items[index] = c;}}
          name={property.title || index}
          description={property.description}
          schema={property}
          haystack={property.enum}
          type={type}
          value={value}
          isNullable={isNullable}
        />
      );
    }
    return (
      <Input ref={c => {this.items[index] = c;}}
        name={property.title || index}
        description={property.description}
        schema={property}
        type={type}
        value={value}
        isNullable={isNullable}
      />
    );
  }

  renderObjectArray() {
    const {
      name,
      schema,
      description,
      isRequired,
    } = this.props;

    const {
      value,
      errors,
      selectedTabId,
    } = this.state;

    return (
      <div>
        <Label htmlFor={name}>
          {name}{isRequired && <Asterisk />}
        </Label>
        <Description>
          {description}
        </Description>
        <Button text={'Add item'}
          iconName={'add'}
          onClick={this.handlerAddButtonClick}
          isMinimal={true}
        />
        <Tabs selectedTabId={selectedTabId}
          onChange={this.handlerTabChange}>
          {value.map((item, index) => (
            <Tab key={index}
              title={
                <span>
                  {`Item ${index + 1} `}
                  <Button iconName={'remove'}
                    isMinimal={true}
                    onClick={this.handlerRemoveButtonClick(index)}
                  />
                </span>
            }
              panel={
                <div>
                  <ArrayItemBar>
                    <Button iconName="chevron-left"
                      text="Move Left"
                      isMinimal={true}
                      disabled={index === 0}
                      onClick={this.handlerReorderClick(index, index - 1)}
                    />
                    <Button rightIconName="chevron-right"
                      text="Move Right" isMinimal={true}
                      disabled={index === value.length - 1}
                      onClick={this.handlerReorderClick(index, index + 1)}
                    />
                  </ArrayItemBar>
                  <ObjectField ref={c => {this.items[index] = c}}
                    schema={schema.items}
                    value={item}
                  />
                </div>
            }
            />
          ))}
        </Tabs>
        <Errors errors={errors} />
      </div>
    );
  }

  renderNormalArray() {
    const {
      name,
      description,
      isRequired,
    } = this.props;

    const {
      value,
      errors,
    } = this.state;

    return (
      <div>
        <Label htmlFor={name}>
          {name}{isRequired && <Asterisk />}
        </Label>
        <Description>
          {description}
        </Description>
        <SortableList pressDelay={500}
          shouldCancelStart={this.handlerReorderStarted}
          onSortEnd={this.handlerReorderMoved}
          helperClass={'list-sortable-active'}
          lockAxis={'y'}
          lockToContainerEdges={true}>
          {value.map((item, index) => (
            <SortableListItem index={index}
              key={index}>
              <ArrayItemActions>
                <Button iconName={'remove'}
                  isMinimal={true}
                  onClick={this.handlerRemoveButtonClick(index)}
                />
              </ArrayItemActions>
              <ArrayItemBody>
                {this.renderArrayFieldItem(index, item)}
              </ArrayItemBody>
              <ArrayItemSort>
                <Button iconName={'chevron-up'}
                  text={'Up'}
                  isMinimal={true}
                  disabled={index === 0}
                  onClick={this.handlerReorderClick(index, index - 1)}
                />
                <Button iconName={'chevron-down'}
                  text={'Down'}
                  isMinimal={true}
                  disabled={index === value.length - 1}
                  onClick={this.handlerReorderClick(index, index + 1)}
                />
              </ArrayItemSort>
            </SortableListItem>
          ))}
          <Button text={'Add item'}
            iconName={'add'}
            onClick={this.handlerAddButtonClick}
            isMinimal={true}
          />
        </SortableList>
        <Errors errors={errors} />
      </div>
    );
  }

  render() {
    const {schema} = this.props;

    if (schema.items.type === 'object') {
      return this.renderObjectArray();
    }

    return this.renderNormalArray();
  }
}
