import types from "./types";

// Actions should not do any change to the value they pass to the store.
// Any value treatment should happen before in operations.js!
// This is an example how an action should look like:
const defaultAction = (value) => {
    type: types.DEFAULT_ACTION,
    value: value
};

<% if (auth) { %>
// Actions for Auth module
// --Start auth
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
// --End auth
<% } %>

<% if (axios) { %>
// Actions for Axios module
// --Start axios
const getAxiosObj = obj => {
  return {
    type: types.GET_OBJECT,
    payload: obj
  };
};
// --End axios
<% } %>


export default {
  defaultAction<% if (auth) { %>,
  loginRequest,
  loginSuccess,
  loginError,
  logout<% } %><% if (axios) { %>,
  getAxiosObj  <% } %>
};
