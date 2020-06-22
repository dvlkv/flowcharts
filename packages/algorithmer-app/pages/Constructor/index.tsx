import { Fragment } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { memo } from "preact/compat";
import { Linker } from "./components/Linker";
import { ConstructorBlock } from "./components/ConstructorBlock";

require('./index.less');

const ConstructorStep = memo(({ children }: any) => {
  return (
    <div className={'constructor-step'}>
      {children}
    </div>
  )
});

const ConstructorBranch = memo(({ children }: any) => {
  let container = useRef<HTMLDivElement>();
  let [position, setPosition] = useState<DOMRect | null>(null);
  let [scrollLeft, setScrollLeft] = useState<number>(0);
  useEffect(() => {
    setPosition(container.current!.getBoundingClientRect());
  }, [container]);
  return (
    <div ref={container} className={'constructor-branch-outer'} onScroll={() => setScrollLeft(container.current!.scrollLeft)}>
      <div className={'constructor-branch'}>
        <Linker
          parent={position}
          parentScrollLeft={scrollLeft}
          mappings={[
          ['kek', 'lol'],
          ['kek', 'flex'],
          ['kek', 'test'],
          ['lol', 'lel'],
          ['flex', 'lel'],
          ['lel2', 'lol2'],
          ['test', 'lel']
        ]}
        >
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