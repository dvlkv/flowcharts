import { useEffect, useRef, useState } from "preact/hooks";
import { createContext } from "preact";
import { cx } from "../algorithmer-utils";
import { useShortcuts } from "../algorithmer-utils/shortcuts";
import { MovableRect } from "./MovableRect";
import { memo } from "preact/compat";

type CanvasElement = never;

type CanvasProps = { className?: string, children?: CanvasElement[] }

export default function scaleCanvas(canvas: HTMLCanvasElement, context: any, width: number, height: number) {
  // assume the device pixel ratio is 1 if the browser doesn't specify it
  const devicePixelRatio = window.devicePixelRatio || 1;

  // determine the 'backing store ratio' of the canvas context
  const backingStoreRatio = (
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1
  );

  // determine the actual ratio we want to draw at
  const ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    // set the 'real' canvas size to the higher width/height
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // ...then scale it back down with CSS
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }
  else {
    // this is a normal 1:1 device; just scale it simply
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '';
    canvas.style.height = '';
  }

  // scale the drawing context so everything will work at the higher ratio
  context.scale(ratio, ratio);
}




const CanvasContext = createContext<CanvasRenderingContext2D | null>(null);
export const Canvas = memo(({ className, children }: CanvasProps) => {
  const ref = useRef<HTMLCanvasElement>();

  let [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    let ctx = ref.current!.getContext('2d')!;
    setCtx(ctx);

    const onResize = () => {
      scaleCanvas(ref.current!, ctx, window.innerWidth, window.innerHeight - 50);
    };
    onResize();

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [ref]);

  let rect = MovableRect({ width: 200, height: 80, x: 10, y: 10 })(ref.current!);
  let secondRect = MovableRect({ width: 200, height: 80, x: 10, y: 200 })(ref.current!);

  useEffect(() => {
    const render = () => {
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, ref.current!.width, ref.current!.width);

      rect(ctx);
      secondRect(ctx);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, [ctx]);


  return (
    <CanvasContext.Provider value={ctx}>
      <canvas ref={ref} className={cx('canvas-fix', className)}>
        Your browser does not supported.
      </canvas>
    </CanvasContext.Provider>
  )
})