import { memo, Fragment } from "preact/compat";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { LinkerContext, LinkerObject } from "./Linker/context";
import { cx } from "../../../../algorithmer-utils";

export const ConstructorBlock = memo(({ id, type, step }: any) => {
  const linker = useContext(LinkerContext);

  const ref = useRef<HTMLDivElement>();
  const canBeLinkedWith = (obj: LinkerObject) => {
    if (obj.id === id) {
      return false;
    }
    return obj.meta.step + 1 === step;
  };
  useEffect(() => {
    if (!linker || !ref.current) {
      return;
    }

    linker!.useObject(id, {
      factory: () => {
        let rect = ref.current!.getBoundingClientRect();
        return {
          endX: rect.x + rect.width - 12,
          endY: rect.y + rect.height / 2,
          startX: rect.x,
          startY: rect.y + rect.height / 2,
        };
      },
      canLinkWith: canBeLinkedWith,
      meta: {
        type: type,
        step: step,
      }
    });
  }, [ref]);

  /* linking */
  const startLinking = (e: Event) => {
    linker!.startLinking(id);
    e.stopPropagation();
  };

  const endLinking = () => {
    linker!.endLinking(id);
  };

  /* dragging */
  let [dragging, setDragging] = useState(false);
  const onDragStart = () => {

    setTimeout(() => {
      setDragging(true);
    }, 1);
  };

  const onDragEnd = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      linker!.detach(id);
    } else {
      linker!.attach(id);
      linker?.refreshAll();
    }
  }, [dragging]);

  /* drag over */
  const [dragOver, setDragOver] = useState(false);
  const onDragEnter = (e: DragEvent) => {
    setDragOver(true);
    setTimeout(() => {
      linker?.refreshAll();
    }, 1);

    e.stopPropagation();
    e.preventDefault();
    return false;
  };
  const onDragLeave = (e: DragEvent) => {
    if ((e.currentTarget! as HTMLDivElement).contains(e.relatedTarget! as Node)) {
      return;
    }

    setDragOver(false);
    setTimeout(() => {
      linker?.refreshAll();
    }, 1);

    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  return (
    <Fragment>
      <div
        className={cx('constructor-block-outer', dragOver && 'drag-over')}
        onDragEnter={dragging ? undefined : onDragEnter}
        style={{ display: dragging ? 'none' : 'block' }}
        onDragLeave={dragging ? undefined : onDragLeave}
      >
        <div
          onClick={endLinking}
          className={cx('constructor-block', linker?.linking && canBeLinkedWith(linker.linking) && 'linking', dragging && 'dragging')}
          ref={ref}
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {type} {id}
          <div className={'dot-inner'} onClick={startLinking}>
            <div className={'dot-outer'}/>
          </div>
        </div>
      </div>
    </Fragment>
  )
});