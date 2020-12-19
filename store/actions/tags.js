import Tag from '../../models/tag';
import { DB_HOST } from '../../constants/Hosts';

export const LOAD_TAGS = 'LOAD_TAGS';
export const ADD_TAG = 'ADD_TAG';
export const DELETE_TAG = 'DELETE_TAG';

export const loadTags = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const res = await fetch(`${DB_HOST}/tags/${userId}.json?auth=${token}`);
    const resData = await res.json();

    if (!res.ok) {
      const errMessage = await resData.error;
      if (errMessage === 'Could not parse auth token.') {
        throw new Error('UNAUTH'); // może da się ten initial state z tego storage dać
      }
      throw new Error();
    }

    const loadedTags = resData ? Object.entries(resData).map(([id, tagData]) => new Tag(id, tagData.key)) : [];

    dispatch({ type: LOAD_TAGS, data: loadedTags });
  } catch (err) {
    throw err;
  }
};

export const addTag = ({ key }) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const res = await fetch(`${DB_HOST}/tags/${userId}.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });
    if (!res.ok) {
      throw new Error();
    }

    const resData = await res.json();
    dispatch({ type: ADD_TAG, data: { id: resData.name, key } });
  } catch (err) {
    throw err;
  }
};

export const deleteTag = ({ id }) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const res = await fetch(`${DB_HOST}/tags/${userId}/${id}.json?auth=${token}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error();
    }
    dispatch({ type: DELETE_TAG, data: { id } });
  } catch (err) {
    throw err;
  }
};
