import TableView from '../tableView';
import DetailView from '../detailView';

export default store => ({
  path: '*',
  getComponent(nextState, cb) {
    const splitSplat = nextState.params.splat.split('/');

    if (splitSplat.length % 2 === 0) {
      return cb(null, DetailView(store));
    }
    return cb(null, TableView(store));
  }
});
