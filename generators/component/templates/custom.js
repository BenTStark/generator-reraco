import React<% if (type === 'presentational') { %>, { Component }<% } %> from "react";
<% if (proptypes) { %>
import { object } from "prop-types";
<% } %>
<% if (axios) { %>
import axios from "axios";
<% } %>
<% if (hasService) { %>
import <%= capName %>Service from './<%= name %>.service';
<% } %>

<% if (type === 'presentational') { %>
export default class <%= capName %>Component extends Component {
  <% if (proptypes) { %>
  // Using propTypes is recommended for good code style, readability and code stability
  static propTypes = {};
  <% } %>
  componentDidMount() {};

  <% if (axios && !hasContainer && !hasService) { %>
  const handleAxios() {
    axios
      .get('apiUrl')
      .then(response => {
        return response
      })
      .catch(error => {
        return error
      })
  }
  <% } %>

  render() {
    return (
      <div>
        <h1><%= name %></h1>
        <span>content</span>
      </div>
    )
  }
}
<% } %>

<% if (type === 'functional') { %>
function <%= capName %>Component({ prop = 'default' }) {
  const value = prop;
  return (
    <div>
      <h1><%= name %></h1>
      <span>content with {value}</span>
    </div>
  );
}
<% if (proptypes) { %>
<%= capName %>Component.propTypes = {
  value: object.isRequired,
};
<% } %>

export default <%= capName %>Component;
<% } %>
