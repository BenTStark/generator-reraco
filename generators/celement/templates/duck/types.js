const DEFAULT_ACTION = "DEFAULT_ACTION";
<% if (auth) { %>
// Types for Auth module
// --Start auth
const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";
const LOGOUT = "LOGOUT";
// --End auth
<% } %>
<% if (axios) { %>
// Types for axios module
// --Start axios
const GET_OBJECT = "GET_OBJECT";
// --End axios
<% } %>

export default {
  DEFAULT_ACTION<% if (auth) { %>,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT<% } %><% if (axios) { %>,
  GET_OBJECT<% } %>
};
