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

const getRandomColor = () => {
  const colors = ['#2fb6ff', '#ebac0c'];
  return colors[Math.round(Math.random() * (colors.length - 1))];
}

const Constructor = memo(() => {
  return (
    <div className={'constructor-page'}>
      <h2 className={'constructor-page-header'}><Span text={'CONSTRUCTOR_PAGE'}/></h2>
      <div className={'constructor-container'}>
        <ConstructorBranch data={{
          steps: [
            [{ id: 'kek', text: 'Хочу жрать' }],
            [{ id: 'lol', text: 'Пожарим картошечку?' }],
            [{ id: 'lel', text: 'Не-а' }, { id: 'test', text: 'Го' }],
            [{ id: 'flex', text: 'Погнали нахуй' }, { id: 'sex', text: 'Охуел?' }],
            [{ id: 'test2', text: 'Спасибо!' }],
            [{ id: 'test3', text: 'Пожалуйста, ебать' }]
          ],
          connections: [
            ['kek', 'lol', '#2fb6ff'],
            ['lol', 'lel', '#2fb6ff'],
            ['lol', 'test', '#2fb6ff'],
            ['lel', 'flex', '#ebac0c'],
            ['test', 'sex', '#2fb6ff'],
            ['flex', 'test2', '#2fb6ff'],
            ['sex', 'test2', '#2fb6ff'],
            ['test2', 'test3', '#2fb6ff']
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