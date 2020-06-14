import { useShortcuts } from "../algorithmer-utils/shortcuts";
import { useEffect } from "preact/hooks";

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

export const MovableRect = ({ width, height, x: defaultX, y: defaultY }: { width: number, height: number, x: number, y: number }) =>
  (canvas: HTMLCanvasElement) => {
  let x = defaultX;
  let y = defaultY;
  let isPushed = false;
  let pushedDeltaX = 0;
  let pushedDeltaY = 0;

  useEffect(() => {
    let handleMouseMove = (e: MouseEvent) => {
      if (isPushed) {
        let pos = getMousePos(canvas, e);
        x = pos.x + pushedDeltaX;
        y = pos.y + pushedDeltaY;
      }
    };
    let handleMouseUp = (e: MouseEvent) => {
      isPushed = false;
    };
    let handleMouseDown = (e: MouseEvent) => {
      let pos = getMousePos(canvas, e);
      if (pos.x > x && pos.x < x + width && pos.y > y && pos.y < y + height) {
        isPushed = true;
        pushedDeltaY =  y - pos.y;
        pushedDeltaX = x - pos.x;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    }
  }, [canvas]);

  return (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (x, y, width, height);
  };
};