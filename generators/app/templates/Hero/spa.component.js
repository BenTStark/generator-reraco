import React, { Component } from "react";

import styles from "./hero.scss";
import appStyles from "../App/app.scss";

export default class MeComponent extends Component {
  render() {
    return (
      <div className={appStyles.appDark}>
        <div className={styles.heroContent}>
          <div className={appStyles.inApp}>
            <h1>Single Page Application</h1>
            <p>Welcome to your new Single Page Application.</p>
            <p>Start right now with your customization and hf.</p>
          </div>
        </div>
      </div>
    );
  }
}
