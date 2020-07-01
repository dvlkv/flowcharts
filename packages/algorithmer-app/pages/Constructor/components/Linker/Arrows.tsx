import { memo } from "preact/compat";
import { useContext } from "preact/hooks";
import { useMouse } from "../../../../../algorithmer-utils/shortcuts";
import { LinkerContext } from "./context";

export const Arrow = memo(({ from, to, color }: any) => {
  let path = `M0.5 ${to.y <= from.y ? Math.abs(to.y - from.y) + 10 : 10}`;
  let hLen = (to.x - from.x - 16) / 2;
  let vLen = to.y - from.y;

  const id = Math.ceil(Math.random() * 1000);

  let bezierParameter = 5;
  if (Math.abs(vLen) < 10) {
    path += ` h ${to.x - from.x - 6}`;
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
        <marker id={"arrowhead-" + id} markerWidth="5" markerHeight="5"
                refX="0" refY="2.5" orient="auto" fill={color}>
          <polygon points="0 0, 3 2.5, 0 5"/>
        </marker>
        <marker id="arrowback" markerWidth="5" markerHeight="5"
                refX="0" refY="2.5" stroke={color} orient="auto">
          {/*<polygon points="0 0, 0 5, 5 5, 5 0"/>*/}
          <circle r={1.2} cx={1.7} cy={2.5} />
        </marker>
      </defs>
      {/*<path d='M0 5 h100 q 10 0 10 10 v 10 q 0 10 10 10 h 100' stroke={'black'} stroke-width={2}*/}
      {/*      marker-start={'url(#arrowback)'} marker-end={'url(#arrowhead)'} fill={'none'}>*/}
      <path d={path} stroke={color} stroke-width={2} marker-end={`url(#arrowhead-${id})`} fill={'none'}>
      </path>
    </svg>
  )
});

export const UnlinkedArrow = memo((props: any) => {
  const ctx = useContext(LinkerContext);
  if (!ctx) {
    return null;
  }

  const mousePos = useMouse();
  const { to } = {
    to: {
      x: Math.max(props.from.x + 20, mousePos.x - ctx.parent.x + ctx.parentScrollLeft),
      y: mousePos.y ? mousePos.y - ctx.parent.y : props.from.y
    }
  };
  return (
    <Arrow color={props.color} from={props.from} to={to} />
  )
});