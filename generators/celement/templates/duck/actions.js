import types from "./types";

<% if (auth) { %>
const loginRequest = () => {
  return { type: types.LOGIN_REQUEST };
};

const loginSuccess = authInformation => {
  return {
    type: types.LOGIN_SUCCESS,
    payload: authInformation
  };
};

const loginError = () => {
  return {
    type: types.LOGIN_ERROR
  };
};

const logout = () => {
  return {
    type: types.LOGOUT
  };
};
<% } %>

// Actions should not do any change to the value they pass to the store.
// Any value treatment should happen before in operations.js!
const defaultAction = (value) => {
    type: types.DEFAULT_ACTION,
    value: value
};

export default {
  default<% if (auth) { %>,
  loginRequest,
  loginSuccess,
  loginError,
  logout<% } %>

};
