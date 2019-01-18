import React from 'react';
import { Route, Switch, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
import Monitor from './routes/Monitor.js';

const { ConnectedRouter } = routerRedux;
/* history由history包提供 */
function RouterConfig({ history, app }) {
  const routes = [
    {
      path: '/',
      component: () => import('./routes/Home'),
      models: () => [import('./models/home')],
    }, {
      path: '/monitor',
      component: () => import('./routes/Real-time_monitor'),
    }, {
      path: '/devices',
      component: () => import('./routes/Devices'),
    }, {
      path: '/devices/:DevSN',
      models: () => [import('./models/detail'), import('./models/parmsDetail')],
      component: () => import('./routes/Detail'),
    }, {
      path: '/upgrade',
      models: () => [import('./models/upgrade')],
      component: () => import('./routes/Upgrade'),
    },
  ];

  return (
    <ConnectedRouter history={history}>
      <Monitor>
        <Switch>
          {
          routes.map(({ path, ...dynamics }, key) => (
            <Route
              key={key} exact path={path}
              component={dynamic({ app, ...dynamics })}
            />
          ))
        }
        </Switch>
      </Monitor>
    </ConnectedRouter>
  );
}

export default RouterConfig;
