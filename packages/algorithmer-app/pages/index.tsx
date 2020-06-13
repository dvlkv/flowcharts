import { memo, Fragment } from "preact/compat";
import Router from "preact-router";
import AsyncRoute from "preact-async-route";
import { Redirect } from "../../algorithmer-misc";
import Navbar from "../../algorithmer-navbar";

require('./index.less');

const Content = memo(() => {
  document.title = 'OpenBots';

  return (
    <Router>
      <AsyncRoute path={'/dashboard'} getComponent={() => import('./Dashboard').then(a => a.default)} loading={() => <div>Loading...</div>} />
      <AsyncRoute path={'/constructor'} getComponent={() => import('./Constructor').then(a => a.default)} loading={() => <div>Loading...</div>} />
      <Redirect default to={'/dashboard'} />
    </Router>
  );
});



const App = memo(() => {
  return (
    <Fragment>
      <Content />
      <div className={'navbar-container'}>
        <Navbar routes={[{ link: '/dashboard', text: 'Dashboard' }, { link: '/constructor', text: 'Constructor' }]} />
      </div>
    </Fragment>
  )
});

export default App;