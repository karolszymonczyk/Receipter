import { TAGS } from '../../data/dummy-data';
import { ADD_TAG, DELETE_TAG } from '../actions/tags';
import Tag from '../../models/tag';

import { reject } from 'lodash';

const initialState = {
  userTags: TAGS,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TAG:
      const newTag = new Tag(action.data.id, action.data.key);
      return {
        ...state, // jak nie będzie nic więcej w state to nie jest potrzebne, a jak będzie filter to uwaga żeby też nowy się pojawił
        userTags: state.userTags.concat(newTag),
      };
    case DELETE_TAG:
      console.log(state.userReceipts);
      return {
        ...state,
        userTags: reject(state.userTags, { id: action.data.id }),
      };
    default:
      return state;
  }
};
