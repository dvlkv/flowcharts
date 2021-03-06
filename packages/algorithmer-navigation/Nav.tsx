import { memo } from "preact/compat";
import Match, { Link } from "preact-router/match";
import { cx } from "../algorithmer-utils";

require('./index.less');

type NavbarItemProps = {
  link: string,
  text: any
}

type NavbarProps = {
  routes: NavbarItemProps[]
}

const NavbarItem = memo((props: NavbarItemProps) => {
  return (
    <Match path={props.link}>
      {({ matches }: any) => (
        <Link className={cx(`navbar-item`, matches ? ' active' : null)} href={props.link}>
          {props.text}
        </Link>
      )}
    </Match>
  );
});

const Nav = memo(({ routes }: NavbarProps) => {
  return (
    <div className={'navbar-outer'}>
      <div className={'navbar-inner'}>
      {routes.map(a => <NavbarItem {...a} />)}
      </div>
    </div>
  )
});

export default Nav;
