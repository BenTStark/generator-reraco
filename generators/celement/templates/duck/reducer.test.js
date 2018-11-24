import <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %> from "./reducer";
import types from "./types";

describe(">>>>>> <%= capFeature %> - Reducer Test", () => {
  let initialState = {
    value: null<% if (auth) { %>,
    profile: null,
    accessToken: null,
    loginRequest: false,
    loginSuccess: false,
    loginError: false<% } %><% if (axios) { %>,
    payload: null
    <% } %>
  };
  // This is an example how a simple Test of a Reducer function could look like:
  it("+++ reducer for DEFAULT_ACTION", () => {
    let state = {
      ...initialState,
      value: "value"
    };
    let expectedState = initialState;
    state = <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %>(state, { type: types.DEFAULT_ACTION, value: "value" });
    expect(state).toEqual(expectedState);
  });

  <% if (auth) { %>
  // Reducer Tests for Auth module
  // --Start auth
  it("+++ reducer for LOGIN_REQUEST", () => {
    let state = initialState;
    let expectedState = {
      ...initialState,
      loginRequest: true
    };
    state = <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %>(state, { type: types.LOGIN_REQUEST });
    expect(state).toEqual(expectedState);
  });
  it("+++ reducer for LOGIN_SUCCESS", () => {
    let state = { ...initialState, loginRequest: true };
    let expectedState = {
      ...initialState,
      profile: "tester",
      accessToken: "token",
      loginSuccess: true
    };
    state = <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %>(state, {
      type: types.LOGIN_SUCCESS,
      payload: { profile: "tester", accessToken: "token" }
    });
    expect(state).toEqual(expectedState);
  });
  it("+++ reducer for LOGIN_ERROR", () => {
    let state = { ...initialState, loginRequest: true };
    let expectedState = {
      ...initialState,
      loginError: true
    };
    state = <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %>(state, { type: types.LOGIN_ERROR });
    expect(state).toEqual(expectedState);
  });
  it("+++ reducer for LOGOUT", () => {
    let state = {
      ...initialState,
      profile: "tester",
      accessToken: "token",
      loginSuccess: true
    };
    let expectedState = initialState;
    state = <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %>(state, { type: types.LOGOUT });
    expect(state).toEqual(expectedState);
  });
  // --End auth
  <% } %>

  <% if (axios) { %>
  // Reducer Tests for axios module
  // --Start axios
  it("+++ reducer for GET_OBJECT", () => {
    let state = initialState;
    let expectedState = {
      ...initialState,
      payload: "axios content"
    };
    state = <% if (auth) { %>authReducer<% } else { %><%= feature %>Reducer<% } %>(state, { type: types.GET_OBJECT, payload: "axios content" });
    expect(state).toEqual(expectedState);
  });
  // --End axios
  <% } %>
});
