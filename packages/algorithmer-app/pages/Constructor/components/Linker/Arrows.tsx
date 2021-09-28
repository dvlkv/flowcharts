import { memo } from "preact/compat";
import { useContext } from "preact/hooks";
import { useMouse } from "../../../../../algorithmer-utils/shortcuts";
import { LinkerContext } from "./context";

export const Arrow = memo(({ from, to, color }: any) => {
  let hLen = to.x - from.x;
  let vLen = to.y - from.y;

  let path = `M${to.x < from.x ? (-hLen + 2) : 2} 0`;


  const id = Math.ceil(Math.random() * 1000);

  if (Math.abs(hLen) < 10) {
    path += ` v ${to.y - from.y}`;
  } else {
    path += ` v ${vLen / 2}`;
    if (vLen > 0) {
      path += ` h ${hLen}`;
    } else {
      path += ` h ${hLen}`;
    }

    path += ` v ${vLen / 2}`;
  }
  return (
    <svg style={{
      position: 'absolute',
      left: Math.min(from.x, to.x),
      top: Math.min(from.y, to.y),
      width: Math.abs(to.x - from.x) + 4,
      height: Math.abs(to.y - from.y),
      pointerEvents: 'none'
    }}
    >
      {/*<path d='M0 5 h100 q 10 0 10 10 v 10 q 0 10 10 10 h 100' stroke={'black'} stroke-width={2}*/}
      {/*      marker-start={'url(#arrowback)'} marker-end={'url(#arrowhead)'} fill={'none'}>*/}
      <path d={path} stroke={color} stroke-width={2} fill={'none'}>
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