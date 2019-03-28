import React, { Component } from "react";
import { Link } from "react-router-dom";
import getRoutes from "../routes";
import styles from "./app.scss";

export default class AppComponent extends Component {
  render() {
    return (
      <div>
        {getRoutes()}
        <div>
          <p className={styles.alignLeft}>(c) Benjamin Ruf IT Solutions</p>
          <Link to="/" className={styles.alignRight}>
            Home
          </Link>
          <p> -- </p>
          <Link to="/imprint" className={styles.alignRight}>
            Impressum
          </Link>
        </div>
      </div>
    );
  }
}
