import ImprintComponent from "./imprint.component";
// To Do: bei App Template wird das nicht genutzt (weils aber auch nur ein Component ist)
import ImprintContainer from "./imprint.container";
import { ImprintOperations } from "./duck/operations";

import React from "react";
import { shallow, mount } from "enzyme";
import configureStore from "redux-mock-store";
import toJson from "enzyme-to-json";
import MockAdapter from "axios-mock-adapter";

// Snapshot for Imprint React Component
describe(">>> ImprintComponent - Snapshot", () => {
  it("+++capturing Snapshot of ImprintComponent", () => {
    // To Do: bei App Template wird das nicht genutzt wird hier shallow genutzt!
    const renderedValue = mount(<ImprintComponent />);
    expect(toJson(renderedValue)).toMatchSnapshot();
  });
});

// Component Test
describe(">>> ImprintComponent --- Shallow Render React Components", () => {
  const wrapper = shallow(<ImprintComponent auth={{}} home={{}} />);

  it("+++ render the COMPONENT", () => {
    expect(wrapper.length).toEqual(1);
  });
});
