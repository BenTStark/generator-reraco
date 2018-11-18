import types from "./types";

const initalState = {
  value: null<% if (auth) { %>,
  profile: null,
  accessToken: null,
  loginRequest: false,
  loginSuccess: false,
  loginError: false<% } %><% if (axios) { %>,
  payload: null<% } %>
};

// This is an example how a simple Reducer function could look like:
function defaultReducerFunction(state, value) {
  return {
    ...state,
    value: value
  };
}

<% if (auth) { %>
// Reducer for Auth module
// --Start auth
function loginRequest(state) {
  return { ...state, loginRequest: true };
}

function loginSuccess(state, authInformation) {
  return {
    ...state,
    profile: authInformation.profile,
    accessToken: authInformation.accessToken,
    loginRequest: false,
    loginSuccess: true
  };
}

function loginError(state) {
  return { ...state, loginRequest: false, loginError: true };
}

function logout(state) {
  return {
    ...state,
    profile: null,
    accessToken: null,
    loginRequest: false,
    loginSuccess: false
  };
}
// --End auth
<% } %>

<% if (axios) { %>
// Reducer for axios module
// --Start axios
function getAxiosObj(state, obj) {
  return {
    ...state,
    payload: obj
  };
}
// --Start axios
<% } %>

const <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %> = (state = initalState, action) => {
  switch (action.type) {
    case types.DEFAULT_ACTION:
        return defaultReducerFunction(state,action.value);
    <% if (auth) { %>
    case types.LOGIN_REQUEST:
      return loginRequest(state);
    case types.LOGIN_SUCCESS:
      return loginSuccess(state,action.payload);
    case types.LOGIN_ERROR:
      return loginError(state);
    case types.LOGOUT:
        return logout(state);
    <% } %><% if (axios) { %>
    case types.GET_OBJECT:
        return getAxiosObj(state,action.payload);
    <% } %>
    default:
      return state;
  }
};

export default <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %>;
