/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import ArrayField from './ArrayField';

chai.use(chaiEnzyme());
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
});
