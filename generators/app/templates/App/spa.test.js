import AppComponent from "./app.component";
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

describe(">>> AppComponent - Snapshot", () => {
  it("+++capturing Snapshot of AppComponent", () => {
    // Shallow because lot of strange errors with mount
    const renderedValue = shallow(<AppComponent />);
    expect(toJson(renderedValue)).toMatchSnapshot();
  });
});

// Component Test
describe(">>> AppComponent --- Shallow Render React Components", () => {
  const wrapper = shallow(<AppComponent auth={{}} />);

  it("+++ render the COMPONENT", () => {
    expect(wrapper.length).toEqual(1);
  });
});
