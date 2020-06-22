import { memo } from "preact/compat";
import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useShortcuts } from "../../../../algorithmer-utils/shortcuts";
import { cx } from "../../../../algorithmer-utils";

const useMousePosition = () => {
  let [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.x,
        y: e.y
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return mousePos;
};

const Arrow = memo(({ from, to }: any) => {
  let path = `M0.5 ${to.y <= from.y ? Math.abs(to.y - from.y) + 10 : 10}`;
  let hLen = (to.x - from.x - 18) / 2;
  let vLen = to.y - from.y;

  let bezierParameter = 5;
  if (Math.abs(vLen) < 10) {
    path += ` h ${to.x - from.x - 8}`;
  } else {
    path += ` h ${hLen}`;
    if (vLen > 0) {
      path += ` q ${bezierParameter} 0 ${bezierParameter} ${bezierParameter}`;
      path += ` v ${vLen - 10}`;
      path += ` q 0 ${bezierParameter} ${bezierParameter} ${bezierParameter}`;
    } else {
      path += ` q ${bezierParameter} 0 ${bezierParameter} -${bezierParameter}`;
      path += ` v ${vLen + 10}`;
      path += ` q 0 -${bezierParameter} ${bezierParameter} -${bezierParameter}`;
    }

    path += ` h ${hLen}`;
  }
  return (
    <svg style={{
      position: 'absolute',
      left: Math.min(from.x, to.x),
      top: Math.min(from.y, to.y) - 10,
      width: Math.abs(to.x - from.x) + 5,
      height: Math.abs(to.y - from.y) + 20,
      pointerEvents: 'none'
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

type LinkerObject = { startX: number, startY: number, endX: number, endY: number };

type ArrowsState = {
  objects: Map<string, LinkerObject>
}

type ArrowsMutations = {
  useObject: (id: string, obj: LinkerObject) => void,
  startLinking: (id: string) => void,
  endLinking: (id: string) => void,
}

export const LinkerContext = createContext<ArrowsState & ArrowsMutations & { linkingId: string | undefined } | null>(null);
export const Linker = memo(({ children, mappings, parent }: any) => {
  let [state, mutate] = useState<ArrowsState>({
    objects: new Map<string, { startX: number, startY: number, endX: number, endY: number }>(),
  });

  let [linkingId, setLinkingId] = useState<string | undefined>(undefined);
  let [maps, setMappings] = useState<[string, string][]>(mappings);

  const mutations: ArrowsMutations = {
    useObject: (id: string, obj) => {
      mutate({
        ...state,
        objects: state.objects.set(id, obj),
      });
    },
    startLinking: (id) => {
      setMappings(maps.filter(a => a[0] != id));
      setLinkingId(id);
    },
    endLinking: (id) => {
      if (linkingId && linkingId !== id) {
        setMappings(maps.concat([[linkingId, id]]));
        setLinkingId(undefined);
      }
    }
  };

  let arrows = [];
  for (let [leftId, rightId] of maps) {
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

  let mousePos = useMousePosition();
  useShortcuts([{
    code: 'Escape',
    handler: () => {
      setLinkingId(undefined);
    }
  }]);

  if (linkingId) {
    let linkingObj = state.objects.get(linkingId);
    if (linkingObj) {
      arrows.push({
        from: {
          x: linkingObj.endX - parent.x,
          y: linkingObj.endY - parent.y,
        },
        to: {
          x: Math.max(linkingObj.endX - parent.x + 20, mousePos.x - parent.x),
          y: mousePos.y - parent.y
        }
      });
    }
  }

  return (
    <LinkerContext.Provider value={{ ...state, ...mutations, linkingId: linkingId }}>
      <div className={cx('linker', linkingId ? 'linking' : '')}>
        {children}
        {arrows.map(a => <Arrow {...a} />)}
      </div>
    </LinkerContext.Provider>
  )
});