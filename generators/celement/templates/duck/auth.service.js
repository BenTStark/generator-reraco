// File for necessary auth helper functions
import Auth0Lock from "auth0-lock";
import jwtDecode from "jwt-decode";
import {
  AUTH_CONFIG as authConfig,
  AUTH_CONSTANTS as authConstants
} from "./auth.constants";

// Configure Auth0 lock
const lock = new Auth0Lock(authConfig.clientId, authConfig.domain, {
  auth: {
    redirectUrl: authConfig.callbackUrl,
    audience: authConfig.audience,
    responseType: "token id_token"
  },
  theme: authConstants.theme,
  languageDictionary: authConstants.languageDictionary
});

const login = () => {
  // Call the show method to display the widget.
  lock.show();
};

const logout = () => {
  // Clear user token and profile data from window.localStorage
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("id_token");
  window.localStorage.removeItem("profile");
};

const loggedIn = () => {
  // Checks if there is a saved token and it's still valid
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

/*------------------------------------------------------
PROFILE - Set and Get
------------------------------------------------------ */
const setProfile = profile => {
  // Saves profile data to window.localStorage
  window.localStorage.setItem("profile", JSON.stringify(profile));
  // Triggers profile_updated event to update the UI
};

const getProfile = () => {
  // Retrieves the profile data from window.localStorage
  const profile = window.localStorage.getItem("profile");
  return profile ? JSON.parse(window.localStorage.profile) : {};
};

/*------------------------------------------------------
TOKEN - Set and Get
------------------------------------------------------ */
const setToken = (idToken, accessToken) => {
  // Saves user token to window.localStorage
  window.localStorage.setItem("access_token", accessToken);
  window.localStorage.setItem("id_token", idToken);
};

const getToken = () => {
  // Retrieves the user token from window.localStorage
  return window.localStorage.getItem("id_token");
};

const getAccessToken = () => {
  // Retrieves the user token from window.localStorage
  return window.localStorage.getItem("access_token");
};

/*------------------------------------------------------
TOKEN EXPIRATION
------------------------------------------------------ */
const getTokenExpirationDate = () => {
  const token = getToken();
  const decoded = jwtDecode(token);
  if (!decoded.exp) {
    return null;
  }

  const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
  date.setUTCSeconds(decoded.exp);
  return date;
};

const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  const date = getTokenExpirationDate();
  const offsetSeconds = 0;
  if (date === null) {
    return false;
  }
  return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
};

const AuthService = {
  lock,
  login,
  logout,
  loggedIn,
  setProfile,
  getProfile,
  setToken,
  getToken,
  getAccessToken
};

export default AuthService;
