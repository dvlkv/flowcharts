import { memo } from "preact/compat";
import { createContext } from "preact";
import { useState } from "preact/hooks";

const Arrow = memo(({ from, to }: any) => {
  let path = `M0 ${to.y <= from.y ? Math.abs(to.y - from.y) + 10 : 10}`;
  let hLen = (to.x - from.x - 28) / 2;
  let vLen = to.y - from.y;
  if (vLen == 0) {
    path += ` h ${to.x - from.x - 8}`;
  } else {
    path += ` h ${hLen}`;
    if (vLen > 0) {
      path += ` q 10 0 10 10`;
      path += ` v ${vLen - 20}`;
      path += ` q 0 10 10 10`;
    } else {
      path += ` q 10 0 10 -10`;
      path += ` v ${vLen + 25}`;
      path += ` q 0 -10 10 -10`;
    }

    path += ` h ${hLen}`;
  }
  return (
    <svg style={{
      position: 'absolute',
      left: Math.min(from.x, to.x),
      top: Math.min(from.y, to.y) - 10,
      width: Math.abs(to.x - from.x) + 5,
      height: Math.abs(to.y - from.y) + 20
    }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="5" markerHeight="5"
                refX="0" refY="2.5" orient="auto">
          <polygon points="0 0, 5 2.5, 0 5"/>
        </marker>
        <marker id="arrowback" markerWidth="5" markerHeight="5"
                refX="0" refY="2.5" stroke={'black'} orient="auto">
          {/*<polygon points="0 0, 0 5, 5 5, 5 0"/>*/}
          <circle r={1.2} cx={1.7} cy={2.5} />
        </marker>
      </defs>
      {/*<path d='M0 5 h100 q 10 0 10 10 v 10 q 0 10 10 10 h 100' stroke={'black'} stroke-width={2}*/}
      {/*      marker-start={'url(#arrowback)'} marker-end={'url(#arrowhead)'} fill={'none'}>*/}
      <path d={path} stroke={'black'} stroke-width={2}
            marker-start={'url(#arrowback)'} marker-end={'url(#arrowhead)'} fill={'none'}>
      </path>
    </svg>
  )
});


type ArrowsState = {
  objects: Map<string, { startX: number, startY: number, endX: number, endY: number }>
}

type ArrowsMutations = {
  useObject: (id: string, obj: { startX: number, startY: number, endX: number, endY: number }) => void,
}

export const ArrowsContext = createContext<ArrowsState & ArrowsMutations | null>(null);
export const ArrowsRoot = memo(({ children, mappings, parent }: any) => {
  let [state, mutate] = useState<ArrowsState>({
    objects: new Map<string, { startX: number, startY: number, endX: number, endY: number }>(),
  });


  const mutations: ArrowsMutations = {
    useObject: (id: string, obj) => {
      mutate({
        objects: state.objects.set(id, obj)
      });
    }
  };

  let arrows = [];
  for (let [leftId, rightId] of mappings) {
    let left = state.objects.get(leftId);
    let right = state.objects.get(rightId);
    if (!left || !right) {
      continue;
    }

    arrows.push({
      from: {
        x: left.endX - parent.x,
        y: left.endY - parent.y,
      },
      to: {
        x: right.startX - parent.x,
        y: right.startY - parent.y
      }
    })
  }

  return (
    <ArrowsContext.Provider value={{ ...state, ...mutations }}>
        {children}
        {arrows.map(a => <Arrow {...a} />)}
    </ArrowsContext.Provider>
  )
});