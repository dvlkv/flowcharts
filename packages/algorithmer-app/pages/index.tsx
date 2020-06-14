import { memo, Fragment } from "preact/compat";
import Router from "preact-router";
import AsyncRoute from "preact-async-route";
import { Redirect } from "../../algorithmer-utils";
import Navbar from "../../algorithmer-navbar";
import { Span } from "../../algorithmer-locale";

require('./index.less');

const Content = memo(() => {
  document.title = 'OpenBots';

  return (
    <Router>
      <AsyncRoute
        path={'/dashboard'}
        getComponent={() => import('./Dashboard').then(a => a.default)}
        loading={() => <div>Loading...</div>}
      />
      <AsyncRoute
        path={'/constructor'}
        getComponent={() => import('./Constructor').then(a => a.default)}
        loading={() => <div>Loading...</div>}
      />
      <AsyncRoute
        path={'/profile'}
        getComponent={() => import('./Profile').then(a => a.default)}
        loading={() => <div>Loading...</div>}
      />
      <Redirect default to={'/dashboard'}/>
    </Router>
  );
});


const App = memo(() => {
  return (
    <Fragment>
      <div className={'content-container'}>
        <Content/>
      </div>
      <div className={'navbar-container'}>
        <Navbar routes={[
          { link: '/dashboard', text: <Span text="DASHBOARD_PAGE" /> },
          { link: '/constructor', text: <Span text="CONSTRUCTOR_PAGE" /> },
          { link: '/profile', text: <Span text="PROFILE_PAGE" /> },
        ]}
        />
      </div>
    </Fragment>
  )
});

export default App;