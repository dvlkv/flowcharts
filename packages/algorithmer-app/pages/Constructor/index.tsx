import { useEffect, useRef, useState } from "preact/hooks";
import { memo } from "preact/compat";
import Linker from "./components/Linker/Linker";
import { ConstructorBlock } from "./components/ConstructorBlock";
import { Span } from "../../../algorithmer-locale";

require('./index.less');

const ConstructorStep = memo(({ data, i }: any) => {
  let type: 'action' | 'subscription' = i % 2 === 0 ? 'action' : 'subscription';
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
    <div className={'constructor-branch-outer'} ref={container} onScroll={() => setScrollLeft(container.current!.scrollLeft)}>
      <div className={'constructor-branch'}>
        <Linker
          parent={position}
          parentScrollLeft={scrollLeft}
          mappings={data.connections}
        >
          {data.steps.map((a: any, i: number) => <ConstructorStep i={i + 1} data={a}/>)}
        </Linker>
      </div>
    </div>
  );
});

const Constructor = memo(() => {
  return (
    <div>
      <h2 className={'constructor-page-header'}><Span text={'CONSTRUCTOR_PAGE'}/></h2>
      <div className={'constructor-container'}>
        <ConstructorBranch data={{
          steps: [[{ id: 'kek' }], [{ id: 'lol' }], [{ id: 'lel' }, { id: 'test' }], [{ id: 'flex' }, { id: 'sex' }]],
          connections: [
            ['kek', 'lol'],
            ['lol', 'lel'],
            ['lol', 'test'],
            ['lel', 'flex'],
            ['test', 'sex']
          ]
        }}/>
      </div>
    </div>

    // <CanvasContextProvider>
    // <Canvas className={'constructor-canvas'}/>
    // <Rect height={100} width={200} x={100} y={200} fillColor={'rgb(10, 100, 0)'}/>
    // <Rect height={100} width={200} x={100} y={200} fillColor={'rgb(100, 0, 0)'}/>
    // </CanvasContextProvider>
  )
});

export default Constructor;