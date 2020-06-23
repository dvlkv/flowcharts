import { memo, Fragment } from "preact/compat";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { LinkerContext } from "./Linker";
import { cx } from "../../../../algorithmer-utils";

export const ConstructorBlock = memo(({ id }: any) => {
  const linker = useContext(LinkerContext);

  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    if (!linker || !ref.current) {
      return;
    }

    linker!.useObject(id, () => {
      let rect = ref.current!.getBoundingClientRect();
      return {
        endX: rect.x + rect.width - 12,
        endY: rect.y + rect.height / 2,
        startX: rect.x,
        startY: rect.y + rect.height / 2
      };
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
      linker!.useObject(id, null);
    } else {
      linker!.useObject(id, () => {
        let rect = ref.current!.getBoundingClientRect();
        return {
          endX: rect.x + rect.width - 12,
          endY: rect.y + rect.height / 2,
          startX: rect.x,
          startY: rect.y + rect.height / 2
        };
      });
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
          className={cx('constructor-block', (linker?.linkingId && linker.linkingId !== id) && 'linking', dragging && 'dragging')}
          ref={ref}
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          Выполнить
          <div className={'dot-inner'} onClick={startLinking}>
            <div className={'dot-outer'}/>
          </div>
        </div>
      </div>
    </Fragment>
  )
});