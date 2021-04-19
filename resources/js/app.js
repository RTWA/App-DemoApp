import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { AddPoints, DemoAppSettings, Members, Teams } from './components';

ReactDOM.render(
    <BrowserRouter basename="/apps/DemoApp">
        <Switch>
            <Route exact path="/points" name="Add Points" component={AddPoints} />
            <Route exact path="/members" name="Manage Members" component={Members} />
            <Route exact path="/teams" name="Manage Teams" component={Teams} />
            <Route exact path="/settings" name="App Settings" component={DemoAppSettings} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('WebApps_AppContainer')
);
