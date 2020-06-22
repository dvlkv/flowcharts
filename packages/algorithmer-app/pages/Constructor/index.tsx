import { createContext, Fragment, Ref } from "preact";
import { PropRef, useContext, useEffect, useRef, useState } from "preact/hooks";
import { memo } from "preact/compat";
import { ArrowsContext, ArrowsRoot } from "./components/Arrow";

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
  const arrows = useContext(ArrowsContext);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    let rect = ref.current.getBoundingClientRect();
    arrows!.useObject(id, {
      endX: rect.x + rect.width - 10,
      endY: rect.y + rect.height / 2,
      startX: rect.x,
      startY: rect.y + rect.height / 2
    });
  }, [ref]);

  return (
    <div className={'constructor-block'} ref={ref}>
      {id}
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
        <ArrowsRoot parent={position} mappings={[
          ['kek', 'lol'],
          ['kek', 'flex'],
          ['kek', 'test'],
          ['lol', 'lel'],
          ['flex', 'lel'],
          ['lel', 'lel2'],
          ['lel2', 'lol2']
        ]}>
          {children}
        </ArrowsRoot>
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