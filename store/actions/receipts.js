import { reject } from 'lodash';

import Receipt from '../../models/receipt';
import { DB_HOST } from '../../constants/Hosts';

export const LOAD_RECEIPTS = 'LOAD_RECEIPTS';
export const ADD_RECEIPT = 'ADD_RECEIPT';
export const EDIT_RECEIPT = 'EDIT_RECEIPT';
export const DELETE_RECEIPT = 'DELETE_RECEIPT';
export const REMOVE_TAG = 'REMOVE_TAG';

export const loadReceipts = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const res = await fetch(`${DB_HOST}/receipts/${userId}.json?auth=${token}`);
    const resData = await res.json();

    if (!res.ok) {
      const errMessage = await resData.error;
      if (errMessage === 'Could not parse auth token.') {
        throw new Error('UNAUTH'); // może da się ten initial state z tego storage dać
      }
      throw new Error();
    }

    const loadedReceipts = resData
      ? Object.entries(resData).map(
          ([id, receiptData]) =>
            new Receipt(
              id,
              receiptData.title,
              receiptData.photo,
              receiptData.company,
              new Date(receiptData.date),
              receiptData.total,
              receiptData.guaranteeDate && new Date(receiptData.guaranteeDate),
              receiptData.category,
              receiptData.tags ? receiptData.tags.map((tag) => ({ id: tag.id, key: tag.key, value: tag.value })) : []
            )
        )
      : [];

    dispatch({ type: LOAD_RECEIPTS, data: loadedReceipts });
  } catch (err) {
    throw err;
  }
};

export const addReceipt = ({ title, photo, company, date, total, guaranteeDate, category, tags }) => async (
  dispatch,
  getState
) => {
  try {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const res = await fetch(`${DB_HOST}/receipts/${userId}.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, photo, company, date, total, guaranteeDate, category, tags }),
    });
    if (!res.ok) {
      throw new Error();
    }
    const resData = await res.json();
    dispatch({
      type: ADD_RECEIPT,
      data: { id: resData.name, title, photo, company, date, total, guaranteeDate, category, tags },
    });
  } catch (err) {
    throw err;
  }
};

export const editReceipt = ({ id, title, photo, company, date, total, guaranteeDate, category, tags }) => async (
  dispatch,
  getState
) => {
  try {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const res = await fetch(`${DB_HOST}/receipts/${userId}/${id}.json?auth=${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, company, date, total, guaranteeDate, category, tags }),
    });
    if (!res.ok) {
      throw new Error();
    }
    dispatch({
      type: EDIT_RECEIPT,
      data: { id, title, photo, company, date, total, guaranteeDate, category, tags },
    });
  } catch (err) {
    throw err;
  }
};

export const deleteReceipt = ({ id }) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const res = await fetch(`${DB_HOST}/receipts/${userId}/${id}.json?auth=${token}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error();
    }
    dispatch({
      type: DELETE_RECEIPT,
      data: { id },
    });
  } catch (err) {
    throw err;
  }
};

export const removeTag = ({ tagId }) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const res = await fetch(`${DB_HOST}/receipts/${userId}.json?auth=${token}`);
    if (!res.ok) {
      throw new Error();
    }
    const resData = await res.json();
    const loadedReceipts = Object.entries(resData).map(([id, receiptData]) => ({ id, tags: receiptData.tags }));
    const filteredReceipts = loadedReceipts.filter((receipt) => receipt.tags?.some((tag) => tag.id === tagId));

    for (const receipt of filteredReceipts) {
      const newTags = reject(receipt.tags, { id: tagId });
      const patchRes = await fetch(`${DB_HOST}/receipts/${userId}/${receipt.id}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: newTags }),
      });
      if (!patchRes.ok) {
        throw new Error();
      }
    }

    dispatch({
      type: REMOVE_TAG,
      data: { tagId },
    });
  } catch (err) {
    throw err;
  }
};
