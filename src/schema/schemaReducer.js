import {FETCH_SUCCESS} from './SchemaActionTypes';

export default function schemaReducer(state = [], action): Object {
  switch (action.type) {
    case FETCH_SUCCESS:
      return [
        ...action.data
      ];
    default:
      return state;
  }
}
