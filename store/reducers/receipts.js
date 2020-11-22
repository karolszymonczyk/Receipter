import { RECEIPTS } from '../../data/dmmy-data';
import { ADD_RECEIPT, DELETE_RECEIPT, EDIT_RECEIPT, editReceipt } from '../actions/receipts';
import Receipt from '../../models/receipt';

import { reject } from 'lodash';

const initialState = {
  userReceipts: RECEIPTS,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_RECEIPT:
      const newReceipt = new Receipt(
        action.data.id,
        action.data.userId,
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
    case DELETE_RECEIPT:
      return {
        ...state,
        userReceipts: reject(state.userReceipts, { id: action.data.id }),
      };
    case EDIT_RECEIPT:
      const currentReceipt = state.userReceipts.find((receipt) => receipt.id === action.data.id);
      const editedReceipt = new Receipt(
        action.data.id,
        action.data.userId,
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
    default:
      return state;
  }
};
