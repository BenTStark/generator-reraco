import { connect } from 'react-redux';
import <%= capFeaturePart %>Component from './<%= featurePart %>.component';
import { <%= capFeaturePart %>Operations } from './duck/operations';
<% if (axios) { %>
import axios from "axios";
<% } %>

const mapStateToProps = state => {
  return { <%= feature %>: state.<%= feature %>Reducer<% if (auth) { %>, auth: state.authReducer<% } %> }
};

const mapDispatchToProps = dispatch => {
  const defaultOperation = () => dispatch(<%= capFeaturePart %>Operations.defaultOperation());
  <% if (axios) { %>
  // Dispatch for Axios module
  // --Start axios
  const getAxiosObj = () =>
      axios.get(<%= capFeaturePart %>Operations.getAxiosUrl).then(response => {
        dispatch(<%= capFeaturePart %>Operations.getAxiosObj(response.data));
      });
  // --End axios
  <% } %>

  return {
    defaultOperation<% if (axios) { %>,
    getAxiosObj<% } %>
  }
};

const <%= capFeaturePart %>Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(<%= capFeaturePart %>Component);

export default <%= capFeaturePart %>Container;
