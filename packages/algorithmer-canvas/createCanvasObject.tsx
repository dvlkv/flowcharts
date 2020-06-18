import { useContext, useEffect } from "preact/hooks";
import { Fragment, createContext } from "preact";
import { CanvasContext } from "./index";
import { memo } from "preact/compat";

export type CanvasObject = {
  render: (ctx: CanvasRenderingContext2D) => void;
  contains?: (pointX: number, pointY: number) => boolean;
  onMouseMove?: (x: number, y: number) => void;
  onMouseUp?: (x: number, y: number) => boolean | undefined;
  onMouseDown?: (x: number, y: number) => boolean | undefined;
};

export type CanvasObjectProps = {
  children?: any;
  x: number;
  y: number;
}

type CanvasObjectParent = {
  x: number,
  y: number
}

const CanvasObjectParentContext = createContext<CanvasObjectParent | null>(null);
export function createCanvasObject<TProps = {}>(f: (props: TProps & CanvasObjectProps) => CanvasObject) {
  return memo((props: TProps & CanvasObjectProps) => {
    let canvasObjectManager = useContext(CanvasContext);

    let obj = f(props);

    useEffect(() => {
      return canvasObjectManager!.registerObject(obj);
    }, [props]);

    return <CanvasObjectParentContext.Provider value={{ x: props.x, y: props.y }}>{props.children}</CanvasObjectParentContext.Provider>;
  })
}