import { v4 as uuidv4 } from 'uuid';
import { CanvasObject } from "./createCanvasObject";

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

export class CanvasObjectManager {
  private shouldRender: boolean = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private readonly objects: Map<string, CanvasObject> = new Map<string, CanvasObject>();
  private renderQueue: string[] = [];

  constructor() {}

  useCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    this.canvas = canvas;
    this.ctx = ctx;
  };

  registerObject = (object: CanvasObject) => {
    let id = uuidv4();
    this.objects.set(id, object);
    this.renderQueue.push(id);
    return () => {
      this.objects.delete(id);
      this.renderQueue = this.renderQueue.filter((a) => a != id);
    }
  };

  startRendering = () => {
    this.shouldRender = true;
    requestAnimationFrame(this.render);
  };

  stopRendering = () => {
    this.shouldRender = false;
  };

  private render = () => {
    if (!this.ctx || !this.canvas || !this.shouldRender) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
    for (let id of this.renderQueue) {
      let obj = this.objects.get(id);
      if (!obj) {
        continue;
      }
      obj.render(this.ctx);
    }
    if (this.shouldRender) {
      requestAnimationFrame(this.render);
    }
  };

  /*
  * Events
  * */
  handleMouseMove = (e: MouseEvent) => {
    let pos = getMousePos(this.canvas!, e);
    for (let obj of this.objects.values()) {
      if (obj.onMouseMove) {
        obj.onMouseMove(pos.x, pos.y);
      }
    }
  };
  handleMouseUp = (e: MouseEvent) => {
    let pos = getMousePos(this.canvas!, e);
    for (let obj of this.objects.values()) {
      if (obj.contains && obj.contains(pos.x, pos.y) && obj.onMouseUp) {
        let stopPropagation = obj.onMouseUp(pos.x, pos.y);
        if (stopPropagation) {
          break;
        }
      }
    }
  };

  handleMouseDown = (e: MouseEvent) => {
    let pos = getMousePos(this.canvas!, e);
    for (let obj of this.objects.values()) {
      if (obj.contains && obj.contains(pos.x, pos.y) && obj.onMouseDown) {
        let stopPropagation = obj.onMouseDown(pos.x, pos.y);
        if (stopPropagation) {

          break;
        }
      }
    }
    // if (pos.x > x && pos.x < x + width && pos.y > y && pos.y < y + height) {
    //   isPushed = true;
    //   pushedDeltaY =  y - pos.y;
    //   pushedDeltaX = x - pos.x;
    // }
  };
}