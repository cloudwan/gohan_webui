/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import ObjectField from './ObjectField';

chai.use(chaiEnzyme());
chai.should();
const expect = chai.expect;

describe('< ObjectField />', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <ObjectField schema={{}} onChange={() => {}} />
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain 1 div when schema.properties not passed', () => {
    const wrapper = shallow(
      <ObjectField schema={{}} onChange={() => {}} />
    );

    wrapper.find('div').should.have.length(1);
  });

  it('should contain 1 paragraph when schema.properties not passed', () => {
    const wrapper = shallow(
      <ObjectField schema={{}} onChange={() => {}} />
    );

    wrapper.find('p').should.have.length(1);
  });

  it('should contain 1 pre when schema.properties not passed', () => {
    const wrapper = shallow(
      <ObjectField schema={{}} onChange={() => {}} />
    );

    wrapper.find('pre').should.have.length(1);
  });

  it('should contain 1 fieldset', () => {
    const schema = {
      title: 'test title',
      properties: {},
      propertiesOrder: []
    };
    const wrapper = shallow(
      <ObjectField schema={schema} onChange={() => {}} />
    );

    wrapper.find('fieldset').should.have.length(1);
  });

  it('should contain 1 TitleField', () => {
    const schema = {
      title: 'test title',
      properties: {},
      propertiesOrder: []
    };
    const wrapper = shallow(
      <ObjectField schema={schema} onChange={() => {}} />
    );

    wrapper.find('TitleField').should.have.length(1);
  });

  it('should contain 1 DescriptionField', () => {
    const schema = {
      title: 'test title',
      description: 'test description',
      properties: {},
      propertiesOrder: []
    };
    const idSchema = {
      $id: '0'
    };
    const wrapper = shallow(
      <ObjectField schema={schema} idSchema={idSchema}
        onChange={() => {}}
      />
    );

    wrapper.find('DescriptionField').should.have.length(1);
  });

  it('should contain 1 SchemaField', () => {
    const schema = {
      title: 'test title',
      description: 'test description',
      properties: {
        test: {
          type: 'boolean',
          title: 'title'
        }
      },
      propertiesOrder: ['test'],
      required: ['test']
    };
    const wrapper = mount(
      <ObjectField schema={schema} onChange={() => {}} />
    );

    wrapper.find('SchemaField').should.have.length(1);
  });

  it('should have 0 TitleField when no title or name passed within schema', () => {
    const schema = {
      properties: {}
    };
    const wrapper = shallow(
      <ObjectField schema={schema} onChange={() => {}} />
    );

    wrapper.find('TitleField').should.have.length(0);
  });

  it('should have 0 DescriptionField when no description passed within schema', () => {
    const schema = {
      properties: {}
    };
    const wrapper = shallow(
      <ObjectField schema={schema} onChange={() => {}} />
    );

    wrapper.find('DescriptionField').should.have.length(0);
  });

  it('should have not changed state in componentWillReceiveProps', () => {
    const schema = {
      title: 'test title',
      description: 'test description',
      properties: {
        test: {
          type: 'boolean',
          title: 'title'
        }
      },
      required: ['test']
    };
    const wrapper = mount(
      <ObjectField schema={schema} onChange={() => {}} />
    );

    wrapper.update();
    expect(wrapper.state('test')).to.be.equal(undefined);
  });

});
