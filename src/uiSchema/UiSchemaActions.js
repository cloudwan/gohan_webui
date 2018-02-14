/* global navigator */
import axios from 'axios';
import {FETCH_SUCCESS} from './UiSchemaActionTypes';

const fetchSuccess = data => dispatch => {
  dispatch({data, type: FETCH_SUCCESS});
};

/**
 * Fetch ui schema and dispatch success of failure.
 */
export const fetchUiSchema = () => async dispatch => {
  const language = navigator.language.toLocaleLowerCase();

  try {
    let result = await axios.get(`./locales/${language}/uiSchema.json`);

    dispatch(fetchSuccess(result.data));
  } catch (error) {
    try {
      let result = await axios.get('./locales/en-us/uiSchema.json');

      dispatch(fetchSuccess(result.data));
    } catch (error) {
      console.log(error);
    }
  }
};
