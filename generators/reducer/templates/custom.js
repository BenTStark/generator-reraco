import <%= capName %>Types from "./<%= name %>.types";

const initalState = {
  <% if (auth) { %>profile: null,
  accessToken: null,
  loginRequest: false,
  loginSuccess: false,
  loginError: false<% } %><% if (auth && axios) { %>,<% } %>
  <% if (axios) { %>axiosObj: null<% } %>
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
<% } %><% if (axios) { %>
function getAxiosObj(state, data) {
  return { ...state, axiosObj: data };
}
<% } %>
const <%= name %>Reducer = (state = initalState, action) => {
  switch (action.type) {
    <% if (auth) { %>case <%= capName %>Types.LOGIN_REQUEST:
      return loginRequest(state);
    case <%= capName %>Types.LOGIN_SUCCESS:
      return loginSuccess(state, action.payload);
    case <%= capName %>Types.LOGIN_ERROR:
      return loginError(state);
    case <%= capName %>Types.LOGOUT:
      return logout(state);<% } %>
    <% if (axios) { %>case <%= capName %>Types.GET_OBJECT:
      return getAxiosObj(state, action.payload);<% } %>
    default:
      return state;
  }
};

export default <%= name %>Reducer;
