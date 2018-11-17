const DEFAULT_ACTION = "DEFAULT_ACTION";
<% if (auth) { %>
const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";
const LOGOUT = "LOGOUT";
<% } %>

export default {
  DEFAULT_ACTION<% if (auth) { %>,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT
  <% } %>
};
