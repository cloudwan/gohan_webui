/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import ArrayField from './ArrayField';

chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.should();

describe('< ArrayField />', () => {
  it('reorderList', () => {
    ArrayField.reorderList([1, 2, 3, 4, 5], 2, 4).should.deep.equal([1, 2, 4, 5, 3]);
    ArrayField.reorderList([1, 2, 3, 4, 5], 4, 0).should.deep.equal([5, 1, 2, 3, 4]);
    ArrayField.reorderList([1, 2, 3, 4, 5], 4, 4).should.deep.equal([1, 2, 3, 4,5]);

    // Test array reference. Function should returns new array.
    const testArray = [1,2,3];
    ArrayField.reorderList(testArray, 4, 4).should.not.equal(testArray);
  });
  it('should render without errors array field', () => {
    const wrapper = shallow(
      <ArrayField schema={{type: 'array', items: {name: {type: 'string'}}}} onChange={() => {}}/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should call onChange with appropriate items on componentDidMount', () => {
    const onChange = sinon.spy();
    const wrapper = mount( // eslint-disable-line
      <ArrayField onChange={onChange}
        required={true}
        schema={{
          default: [],
          items: {
            properties: {
              name: {
                type: 'string'
              }
            },
            type: 'object',
          },
          type: 'array',
        }}
      />
    );

    onChange.should.callCount(1);
    onChange.should.have.been.calledWith([{name: undefined}], {validate: false});
  });

  it('should not call onChange on componentDidMount when field isn\'t required', () => {
    const onChange = sinon.spy();
    mount( // eslint-disable-line
      <ArrayField onChange={onChange}
        schema={{
          default: [],
          items: {
            properties: {
              name: {
                type: 'string'
              }
            },
            type: 'object',
          },
          type: 'array',
        }}
      />
    );

    onChange.should.callCount(0);
  });

  it('should not call onChange when field has data before componentDidMount', () => {
    const onChange = sinon.spy();
    mount( // eslint-disable-line
      <ArrayField onChange={onChange}
        required={true}
        schema={{
          minItems: 1,
          items: {
            properties: {
              ranges: {
                minItems: 1,
                items: {
                  type: 'string',
                },
                type: 'array'
              }
            },
            required: ['ranges'],
            type: 'object',
          },
          type: 'array',
        }}
      />
    );

    onChange.should.callCount(0);
  });
});
