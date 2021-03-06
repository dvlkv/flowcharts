import { memo, Fragment } from "preact/compat";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { LinkerContext, LinkerObject } from "./Linker/context";
import { cx } from "../../../../algorithmer-utils";
import { Span } from "../../../../algorithmer-locale";
import Button from "../../../../algorithmer-components/Button";
import { useWindowSize } from "../../../../algorithmer-utils/resize";


type ConstructorBlockProps = {
  type: 'action' | 'subscription',
  id: any,
  step: any,
  text: string,
}

export const ConstructorBlock = memo(({ id, type, step, text }: ConstructorBlockProps) => {
  const linker = useContext(LinkerContext);
  const windowSize = useWindowSize();

  const ref = useRef<HTMLDivElement>();
  const canBeLinkedWith = (obj: LinkerObject) => {
    if (obj.id === id) {
      return false;
    }
    return obj.meta.step + 1 === step;
  };
  useEffect(() => {
    if (!linker || !ref.current) {
      return;
    }

    linker!.useObject(id, {
      factory: () => {
        let rect = ref.current!.getBoundingClientRect();
        return {
          endX: rect.x + rect.width / 2,
          endY: rect.y + rect.height,
          startX: rect.x + rect.width / 2,
          startY: rect.y,
        };
      },
      canLinkWith: canBeLinkedWith,
      meta: {
        type: type,
        step: step,
      }
    });
  }, [ref, windowSize]);




  return (
    <div
      className={cx(
        'constructor-block',
        linker?.linking && canBeLinkedWith(linker.linking) && 'linking',
        type
      )}
      ref={ref}
    >
      <div className={'action-title'}>
        <Span text={type === 'subscription' ? 'SUBSCRIPTION_BLOCK' : 'ACTION_BLOCK'}/>
      </div>
      {text}
      {type === 'action' && <Button className={cx('full-width', 'add-command-btn')} type={'orange'}>Добавить команду</Button>}
    </div>
  )
});