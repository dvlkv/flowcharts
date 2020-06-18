import { Fragment } from "preact";
import { Canvas, CanvasContextProvider } from "../../../algorithmer-canvas";
import { Rect } from "../../../algorithmer-canvas/Rect";

require('./index.less');

const Constructor = () => {
  return (
    <CanvasContextProvider>
      <Canvas className={'constructor-canvas'} />
      <Rect height={100} width={200} x={100} y={200} fillColor={'rgb(10, 100, 0)'} />
      <Rect height={100} width={200} x={100} y={200} fillColor={'rgb(100, 0, 0)'} />
    </CanvasContextProvider>
  )
};

export default Constructor;