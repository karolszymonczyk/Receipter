export const ADD_TAG = 'ADD_TAG';
export const DELETE_TAG = 'DELETE_TAG';

export const addTag = ({ id, key }) => ({
  type: ADD_TAG,
  data: { id, key },
});

export const deleteTag = ({ id }) => ({
  type: DELETE_TAG,
  data: { id },
});
