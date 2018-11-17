import types from "./types";

const initalState = {
  value: null<% if (auth) { %>,
  profile: null,
  accessToken: null,
  loginRequest: false,
  loginSuccess: false,
  loginError: false
  <% } %>
};
<% if (auth) { %>
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
<% } %>
function defaultAction(state, value) {
  return {
    ...state,
    value: value
  };
}

const <% if (auth) { %>authReducer<% } else { %><%= featurePart %>reducer<% } %> = (state = initalState, action) => {
  switch (action.type) {
    <% if (auth) { %>
    case types.LOGIN_REQUEST:
      return loginRequest(state);
    case types.LOGIN_SUCCESS:
      return loginSuccess(state,action.payload);
    case types.LOGIN_ERROR:
      return loginError(state);
    case types.LOGOUT:
        return logout(state);
    <% } %>
    case types.DEFAULT_ACTION:
        return defaultAction(state,action.value);
    default:
      return state;
  }
};

export default <% if (auth) { %>authReducer<% } else { %><%= featurePart %>reducer<% } %>;
