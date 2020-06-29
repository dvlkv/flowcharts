import { Fragment } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { memo } from "preact/compat";
import Linker from "./components/Linker/Linker";
import { ConstructorBlock } from "./components/ConstructorBlock";

require('./index.less');

const ConstructorStep = memo(({ data, i }: any) => {
  let type = i % 2 === 0 ? 'action' : 'subscription';
  return (
    <div className={'constructor-step'}>
      {data.map((a: any) => <ConstructorBlock step={i} type={type} id={a.id}/>)}
    </div>
  )
});

const ConstructorBranch = memo(({ data }: any) => {
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
          mappings={data.connections}
        >
          {data.steps.map((a: any, i: number) => <ConstructorStep i={i + 1} data={a} />)}
        </Linker>
      </div>
    </div>
  );
});

const Constructor = memo(() => {
  return (
    <Fragment>
      <h1>Конструктор</h1>
      <ConstructorBranch data={{
        steps: [[{ id: 'kek' }], [{ id: 'flex' }, { id: 'lol' }, { id: 'test' }], [{ id: 'lel' }]],
        connections: [
          ['kek', 'flex'],
          ['lol', 'lel'],
          ['test', 'lel']
        ]
      }} />
    </Fragment>

    // <CanvasContextProvider>
    // <Canvas className={'constructor-canvas'}/>
    // <Rect height={100} width={200} x={100} y={200} fillColor={'rgb(10, 100, 0)'}/>
    // <Rect height={100} width={200} x={100} y={200} fillColor={'rgb(100, 0, 0)'}/>
    // </CanvasContextProvider>
  )
});

export default Constructor;