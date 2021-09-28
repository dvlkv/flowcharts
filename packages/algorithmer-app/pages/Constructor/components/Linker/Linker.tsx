import { memo } from "preact/compat";
import { useEffect, useMemo, useReducer, useState } from "preact/hooks";
import { useShortcuts } from "../../../../../algorithmer-utils/shortcuts";
import { cx } from "../../../../../algorithmer-utils";
import { ArrowsMutations, LinkerContext, LinkerObject, LinkerObjectDescriptor } from "./context";
import { Arrow, UnlinkedArrow } from "./Arrows";

type LinkerState = {
  objects: Map<string, LinkerObject>,
  maps: [string, string, string][],
  linkingId: string | null
}

type LinkerActions = { type: 'USE_OBJECT', id: string, obj: LinkerObjectDescriptor | null } |
  { type: 'START_LINKING', id: string | null } |
  { type: 'END_LINKING', id: string } |
  { type: 'REFRESH_OBJECT', id: string } |
  { type: 'REFRESH_ALL' } |
  { type: 'SET_ATTACHED', id: string, attached: boolean }

export default memo(({ children, mappings, parent, parentScrollLeft }: any) => {
  const [state, dispatch] = useReducer<LinkerState, LinkerActions>((prevState, action) => {
    if (action.type === 'USE_OBJECT') {
      if (!action.obj) {
        prevState.objects.delete(action.id);
      } else {
        prevState.objects.set(action.id, {
          ...action.obj,
          id: action.id,
          position: action.obj.factory(),
          attached: true,
        });
      }
    }
    if (action.type === 'REFRESH_OBJECT') {
      let object = prevState.objects.get(action.id);
      if (object) {
        prevState.objects.set(action.id, {
          ...object,
          position: object.factory(),
        });
      }
    }
    if (action.type === 'REFRESH_ALL') {
      for (let [id, obj] of prevState.objects.entries()) {
        prevState.objects.set(id, {
          ...obj,
          position: obj.factory(),
        });
      }
    }
    if (action.type === 'START_LINKING') {
      prevState.linkingId = action.id;
      prevState.maps = prevState.maps.filter(a => a[0] !== prevState.linkingId);
    }
    if (action.type === 'END_LINKING') {
      if (!prevState.linkingId) {
        return prevState;
      }
      let linkingObj = prevState.objects.get(prevState.linkingId);
      let right = prevState.objects.get(action.id);
      if (linkingObj && right && right.canLinkWith(linkingObj)) {
        prevState.maps.push([prevState.linkingId, action.id, '#2fb6ff']);
        prevState.linkingId = null;
      } else {
        return prevState;
      }
    }
    if (action.type === 'SET_ATTACHED') {
      let obj = prevState.objects.get(action.id);
      if (!obj) {
        return prevState;
      }

      prevState.objects.set(action.id, {
        ...obj,
        attached: action.attached,
      });
    }
    return { ...prevState };
  }, {
    objects: new Map<string, LinkerObject>(),
    maps: mappings,
    linkingId: null
  });

  const mutations: ArrowsMutations = {
    useObject: (id, obj) => {
      dispatch({ type: 'USE_OBJECT', id, obj });
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
    },
    detach: (id) => {
      dispatch({ type: 'SET_ATTACHED', id, attached: false });
    },
    attach: (id) => {
      dispatch({ type: 'SET_ATTACHED', id, attached: true });
    }
  };

  let arrows = useMemo<{ from: any, to: any, color: string }[]>(() => {
    let newArrows = []
    for (let [leftId, rightId, color] of state.maps) {
      let left = state.objects.get(leftId);
      let right = state.objects.get(rightId);
      if (!left || !right) {
        continue;
      }
      if (!left.attached || !right.attached) {
        continue;
      }
  
      newArrows.push({
        from: {
          x: left.position.endX - parent.x,
          y: left.position.endY - parent.y,
        },
        to: {
          x: right.position.startX - parent.x,
          y: right.position.startY - parent.y
        },
        color: color
      })
    }
    return newArrows
  }, [state, ])

  useShortcuts([{
    code: 'Escape',
    handler: () => {
      dispatch({ type: "START_LINKING", id: null });
    }
  }]);

  let linkingObj: LinkerObject | undefined;
  if (state.linkingId) {
    linkingObj = state.objects.get(state.linkingId);
  }

  return (
    <LinkerContext.Provider value={{ ...mutations, linking: linkingObj, parent, parentScrollLeft }}>
      {children}
      {arrows.map(a => <Arrow {...a} />)}
      {linkingObj && <UnlinkedArrow
          color={"#2fb6ff"}
          from={{
            x: linkingObj.position.endX - parent.x,
            y: linkingObj.position.endY - parent.y,
          }}/>}
    </LinkerContext.Provider>
  )
});