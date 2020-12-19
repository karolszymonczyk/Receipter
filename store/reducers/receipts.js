import { RECEIPTS } from '../../data/dummy-data';
import { LOAD_RECEIPTS, ADD_RECEIPT, DELETE_RECEIPT, EDIT_RECEIPT, REMOVE_TAG } from '../actions/receipts';
import Receipt from '../../models/receipt';

import { reject } from 'lodash';

const initialState = {
  userReceipts: [],
  // userReceipts: RECEIPTS,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_RECEIPTS:
      return {
        userReceipts: action.data,
      };
    case ADD_RECEIPT:
      const newReceipt = new Receipt(
        action.data.id,
        action.data.title,
        action.data.photo,
        action.data.company,
        action.data.date,
        action.data.total,
        action.data.guaranteeDate,
        action.data.category,
        action.data.tags
      );
      return {
        ...state, // jak nie będzie nic więcej w state to nie jest potrzebne, a jak będzie filter to uwaga żeby też nowy się pojawił
        userReceipts: state.userReceipts.concat(newReceipt),
      };
    case EDIT_RECEIPT:
      const currentReceipt = state.userReceipts.find((receipt) => receipt.id === action.data.id);
      const editedReceipt = new Receipt(
        action.data.id,
        action.data.title,
        action.data.photo,
        action.data.company,
        action.data.date,
        action.data.total,
        action.data.guaranteeDate,
        action.data.category,
        action.data.tags
      );
      const newUserReceipt = [...state.userReceipts];
      newUserReceipt[state.userReceipts.indexOf(currentReceipt)] = editedReceipt;
      return {
        ...state,
        userReceipts: newUserReceipt,
      };
    case DELETE_RECEIPT:
      return {
        ...state,
        userReceipts: reject(state.userReceipts, { id: action.data.id }),
      };
    case REMOVE_TAG:
      return {
        ...state,
        userReceipts: state.userReceipts.map((receipt) => {
          const modifiedTags = reject(receipt.tags, { id: action.data.tagId });
          if (modifiedTags.length !== receipt.tags.length) {
            return { ...receipt, tags: modifiedTags };
          }
          return receipt;
        }),
      };
    default:
      return state;
  }
};
