import { TAGS } from '../../data/dummy-data';
import { LOAD_TAGS, ADD_TAG, DELETE_TAG } from '../actions/tags';
import Tag from '../../models/tag';

import { reject } from 'lodash';

const initialState = {
  userTags: [],
  // userTags: TAGS,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TAGS:
      return {
        userTags: action.data,
      };
    case ADD_TAG:
      const newTag = new Tag(action.data.id, action.data.key);
      return {
        ...state,
        userTags: state.userTags.concat(newTag),
      };
    case DELETE_TAG:
      return {
        ...state,
        userTags: reject(state.userTags, { id: action.data.id }),
      };
    default:
      return state;
  }
};
