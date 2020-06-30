import { memo } from "preact/compat";
import Logo from "./Logo";
require('./sidebar.less');


const Sidebar = memo(() => {
  return (
    <div className={'sidebar'}>
      <div className={'sidebar-inner'}>
        <div className={'logo-container'}>
          <Logo />
        </div>
      </div>
    </div>
  );
});

export default Sidebar;