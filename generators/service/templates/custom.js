<% if (axios) { %>
import axios from "axios";
<% } %>

<% if (axios) { %>
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

export const <%= name %>Service = {
  <% if (axios) { %>
  handleAxios
  <% } %>
};
