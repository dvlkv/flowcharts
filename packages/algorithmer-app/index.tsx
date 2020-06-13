// Must be the first import
import { Suspense } from "preact/compat/src/suspense";

if (process.env.NODE_ENV==='development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require("preact/debug");
}

import { render } from 'preact';
import App from "./pages";

render(<App />, document.getElementById('root')!);