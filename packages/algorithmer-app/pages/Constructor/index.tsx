import { Fragment } from "preact";
import { Canvas } from "../../../algorithmer-canvas";

require('./index.less');

const Constructor = () => {
  return (
    <Fragment>
      <Canvas className={'constructor-canvas'} />
    </Fragment>
  )
};

export default Constructor;