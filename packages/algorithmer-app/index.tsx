import { render } from 'preact';
import React, { lazy, memo, Suspense } from 'preact/compat';

const ConstructorPage = lazy(() => import('./pages/ConstuctorPage'));

const App = memo(() => {
  document.title = 'OpenBots';

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ConstructorPage/>
      </Suspense>
      <div className={'pidor'}>Max pidor</div>
    </div>
  );
});

render(<App/>, document.getElementById('root')!);