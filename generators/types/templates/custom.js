<% if (auth) { %>// Types for Auth module
// --Start auth
const LOGIN_REQUEST = "LOGIN_REQUEST";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";
const LOGOUT = "LOGOUT";
// --End auth
<% } %><% if (axios) { %>
// Types for axios module
// --Start axios
const GET_OBJECT = "GET_OBJECT";
// --End axios
<% } %>
export default {
  <% if (auth) { %>LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT<% } %><% if (axios && auth) { %>,<% } %><% if (axios) { %>
  GET_OBJECT<% } %>
};
