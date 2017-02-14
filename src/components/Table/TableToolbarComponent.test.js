/* global it, describe */
import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import {shallow} from 'enzyme';

import {Button} from '@blueprintjs/core';
import TableToolbar from './TableToolbarComponent';

chai.use(chaiEnzyme());
chai.use(spies);
chai.should();

describe('< TableToolbarComponent />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={() => {}}
        filterProperties={[]} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 2 Buttons', () => {
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={() => {}}
        filterProperties={[]} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.find(Button).should.have.length(2);
  });

  it('should contain 4 divs', () => {
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={() => {}}
        filterProperties={[]} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.find('div').should.have.length(6);
  });

  it('should contain 1 select', () => {
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={() => {}}
        filterProperties={[]} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.find('select').should.have.length(1);
  });

  it('should contain 1 span', () => {
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={() => {}}
        filterProperties={[]} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.find('span').should.have.length(1);
  });

  it('should contain 1 input', () => {
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={() => {}}
        filterProperties={[]} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.find('input').should.have.length(1);
  });

  it('should contain 2 options', () => {
    const filterProperties = ['item1', 'item2'];
    const properties = {
      item1: {
        title: 'item1 title'
      },
      item2: {
        title: 'item2 title'
      }
    };
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={() => {}}
        filterProperties={filterProperties} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={properties}
      />
    );

    wrapper.find('option').should.have.length(2);
  });

  it('should call filterData', (done) => {
    const filterData = chai.spy(() => {done();});
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={filterData}
        filterProperties={[]} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.find('input').at(0).simulate('change', {
      preventDefault: () => {}, stopPropagation: () => {}, target: {value: 'test'}
    });


  });

  it('should call filterData with undefined argument', (done) => {
    const filterData = chai.spy(() => {done();});
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={filterData}
        filterProperties={[]} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.find('input').at(0).simulate('change', {
      preventDefault: () => {}, stopPropagation: () => {}, target: {value: ''}
    });
  });

  it('should call deleteMultipleResources', () => {
    const deleteMultipleResources = chai.spy();
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={() => {}}
        filterProperties={[]} deleteMultipleResources={deleteMultipleResources}
        buttonDeleteSelectedDisabled={false} properties={{}}
      />
    );

    wrapper.find(Button).at(1).simulate('click');
    deleteMultipleResources.should.have.been.called.once; // eslint-disable-line no-unused-expressions
  });

  it('should call filterData from handleMenuItemSelected', (done) => {
    const filterData = chai.spy(() => {done();});
    const filterProperties = ['item1', 'item2'];
    const properties = {
      item1: {
        title: 'item1 title'
      },
      item2: {
        title: 'item2 title'
      }
    };
    const wrapper = shallow(
      <TableToolbar handleOpenModal={() => {}} filterValue={''}
        filterBy={''} singular={''}
        options={[]} filterData={filterData}
        filterProperties={filterProperties} deleteMultipleResources={() => {}}
        buttonDeleteSelectedDisabled={false} properties={properties}
      />
    );

    wrapper.find('select').at(0).simulate('change', {
      preventDefault: () => {}, stopPropagation: () => {}, target: {value: 'test'}
    });
  });
});
