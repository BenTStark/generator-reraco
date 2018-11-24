import ActionCreators from "./actions";
import types from "./types";

describe(">>> <%= capFeature %> - Action Test", () => {
  // This is an example how a simple action test should look like:
  it("+++ defaultAction", () => {
    const value = "value"
    expect(ActionCreators.defaultAction(value)).toEqual({ type: types.DEFAULT_ACTION, value: value });
  });

  <% if (auth) { %>
  // Action Test for Auth module
  // --Start auth
  it("+++ loginRequest", () => {
    expect(ActionCreators.loginRequest()).toEqual({ type: types.LOGIN_REQUEST });
  });

  it("+++ loginSuccess", () => {
    const authInformation = {
      profile: null,
      accessToken: null
    };
    expect(ActionCreators.loginSuccess(authInformation)).toEqual({
      type: types.LOGIN_SUCCESS,
      payload: authInformation
    });
  });

  it("+++ loginError", () => {
    expect(ActionCreators.loginError()).toEqual({ type: types.LOGIN_ERROR });
  });

  it("+++ logout", () => {
    expect(ActionCreators.logout()).toEqual({ type: types.LOGOUT });
  });
  // --End auth
  <% } %>

  <% if (axios) { %>
  // Action Test for axios module
  // --Start axios
  it("+++ getAxiosObj", () => {
    const axiosContent = "axios content"
    expect(ActionCreators.getAxiosObj(axiosContent)).toEqual({ type: types.GET_OBJECT, payload: axiosContent });
  });
  // --End axios
  <% } %>
});
