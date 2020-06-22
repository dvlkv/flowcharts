import { createContext, Fragment, Ref } from "preact";
import { PropRef, useContext, useEffect, useRef, useState } from "preact/hooks";
import { memo } from "preact/compat";
import { LinkerContext, Linker } from "./components/Arrow";
import { cx } from "../../../algorithmer-utils";

require('./index.less');

const ConstructorStep = memo(({ children }: any) => {
  return (
    <div className={'constructor-step'}>
      {children}
    </div>
  )
});

const ConstructorBlock = memo(({ id }: any) => {
  let ref = useRef<HTMLDivElement>();
  const linker = useContext(LinkerContext);
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    let rect = ref.current.getBoundingClientRect();
    setRect(rect);
    linker!.useObject(id, {
      endX: rect.x + rect.width - 12,
      endY: rect.y + rect.height / 2,
      startX: rect.x,
      startY: rect.y + rect.height / 2
    });
  }, [ref]);

  const startLinking = (e: Event) => {
    linker!.startLinking(id);
    e.stopPropagation();
  };

  const endLinking = () => {
    linker!.endLinking(id);
  }

  return (
    <div onClick={endLinking} className={cx('constructor-block', (linker?.linkingId && linker.linkingId !== id) ? 'linking' : '')} ref={ref}>
      {id}
      <div className={'dot-inner'} onClick={startLinking}>
        <div className={'dot-outer'} />
      </div>
    </div>
  )
});

const ConstructorBranch = memo(({ children }: any) => {
  let container = useRef<HTMLDivElement>();
  let [position, setPosition] = useState<DOMRect | null>(null);
  useEffect(() => {
    setPosition(container.current!.getBoundingClientRect());
  }, [container]);
  return (
    <div ref={container} className={'constructor-branch-outer'}>
      <div className={'constructor-branch'}>
        <Linker parent={position} mappings={[
          ['kek', 'lol'],
          ['kek', 'flex'],
          ['kek', 'test'],
          ['lol', 'lel'],
          ['flex', 'lel'],
          ['lel2', 'lol2'],
          ['test', 'lel']
        ]}>
          {children}
        </Linker>
      </div>
    </div>
  );
});

const Constructor = memo(() => {
  return (
    <Fragment>
      <h1>Конструктор</h1>
      <ConstructorBranch>
        <ConstructorStep>
          <ConstructorBlock id={'kek'}/>
        </ConstructorStep>
        <ConstructorStep>
          <ConstructorBlock id={'flex'}/>
          <ConstructorBlock id={'lol'}/>
          <ConstructorBlock id={'test'}/>
        </ConstructorStep>
        <ConstructorStep>
          <ConstructorBlock id={'lel'}/>
        </ConstructorStep>
        <ConstructorStep>
          <ConstructorBlock id={'lel2'}/>
        </ConstructorStep>
        <ConstructorStep>
          <ConstructorBlock id={'lol2'}/>
        </ConstructorStep>
      </ConstructorBranch>
    </Fragment>

    // <CanvasContextProvider>
    // <Canvas className={'constructor-canvas'}/>
    // <Rect height={100} width={200} x={100} y={200} fillColor={'rgb(10, 100, 0)'}/>
    // <Rect height={100} width={200} x={100} y={200} fillColor={'rgb(100, 0, 0)'}/>
    // </CanvasContextProvider>
  )
});

export default Constructor;