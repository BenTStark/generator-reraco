import <%= capName %>Types from "./<%= name %>.types";

// Actions should not do any change to the value they pass to the store.
// Any value treatment should happen before in operations.js!
<% if (axios) { %>
const getAxiosObj = data => {
  return {
    type: <%= capName %>Types.GET_OBJECT,
    payload: data
  };
};
<% } %><% if (auth) { %>
const loginRequest = () => {
  return { type: <%= capName %>Types.LOGIN_REQUEST };
};

const loginSuccess = authInformation => {
  return {
    type: <%= capName %>Types.LOGIN_SUCCESS,
    payload: authInformation
  };
};

const loginError = () => {
  return {
    type: <%= capName %>Types.LOGIN_ERROR
  };
};

const logout = () => {
  return {
    type: <%= capName %>Types.LOGOUT
  };
};
<% } %>
export default {
  <% if (auth) { %>loginRequest,
  loginSuccess,
  loginError,
  logout<% } %><% if (auth && axios) { %>,<% } %>
  <% if (axios) { %>getAxiosObj<% } %>
};
