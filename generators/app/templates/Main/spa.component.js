import React, { Component } from "react";
import ScrollableAnchor from "react-scrollable-anchor";
import { configureAnchors } from "react-scrollable-anchor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";

import Hero from "../Hero/hero.component";
<% for (i=0 ; i<=SPAContent.counter; i++) { %>
import <%= SPAContent[i].capFeature %>Component from "../<%= SPAContent[i].capFeature %>/<%= SPAContent[i].feature %>.component";<% } %>

import appStyles from "../App/app.scss";
import styles from "./main.scss";

configureAnchors({ offset: 36, scrollDuration: 400 });

export default class MainComponent extends Component {
  render() {
    return (
      <div>
      <Hero />
        <% for (i=0 ; i<=SPAContent.counter; i++) { %><ScrollableAnchor id={"<%= SPAContent[i].feature %>"}>
          <<%= SPAContent[i].capFeature %>Component />
        </ScrollableAnchor><% } %>
      </div>
    );
  }
}

export function DownButton({ section }) {
  return (
    <a href={section}>
      <div className={appStyles.moveDownButton}>
        <FontAwesomeIcon
          icon={faAngleDown}
          className={appStyles.moveDownButtonAngle}
          size="2x"
        />
      </div>
    </a>
  );
}
