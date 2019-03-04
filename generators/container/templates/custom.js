import { connect } from 'react-redux';
import <%= capName %>Component from './<%= name %>.component';
import { <%= capName %>Operations } from './duck/<%= name %>.operations';
<% if (axios) { %>
import axios from "axios";
<% } %>

<% if (state) { %>
const mapStateToProps = state => {
  return { <%= name %>: state.<%= name %>Reducer }
};
<% } %>
<% if (dispatch) { %>
const mapDispatchToProps = dispatch => {
  const defaultOperation = () => dispatch(<%= capName %>Operations.defaultOperation());
  <% if (axios) { %>
  // Dispatch for Axios module
  // --Start axios
  const getAxiosObj = () =>
      axios.get(<%= capName %>Operations.getAxiosUrl).then(response => {
        dispatch(<%= capName %>Operations.getAxiosObj(response.data));
      });
  // --End axios
  <% } %>

  return {
    defaultOperation<% if (axios) { %>,
    getAxiosObj<% } %>
  }
};
<% } %>

const <%= capName %>Container = connect(
  <% if (state) { %>mapStateToProps<% } else { %>null<% } %><% if (dispatch) { %>,
  mapDispatchToProps<% } %>
)(<%= capName %>Component);

export default <%= capName %>Container;
