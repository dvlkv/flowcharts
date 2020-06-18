import { CanvasObjectProps, createCanvasObject } from "./createCanvasObject";

type RectProps = {
  width: number,
  height: number,
  fillColor: string,
  strokeColor?: string,
  strokeWidth?: number,
} & CanvasObjectProps

export const Rect = createCanvasObject((props: RectProps) => {
  let x = props.x;
  let y = props.y;
  let isMoving = false;
  let deltaX = 0;
  let deltaY = 0;

  return {
    render: (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = props.fillColor;
      ctx.fillRect(x, y, props.width, props.height);
      if (props.strokeColor) {
        ctx.strokeStyle = props.strokeColor;
        ctx.lineWidth = props.strokeWidth || 1;
        ctx.strokeRect(x, y, props.width, props.height);
      }
    },
    contains: (pointX: number, pointY: number) => {
      return pointX > x && pointX < x + props.width && pointY > y && pointY < y + props.height;
    },
    onMouseMove: (mouseX: number, mouseY: number) => {
      if (isMoving) {
        x = mouseX + deltaX;
        y = mouseY + deltaY;
      }
    },
    onMouseUp: (x: number, y: number) => {
      if (isMoving) {
        isMoving = false;
        return true;
      }
      return false;
    },
    onMouseDown: (mouseX: number, mouseY: number) => {
      isMoving = true;
      deltaX = x - mouseX;
      deltaY = y - mouseY;
      return true;
    }
  };
});