import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import * as views from "./views";
import React from "react";

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/:tab" component={views.Home} />
        {/* redirect / to /0 */}
        <Route exact path="/" render={() => <Redirect to="/0" />} />
      </Switch>
    </BrowserRouter>
  );
}
