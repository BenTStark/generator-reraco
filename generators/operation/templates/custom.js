import <%= capName %>ActionCreators from "./<%= name %>.action";

const defaultOperation = () => <%= capName %>ActionCreators.defaultAction();
<% if (axios) { %>
const getAxiosUrl = "https://www.example.com/api";
const getAxiosObj = data => <%= capName %>ActionCreators.getAxiosObj(data);
<% } %><% if (auth) { %>
const loginRequest = () => <%= capName %>ActionCreators.loginRequest();
const loginSuccess = authInformation =>
  <%= capName %>ActionCreators.loginSuccess(authInformation);
const loginError = () => <%= capName %>ActionCreators.loginError();
const logout = () => <%= capName %>ActionCreators.logout();
<% } %>
export const <%= capName %>Operations = {
  defaultOperation<% if (axios || auth) { %>,<% } %><% if (axios) { %>
  getAxiosUrl,
  getAxiosObj<% } %><% if (auth && axios) { %>,<% } %><% if (auth){ %>
  loginRequest,
  loginSuccess,
  loginError,
  logout<% } %>
};
