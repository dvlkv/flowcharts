import { memo } from "preact/compat";
import Logo from '../static/logo.svg';
require('./sidebar.less');


const Sidebar = memo(() => {
  return (
    <div className={'sidebar'}>
      <div className={'sidebar-inner'}>
        <div className={'logo-container'}>
          <img src={Logo} />
        </div>
      </div>
    </div>
  );
});

export default Sidebar;