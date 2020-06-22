import { memo, Fragment } from "preact/compat";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { LinkerContext } from "./Linker";
import { cx } from "../../../../algorithmer-utils";

export const ConstructorBlock = memo(({ id }: any) => {
  const linker = useContext(LinkerContext);

  const ref = useRef<HTMLDivElement>();
  let rect = useMemo(() => ref.current ? ref.current!.getBoundingClientRect() : null, [ref.current]);
  const onResize = () => {
    if (!rect) {
      return;
    }
    linker!.useObject(id, {
      endX: rect.x + rect.width - 12,
      endY: rect.y + rect.height / 2,
      startX: rect.x,
      startY: rect.y + rect.height / 2
    });
  };

  useEffect(() => {
    onResize();
  }, [rect]);

  /* linking */
  const startLinking = (e: Event) => {
    linker!.startLinking(id);
    e.stopPropagation();
  };

  const endLinking = () => {
    linker!.endLinking(id);
  };

  return (
    <div
      className={cx('constructor-block-outer')}
    >
      <div
        onClick={endLinking}
        className={cx('constructor-block', (linker?.linkingId && linker.linkingId !== id) && 'linking')}
        ref={ref}
      >
        {id}
        <div className={'dot-inner'} onClick={startLinking}>
          <div className={'dot-outer'}/>
        </div>
      </div>
    </div>
  )
});