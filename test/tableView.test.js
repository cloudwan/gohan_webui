var TableView = require('./../app/js/views/tableView');
var should = require('chai').should();

var listMockup;
var schemaMockup;

var tableView;

beforeEach(function() {
  listMockup = require('./mock/tableViewList.mock');
  schemaMockup = require('./mock/tableViewSchema.mock');

  tableView = new TableView({
    schema: {
      toJSON: function() {
        return schemaMockup;
      }
    },
    collection: {
      fetch: function() {},
      map: function() {
        return listMockup;
      }
    },
    fragment: '',
    app: {
      router: {

      }
    },
    page: '1'
  });
});

describe('TableView', function() {
  describe('Create tableView object.', function() {
    it('should create object', function() {
      tableView.should.be.a('object');
    });
  });

  describe('filterArray()', function() {
    it('should return the same array (filter by empty string)', function() {
      tableView.filterArray(listMockup, '').should.to.deep.equal(listMockup);
    });
    it('should return the array length 5 (filter by string 10)', function() {
      tableView.filterArray(listMockup, '10').should.to.have.length(1);
    });
  });

  describe('sortArray()', function() {
    it('should return the sorted array (sorted by name)', function() {
      tableView.sortArray(listMockup, 'name', false)[0].should.to.deep.equal(listMockup[13]);
    });
    it('should return the sorted array (sorted by name and reversed)', function() {
      tableView.sortArray(listMockup, 'name', true)[0].should.to.deep.equal(listMockup[12]);
    });
    it('should return the same array (sorted by wrong column name)', function() {
      tableView.sortArray(listMockup, 'foo_bar_baz', false).should.to.deep.equal(listMockup);
    });
  });

  describe('render ui with out eny action', function() {
    beforeEach(function() {
      tableView.render();
    });

    it('should search field be empty', function() {
      tableView.$el.find('input.search').val().should.to.equal('');
    });

    it('should active 1 page button', function() {
      tableView.$el.find('li.active > a').text().should.to.equal('1');
      tableView.$el.find('li.active > a').data('id').should.to.equal(1);
    });

    it('should disable prev button', function() {
      tableView.$el.find('li.disabled > a > span').text().should.to.equal('«');
      tableView.$el.find('li.disabled > a').data('id').should.to.equal('prev');
    });

    it('should enable next button', function() {
      tableView.$el.find('li:not(.disabled) > a[data-id="next"] > span').text().should.to.equal('»');
      tableView.$el.find('li:not(.disabled) > a[data-id="next"]').should.to.be.ok;
    });

    it('should only 1 page be shown', function() {
      tableView.$el.find('tbody:not(.hidden)').should.to.have.length(1);
    });

    it('should 1st page be shown', function() {
      tableView.$el.find('tbody:not(.hidden)')[0].id.should.to.equal('page1');
    });

    it('should list have 10 elements', function() {
      tableView.$el.find('tbody:not(.hidden) > tr').should.to.have.length(10);
    });
  });

  describe('render ui with change page action by click next page button', function() {
    beforeEach(function() {
      Backbone.history.stop();
      Backbone.history.start();
      tableView.render();
    });

    beforeEach(function() {
      tableView.$el.find('li:not(.disabled) > a[data-id="next"]').click();
    });

    it('should search field be empty', function() {
      tableView.$el.find('input.search').val().should.to.equal('');
    });

    it('should active 2 page button', function() {
      tableView.$el.find('li.active > a').text().should.to.equal('2');
      tableView.$el.find('li.active > a').data('id').should.to.equal(2);
    });

    it('should disable next button', function() {
      tableView.$el.find('li.disabled > a > span').text().should.to.equal('»');
      tableView.$el.find('li.disabled > a').data('id').should.to.equal('next');
    });

    it('should enable prev button', function() {
      tableView.$el.find('li:not(.disabled) > a[data-id="prev"] > span').text().should.to.equal('«');
      tableView.$el.find('li:not(.disabled) > a[data-id="prev"]').should.to.be.ok;
    });

    it('should only 1 page be shown', function() {
      tableView.$el.find('tbody:not(.hidden)').should.to.have.length(1);
    });

    it('should 2nd page be shown', function() {
      tableView.$el.find('tbody:not(.hidden)')[0].id.should.to.equal('page2');
    });

    it('should list have 4 elements', function() {
      tableView.$el.find('tbody:not(.hidden) > tr').should.to.have.length(4);
    });
  });

  describe('render ui with change page action by click prev page button', function() {
    beforeEach(function() {
      Backbone.history.stop();
      Backbone.history.start();
      tableView.render();
    });

    beforeEach(function() {
      tableView.$el.find('li:not(.disabled) > a[data-id="next"]').click();
    });

    beforeEach(function() {
      tableView.$el.find('li:not(.disabled) > a[data-id="prev"]').click();
    });

    it('should search field be empty', function() {
      tableView.$el.find('input.search').val().should.to.equal('');
    });

    it('should active 2 page button', function() {
      tableView.$el.find('li.active > a').text().should.to.equal('1');
      tableView.$el.find('li.active > a').data('id').should.to.equal(1);
    });

    it('should disable prev button', function() {
      tableView.$el.find('li.disabled > a > span').text().should.to.equal('«');
      tableView.$el.find('li.disabled > a').data('id').should.to.equal('prev');
    });

    it('should enable next button', function() {
      tableView.$el.find('li:not(.disabled) > a[data-id="next"] > span').text().should.to.equal('»');
      tableView.$el.find('li:not(.disabled) > a[data-id="next"]').should.to.be.ok;
    });

    it('should only 1 page be shown', function() {
      tableView.$el.find('tbody:not(.hidden)').should.to.have.length(1);
    });

    it('should 2nsd page be shown', function() {
      tableView.$el.find('tbody:not(.hidden)')[0].id.should.to.equal('page1');
    });

    it('should list have 10 elements', function() {
      tableView.$el.find('tbody:not(.hidden) > tr').should.to.have.length(10);
    });
  });

  describe('search input', function() {
    beforeEach(function() {
      Backbone.history.stop();
      Backbone.history.start();
      tableView.render();
    });

    beforeEach(function() {
      tableView.$el.find('input.search').val('Test 1').trigger('keyup');
    });

    it('should search field be not empty "Test 1"', function() {
      tableView.$el.find('input.search').val().should.to.equal('Test 1');
    });

    it('should list have 10 elements', function() {
      tableView.$el.find('tbody:not(.hidden) > tr').should.to.have.length(5);
    });
  });

  describe('sort list by name', function() {
    beforeEach(function() {
      tableView.render();
    });

    beforeEach(function() {
      tableView.$el.find('a.title[data-id="name"]').click();
    });

    it('should 1st element to contains "a Test" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[0].firstElementChild.innerText.should.to.contains('a Test');
    });

    it('should 2nd element to contains "Test 1" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[1].firstElementChild.innerText.should.to.contains('Test 1');
    });

    it('should 3rd element to contains "Test 10" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[2].firstElementChild.innerText.should.to.contains('Test 10');
    });
    it('should 4th element to contains "Test 11" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[3].firstElementChild.innerText.should.to.contains('Test 11');
    });
    it('should 5th element to contains "Test 12" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[4].firstElementChild.innerText.should.to.contains('Test 12');
    });
    it('should 6th element to contains "Test 13" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[5].firstElementChild.innerText.should.to.contains('Test 13');
    });
    it('should 7th element to contains "Test 2" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[6].firstElementChild.innerText.should.to.contains('Test 2');
    });
    it('should 8th element to contains "Test 3" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[7].firstElementChild.innerText.should.to.contains('Test 3');
    });
    it('should 9th element to contains "Test 4" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[8].firstElementChild.innerText.should.to.contains('Test 4');
    });
    it('should 10th element to contains "Test 5" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[9].firstElementChild.innerText.should.to.contains('Test 5');
    });
  });

  describe('sort list by name reverse', function() {
    beforeEach(function() {
      tableView.render();
    });

    beforeEach(function() {
      tableView.$el.find('a.title[data-id="name"]').click();
    });

    beforeEach(function() {
      tableView.$el.find('a.title[data-id="name"]').click();
    });

    it('should 1st element to contains "Test 9" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[0].firstElementChild.innerText.should.to.contains('Test 9');
    });

    it('should 2nd element to contains "Test 8" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[1].firstElementChild.innerText.should.to.contains('Test 8');
    });

    it('should 3rd element to contains "Test 7" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[2].firstElementChild.innerText.should.to.contains('Test 7');
    });
    it('should 4th element to contains "Test 6" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[3].firstElementChild.innerText.should.to.contains('Test 6');
    });
    it('should 5th element to contains "Test 5" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[4].firstElementChild.innerText.should.to.contains('Test 5');
    });
    it('should 6th element to contains "Test 4" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[5].firstElementChild.innerText.should.to.contains('Test 4');
    });
    it('should 7th element to contains "Test 3" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[6].firstElementChild.innerText.should.to.contains('Test 3');
    });
    it('should 8th element to contains "Test 2" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[7].firstElementChild.innerText.should.to.contains('Test 2');
    });
    it('should 9th element to contains "Test 13" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[8].firstElementChild.innerText.should.to.contains('Test 13');
    });
    it('should 10th element to contains "Test 12" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[9].firstElementChild.innerText.should.to.contains('Test 12');
    });
  });

  describe('cancel sort list by name', function() {
    beforeEach(function() {
      tableView.render();
    });

    beforeEach(function() {
      tableView.$el.find('a.title[data-id="name"]').click();
    });

    beforeEach(function() {
      tableView.$el.find('a.title[data-id="name"]').click();
    });

    beforeEach(function() {
      tableView.$el.find('a.title[data-id="name"]').click();
    });

    it('should 1st element to contains "Test 1" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[0].firstElementChild.innerText.should.to.contains('Test 1');
    });

    it('should 2nd element to contains "Test 10" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[1].firstElementChild.innerText.should.to.contains('Test 10');
    });

    it('should 3rd element to contains "Test 11" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[2].firstElementChild.innerText.should.to.contains('Test 11');
    });
    it('should 4th element to contains "Test 12" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[3].firstElementChild.innerText.should.to.contains('Test 12');
    });
    it('should 5th element to contains "Test 13" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[4].firstElementChild.innerText.should.to.contains('Test 13');
    });
    it('should 6th element to contains "Test 2" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[5].firstElementChild.innerText.should.to.contains('Test 2');
    });
    it('should 7th element to contains "Test 3" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[6].firstElementChild.innerText.should.to.contains('Test 3');
    });
    it('should 8th element to contains "Test 4" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[7].firstElementChild.innerText.should.to.contains('Test 4');
    });
    it('should 9th element to contains "Test 5" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[8].firstElementChild.innerText.should.to.contains('Test 5');
    });
    it('should 10th element to contains "Test 6" string', function() {
      tableView.$el.find('tbody:not(.hidden) > tr')[9].firstElementChild.innerText.should.to.contains('Test 6');
    });
  });
});
