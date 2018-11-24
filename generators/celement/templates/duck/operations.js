// optional for API requests
import ActionCreators from "./actions";
<% if (auth) { %>
// Import for Auth module
// --Start auth import
import types from "./types";
import AuthService from "./auth.service";

const loginRequest = () => ActionCreators.loginRequest();
const loginSuccess = authInformation => ActionCreators.loginSuccess(authInformation);
const loginError = () => ActionCreators.loginError();
const logout = () => ActionCreators.logout();
// --End auth import
<% } %>

// This is an example how a simple operation could look like:
const defaultOperation = value => ActionCreators.defaultAction(value);

<% if (auth) { %>
// Operations for Auth module
// --Start auth operations
const checkLogin = () => {
  return new Promise((resolve, reject) => {
    const payload = {},
      authInformation = {};
    authInformation.result = "";
    if (AuthService.loggedIn()) {
      payload.profile = AuthService.getProfile();
      payload.accessToken = AuthService.getAccessToken();
      authInformation.result = types.LOGIN_SUCCESS;
    }
    authInformation.payload = payload;
    resolve(authInformation);
  });
};

const authentication = () => {
  // Add callback for lock's `authenticated` event
  return new Promise((resolve, reject) => {
    const payload = {},
      authInformation = {};
    authInformation.result = "";
    authInformation.payload = payload;
    AuthService.lock.on("authenticated", authResult => {
      AuthService.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          authInformation.result = types.LOGIN_ERROR;
          reject(authInformation);
        } else {
          AuthService.setToken(authResult.idToken, authResult.accessToken); // static method
          AuthService.setProfile(profile); // static method
          payload.profile = profile;
          payload.accessToken = authResult.accessToken;
          authInformation.result = types.LOGIN_SUCCESS;
          authInformation.payload = payload;
          AuthService.lock.hide();
          resolve(authInformation);
        }
      });
    });
    // Add callback for lock's `authorization_error` event
    AuthService.lock.on("authorization_error", error => {
      authInformation.result = types.LOGIN_ERROR;
      reject(authInformation);
    });
  });
};

const handleLogin = () => {
  AuthService.login();
};

const handleLogout = () => {
  AuthService.logout();
};
// --End auth operations
<% } %>

<% if (axios) { %>
// Operations for axios module
// --Start axios operations

// URLs for API us are build here, but used in container!
const getAxiosUrl = "https//example.com/api";

const getAxiosObj = obj => ActionCreators.getAxiosObj(obj);
// --End axios operations
<% } %>

export const <%= capFeature %>Operations = {
  defaultOperation<% if (auth) { %>,
  handleLogin,
  loginRequest,
  loginSuccess,
  loginError,
  handleLogout,
  logout,
  checkLogin,
  authentication<% } %><% if (axios) { %>,
  getAxiosUrl,
  getAxiosObj
  <% } %>
};
