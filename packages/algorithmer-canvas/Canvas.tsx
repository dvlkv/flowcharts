import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { createContext } from "preact";
import { cx } from "../algorithmer-utils";
import { memo } from "preact/compat";
import { CanvasObjectManager } from "./CanvasObjectManager";

export type CanvasElement = (canvas: HTMLCanvasElement) => (ctx: CanvasRenderingContext2D) => void;

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

export const CanvasContext = createContext<CanvasObjectManager | null>(null);
export const Canvas = memo(({ className, children }: CanvasProps) => {
  const ref = useRef<HTMLCanvasElement>();

  let canvasObjectManager = useContext(CanvasContext);
  if (!canvasObjectManager) {
    throw new Error('Canvas should be a child of CanvasContextProvider');
  }

  let [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Update context
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

  // Notify manager about context changes
  useEffect(() => {
    if (!ctx || !canvasObjectManager) {
      return;
    }

    canvasObjectManager.useCanvas(ref.current!, ctx);
    document.addEventListener('mousemove', canvasObjectManager.handleMouseMove);
    document.addEventListener('mouseup', canvasObjectManager.handleMouseUp);
    document.addEventListener('mousedown', canvasObjectManager.handleMouseDown);

    canvasObjectManager.startRendering();

    return () => {
      canvasObjectManager!.stopRendering();
      document.removeEventListener('mousemove', canvasObjectManager!.handleMouseMove);
      document.removeEventListener('mouseup', canvasObjectManager!.handleMouseUp);
      document.removeEventListener('mousedown', canvasObjectManager!.handleMouseDown);
    }
  }, [ctx, canvasObjectManager]);


  return (
    <canvas ref={ref} className={cx('canvas-fix', className)}>
      Your browser does not supported.
    </canvas>
  )
});

export const CanvasContextProvider = memo(({ children }) => {
  let [objectManager] = useState(new CanvasObjectManager());

  return (
    <CanvasContext.Provider value={objectManager}>
      {children}
    </CanvasContext.Provider>
  )
});