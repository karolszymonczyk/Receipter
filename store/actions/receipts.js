export const ADD_RECEIPT = 'ADD_RECEIPT';
export const DELETE_RECEIPT = 'DELETE_RECEIPT';
export const EDIT_RECEIPT = 'EDIT_RECEIPT';
export const REMOVE_TAG = 'REMOVE_TAG';

export const addReceipt = ({ id, userId, title, photo, company, date, total, guaranteeDate, category, tags }) => ({
  type: ADD_RECEIPT,
  data: { id, userId, title, photo, company, date, total, guaranteeDate, category, tags },
});

export const deleteReceipt = ({ id }) => ({
  type: DELETE_RECEIPT,
  data: { id },
});

export const editReceipt = ({ id, userId, title, photo, company, date, total, guaranteeDate, category, tags }) => ({
  type: EDIT_RECEIPT,
  data: { id, userId, title, photo, company, date, total, guaranteeDate, category, tags },
});

export const removeTag = ({ tagId }) => ({
  type: REMOVE_TAG,
  data: { tagId },
});
