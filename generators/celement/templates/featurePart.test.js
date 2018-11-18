import <%= capFeaturePart %>Component from "./<%= feature %>.component";
// To Do: bei App Template wird das nicht genutzt (weils aber auch nur ein Component ist)
import <%= capFeaturePart %>Container from "./<%= feature %>.container";
import { <%= capFeaturePart %>Operations } from "./duck/operations";
<% if (axios) { %>
import types from "./duck/types";
<% } %>

import React from "react";
import { shallow, mount } from "enzyme";
import configureStore from "redux-mock-store";
import toJson from "enzyme-to-json";
import MockAdapter from "axios-mock-adapter";
<% if (axios) { %>
import axios from "axios";
<% } %>

// Snapshot for <%= capFeaturePart %> React Component
describe(">>> <%= capFeaturePart %>Component - Snapshot", () => {
  it("+++capturing Snapshot of <%= capFeaturePart %>Component", () => {
    // To Do: bei App Template wird das nicht genutzt wird hier shallow genutzt!
    const renderedValue = mount(
      <<%= capFeaturePart %>Component <% if (auth) { %>auth={{}}<% } %><% if (container) { %><%= feature %>={{}}<% } %> />
    );
    expect(toJson(renderedValue)).toMatchSnapshot();
  });
});

// Component Test
describe(">>> <%= capFeaturePart %>Component --- Shallow Render React Components", () => {
  const wrapper = shallow(<<%= capFeaturePart %>Component auth={{}} home={{}} />);

  it("+++ render the COMPONENT", () => {
    expect(wrapper.length).toEqual(1);
  });
});

<% if (container) { %>
// Container Test
describe(">>> <%= capFeaturePart %>Container --- REACT-REDUX (Shallow + passing the {store} directly)", () => {
  const initialState = {
    <%= feature %>Reducer: {
      value: null<% if (axios) { %>,
      payload: null<% } %>
    }<% if (auth) { %>,
    authReducer: {
      value: null,
      profile: null,
      accessToken: null,
      loginRequest: false,
      loginSuccess: false,
      loginError: false
    }<% } %>
  };
  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(initialState);
    container = shallow(<<%= capFeaturePart %>Container store={store} />);
  });

  it("+++ check Prop matches with initialState", () => {
    expect(container.prop("<%= feature %>")).toEqual(initialState.<%= feature %>Reducer);
    <% if (auth) { %>
    expect(container.prop("auth")).toEqual(initialState.authReducer);
    <% } %>
  });

  <% if (axios) { %>
  describe(">>> Test Axios Request", () => {
    const mockData = { response: "content" };
    beforeEach(() => {
      const mock = new MockAdapter(axios);
      mock.onGet(<%= capFeaturePart %>Operations.getAxiosUrl).reply(200, mockData);
      container
        .dive()
        .find("#axios")
        .simulate("click");
    });

    it("+++ Click Request Button", () => {
      expect(store.getActions()).toEqual([
        {
          type: types.GET_OBJECT,
          payload: mockData
        }
      ]);
    });
  });
  <% } %>
});
<% } %>
