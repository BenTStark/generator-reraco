import MainComponent from "./main.component";
// To Do: bei App Template wird das nicht genutzt (weils aber auch nur ein Component ist)
import MainContainer from "./main.container";
import { MainOperations } from "./duck/operations";

import React from "react";
import { shallow, mount } from "enzyme";
import configureStore from "redux-mock-store";
import toJson from "enzyme-to-json";
import MockAdapter from "axios-mock-adapter";

// Snapshot for Main React Component
describe(">>> MainComponent - Snapshot", () => {
  it("+++capturing Snapshot of MainComponent", () => {
    // To Do: bei App Template wird das nicht genutzt wird hier shallow genutzt!
    const renderedValue = mount(<MainComponent />);
    expect(toJson(renderedValue)).toMatchSnapshot();
  });
});

// Component Test
describe(">>> MainComponent --- Shallow Render React Components", () => {
  const wrapper = shallow(<MainComponent auth={{}} home={{}} />);

  it("+++ render the COMPONENT", () => {
    expect(wrapper.length).toEqual(1);
  });
});
