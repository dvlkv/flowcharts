import { memo, Fragment } from "preact/compat";
import Router from "preact-router";
import AsyncRoute from "preact-async-route";
import { Redirect } from "../../algorithmer-utils";
import Nav from "../../algorithmer-navigation/Nav";
import { Span } from "../../algorithmer-locale";
import Sidebar from "../components/Sidebar";

require('./index.less');

const Content = memo(() => {
  document.title = 'OpenBots';


  return (
    <Fragment>
      <Nav routes={[
        { link: '/dashboard', text: <Span text="DASHBOARD_PAGE"/> },
        { link: '/constructor', text: <Span text="CONSTRUCTOR_PAGE"/> },
        { link: '/profile', text: <Span text="PROFILE_PAGE"/> },
      ]}
      />
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
    </Fragment>
  );
});


const App = memo(() => {
  return (
    <Fragment>
      <div className={'content-container'}>
        <Content/>
      </div>
    </Fragment>
  )
});

export default App;