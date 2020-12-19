import { AsyncStorage } from 'react-native';

export const LOGOUT = 'LOGOUT';
export const AUTH = 'AUTH';

const API_KEY = 'AIzaSyABO1Gia1uQ3jkPJTMacCzTDhbyKo8Juco';

// let timer;

const saveTokenInStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userInfo',
    JSON.stringify({
      token,
      userId,
      expirationDate,
    })
  );
};

// const setLogoutTimer = (time) => (dispatch) => {
//   tiemr = setTimeout(() => {
//     dispatch(logout());
//   }, time);
// };

export const logout = () => ({ type: LOGOUT });

export const auth = (token, userId) => ({ type: AUTH, token, userId });

export const signUp = (email, password) => async (dispatch) => {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const resData = await res.json();

  if (!res.ok) {
    const errMessage = resData.error.message;
    if (errMessage === 'EMAIL_EXISTS') {
      throw new Error('This email address is already in use');
    } else if (errMessage === 'INVALID_EMAIL') {
      throw new Error('Email is not valid');
    }
    throw new Error('Please try again later.');
  }

  dispatch(auth(resData.idToken, resData.localId));
  const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
  saveTokenInStorage(resData.idToken, resData.localId, expirationDate.toISOString());
};

export const logIn = (email, password) => async (dispatch) => {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });
  const resData = await res.json();

  if (!res.ok) {
    const errMessage = resData.error.message;
    if (errMessage === 'EMAIL_NOT_FOUND' || errMessage === 'INVALID_PASSWORD') {
      throw new Error('Email or password is not correct');
    }
    throw new Error('Please try again later.');
  }

  dispatch(auth(resData.idToken, resData.localId));
  const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
  saveTokenInStorage(resData.idToken, resData.localId, expirationDate.toISOString());
};
