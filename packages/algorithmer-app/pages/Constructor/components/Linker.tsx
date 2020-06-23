import { memo } from "preact/compat";
import { createContext } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { useMouse, useShortcuts } from "../../../../algorithmer-utils/shortcuts";
import { cx } from "../../../../algorithmer-utils";
import { act } from "preact/test-utils";

export const LinkerContext = createContext<ArrowsMutations & { linkingId: string | null, parent: DOMRect, parentScrollLeft: number } | null>(null);

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

const UnlinkedArrow = memo(({ obj }: any) => {
  const ctx = useContext(LinkerContext);
  if (!ctx) {
    return null;
  }

  const mousePos = useMouse();
  const { from, to } = {
    from: {
      x: obj.endX - ctx.parent.x,
      y: obj.endY - ctx.parent.y,
    },
    to: {
      x: Math.max(obj.endX - ctx.parent.x + 20, mousePos.x - ctx.parent.x + ctx.parentScrollLeft),
      y: mousePos.y ? mousePos.y - ctx.parent.y : obj.endY - ctx.parent.y
    }
  };
  return (
    <Arrow from={from} to={to} />
  )
});

type LinkerObject = { startX: number, startY: number, endX: number, endY: number };
type ArrowsMutations = {
  useObject: (id: string, obj: (() => LinkerObject) | null) => void,
  refresh: (id: string) => void,
  refreshAll: () => void,
  startLinking: (id: string) => void,
  endLinking: (id: string) => void,
}

type LinkerState = {
  objects: Map<string, () => LinkerObject>,
  maps: [string, string][],
  positions: Map<string, LinkerObject>,
  linkingId: string | null
}

type LinkerActions = { type: 'USE_OBJECT', id: string, factory: (() => LinkerObject) | null } |
  { type: 'START_LINKING', id: string | null } |
  { type: 'END_LINKING', id: string } |
  { type: 'REFRESH_OBJECT', id: string } |
  { type: 'REFRESH_ALL' }

export const Linker = memo(({ children, mappings, parent, parentScrollLeft }: any) => {
  const [state, dispatch] = useReducer<LinkerState, LinkerActions>((prevState, action) => {
    if (action.type === 'USE_OBJECT') {
      if (!action.factory) {
        prevState.objects.delete(action.id);
        prevState.positions.delete(action.id);
      } else {
        prevState.objects.set(action.id, action.factory);
        prevState.positions.set(action.id, action.factory());
      }
    }
    if (action.type === 'REFRESH_OBJECT') {
      let factory = prevState.objects.get(action.id);
      if (factory) {
        prevState.positions.set(action.id, factory());
      }
    }
    if (action.type === 'REFRESH_ALL') {
      for (let [id, factory] of prevState.objects.entries()) {
        prevState.positions.set(id, factory());
      }
    }
    if (action.type === 'START_LINKING') {
      prevState.linkingId = action.id;
      prevState.maps = prevState.maps.filter(a => a[0] !== prevState.linkingId);
    }
    if (action.type === 'END_LINKING') {
      if (prevState.linkingId) {
        prevState.maps.push([prevState.linkingId, action.id]);
        prevState.linkingId = null;
      }
    }
    return { ...prevState };
  }, {
    objects: new Map<string, () => LinkerObject>(),
    maps: [],
    positions: new Map<string, LinkerObject>(),
    linkingId: null
  });

  const mutations: ArrowsMutations = {
    useObject: (id: string, factory: (() => LinkerObject) | null) => {
      dispatch({ type: 'USE_OBJECT', id, factory });
    },
    startLinking: (id) => {
      dispatch({ type: "START_LINKING", id });
    },
    endLinking: (id) => {
      dispatch({ type: "END_LINKING", id });
    },
    refresh: (id) => {
      dispatch({ type: "REFRESH_OBJECT", id });
    },
    refreshAll: () => {
      dispatch({ type: "REFRESH_ALL" });
    }
  };

  let arrows = [];
  for (let [leftId, rightId] of state.maps) {
    let left = state.positions.get(leftId);
    let right = state.positions.get(rightId);
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

  useShortcuts([{
    code: 'Escape',
    handler: () => {
      dispatch({ type: "START_LINKING", id: null });
    }
  }]);

  let linkingObj: any;
  if (state.linkingId) {
    linkingObj = state.positions.get(state.linkingId);
  }

  return (
    <LinkerContext.Provider value={{ ...mutations, linkingId: state.linkingId, parent, parentScrollLeft }}>
      <div className={cx('linker', state.linkingId ? 'linking' : '')}>
        {children}
        {arrows.map(a => <Arrow {...a} />)}
        {linkingObj && <UnlinkedArrow obj={linkingObj} />}
      </div>
    </LinkerContext.Provider>
  )
});