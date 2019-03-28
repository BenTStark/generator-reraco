import React from "react";
import { Switch, Route } from "react-router-dom";
import MainComponent from "./Main/main.component";
import ImprintComponent from "./Imprint/imprint.component";
import NotFoundComponent from "./NotFound/notFound.component";

import styles from "./App/app.scss";

export default () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={MainComponent} />
        <Route path="/imprint" component={ImprintComponent} />
        {/* Catch all route */}
        <Route component={NotFoundComponent} status={404} />
      </Switch>
    </div>
  );
};
