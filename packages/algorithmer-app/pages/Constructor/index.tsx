import { useEffect, useRef, useState } from "preact/hooks";
import { memo } from "preact/compat";
import Linker from "./components/Linker/Linker";
import { ConstructorBlock } from "./components/ConstructorBlock";
import { Span } from "../../../algorithmer-locale";

require('./index.less');

const ConstructorStep = memo(({ data, i }: any) => {
  let type: 'action' | 'subscription' = 'subscription';
  return (
    <div className={'constructor-step'}>
      {data.map((a: any) => <ConstructorBlock step={i} type={type} {...a}/>)}
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
    <div className={'constructor-branch'} ref={container}
         onScroll={() => setScrollLeft(container.current!.scrollLeft)}>
      <Linker
        parent={position}
        parentScrollLeft={scrollLeft}
        mappings={data.connections}
      >
        {data.steps.map((a: any, i: number) => <ConstructorStep i={i + 1} data={a}/>)}
      </Linker>
    </div>
  );
});

const Constructor = memo(() => {
  return (
    <div className={'constructor-page'}>
      <div className={'constructor-container'}>
        <ConstructorBranch data={{
          steps: [
            [{ id: 'kek', text: 'kek' }],
            [{ id: 'lol', text: 'лол' }, { id: 'lol2', text: 'мем' }],
          ],
          connections: [
            ['kek', 'lol', '#2fb6ff'],
            ['kek', 'lol2', '#2fb6ff'],
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