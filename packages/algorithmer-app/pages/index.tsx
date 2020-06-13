import { memo } from "preact/compat";
import Router from "preact-router";
import AsyncRoute from "preact-async-route";
import { Redirect } from "../../algorithmer-misc/Redirect";

const App = memo(() => {
  document.title = 'OpenBots';

  return (
    <Router>
      <AsyncRoute path={'/dashboard'} getComponent={() => import('./Dashboard').then(a => a.default)} loading={() => <div>Loading...</div>} />
      <AsyncRoute path={'/constructor'} getComponent={() => import('./Constructor').then(a => a.default)} loading={() => <div>Loading...</div>} />
      <Redirect default to={'/dashboard'} />
    </Router>
  );
});

export default App;