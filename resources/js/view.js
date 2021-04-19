import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { ViewPoints } from './components';

ReactDOM.render(
    <BrowserRouter basename="/apps/DemoApp/view/">
        <Switch>
            <Route exact path="/points" name="View Points" component={ViewPoints} />
            <Redirect exact from="/" to="/points" />
        </Switch>
    </BrowserRouter>,
    document.getElementById('DemoApp')
);
