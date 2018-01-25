/* global it, describe */
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import {shallow, mount} from 'enzyme';

import {Sidebar} from './Sidebar';

import Search from './components/Search';
import Menu from './components/Menu';
import MenuItem from './components/MenuItem';
import MenuCategory from './components/MenuCategory';
import Container from './components/Container';

chai.use(chaiEnzyme());
chai.should();

describe('< Sidebar />', function () {
  it('should exist', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.should.not.equal(undefined);
  });

  it('should contain one < Container />', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.find(Container).should.have.length(1);
  });

  it('should contain one < Search />', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.find(Search).should.have.length(1);
  });

  it('should contain one < Menu />', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.find(Menu).should.have.length(1);
  });

  it('shouldn\'t render empty categories', () => {
    const categories = [
      {
        title: 'Favorites',
        items: [],
      },
      {
        title: 'Others',
        items: [],
      },
    ];

    const wrapper = mount(
      <Sidebar categories={categories} />
    );

    const menuCategories = wrapper.find(MenuCategory);
    menuCategories.should.have.length(0);

  });

  it('should contain favorites, one category and others with correct menu items', () => {
    const categories = [
      {
        title: 'Favorites',
        items: [
          {
            title: 'title1',
            path: '#/plural1',
          },
        ]
      },
      {
        title: 'category1',
        items: [
          {
            title: 'title1',
            path: '#/plural1',
          },
        ],
      },
      {
        title: 'Others',
        items: [
          {
            title: 'title2',
            path: '#/plural2',
          },
        ],
      }
    ];

    const wrapper = mount(
      <Sidebar categories={categories} />
    );

    const menuCategories = wrapper.find(MenuCategory);
    menuCategories.should.have.length(3);

    const favorites = menuCategories.at(0);
    const category1 = menuCategories.at(1);
    const others = menuCategories.at(2);

    favorites.props().title.should.equal('Favorites');
    category1.props().title.should.equal('category1');
    others.props().title.should.equal('Others');

    const favoriteItems = favorites.find(MenuItem);
    const category1Items = category1.find(MenuItem);
    const otherItems = others.find(MenuItem);

    favoriteItems.should.have.length(1);
    favoriteItems.at(0).props().text.should.equal('title1');
    favoriteItems.at(0).props().href.should.equal('#/plural1');

    category1Items.should.have.length(1);
    category1Items.at(0).props().text.should.equal('title1');
    category1Items.at(0).props().href.should.equal('#/plural1');

    otherItems.should.have.length(1);
    otherItems.at(0).props().text.should.equal('title2');
    otherItems.at(0).props().href.should.equal('#/plural2');
  });

  it('should have initial state', () => {
    const wrapper = shallow(
      <Sidebar/>
    );

    wrapper.state('searchQuery').should.be.equal('');
  });

  it('should call handle onChange function', () => {
    const wrapper = shallow(
      <Sidebar/>
    );


    wrapper.find(Search).props().onChange({target: {value: 'test'}});
    wrapper.state().searchQuery.should.equal('test');
  });

  it('should highlight a matching menu item', () => {
    const categories = [
      {
        title: 'Favorites',
        items: [
          {
            title: 'title1',
            path: '#/plural1',
          },
        ]
      },
      {
        title: 'category1',
        items: [
          {
            title: 'title1',
            path: '#/plural1',
          },
          {
            title: 'title2',
            path: '#/v1.0/matchingpath',
          }
        ]
      }
    ];
    const wrapper = mount(
      <Sidebar pathname={'/plural1'}
        categories={categories}
      />
    );

    const menuCategories = wrapper.find(MenuCategory);
    const favorites = menuCategories.at(0);
    const category1 = menuCategories.at(1);

    favorites.find(MenuItem).findWhere(item => item.props().isActive === true).should.have.length(1);
    category1.find(MenuItem).findWhere(item => item.props().isActive === true).should.have.length(1);
  });
});
