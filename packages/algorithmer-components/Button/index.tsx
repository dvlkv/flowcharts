import { memo } from "preact/compat";
import { cx } from "../../algorithmer-utils";

require('./index.less');

type ButtonProps = {
  onClick?: () => void,
  type?: string,
  className?: string,
  disabled?: boolean,
  children: any,
}

const Button = memo(({ onClick, type, disabled, children, className }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cx('button', type || 'blue', className)}
    >
      {children}
    </button>
  )
});

export default Button;