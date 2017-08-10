import store from 'store';

const USER_INFO = 'UCS_USER_INFO';

const setUserInfo = (data) => store.set(USER_INFO, data || {});

const getUserInfo = () => store.get(USER_INFO) || {};

const clearUserInfo = () => store.remove(USER_INFO);

const clearAll = () => store.clearAll();

export default {
  setUserInfo,
  getUserInfo,
  clearUserInfo,
  clearAll,
};
