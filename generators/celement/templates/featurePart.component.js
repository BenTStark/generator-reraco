import React, { Component } from "react";
import { object } from "prop-types";
<% if (sass) { %>
import styles from "./<%= featurePart %>.scss";
<% } %>

export default class <%= capFeaturePart %>Component extends Component {
  // Using propTypes is recommended for good code style, readability and code stability
  static propTypes = {
    <% if (container) { %>
    <%= feature %>: object.isRequired<% } %><% if (auth) { %>,
    auth: object.isRequired<% } %>
  };

  render() {
    return (
      <div>
        <h1>Empty Component</h1>
        <% if (axios) { %>
        {/* Simple Test for the axios implementation */}
        <button id="axios" onClick={() => this.props.getAxiosObj()}>
          Test Axios
        </button>
        <pre>{JSON.stringify(this.props.<%= feature %>.payload, null, 2)}</pre>
        <% } %>
      </div>
    )
  }
}
