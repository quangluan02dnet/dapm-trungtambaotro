import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ handleLogout }) => {
  
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link>Quản lí hồ sơ </Link></li>
          <li><Link>Thông báo</Link></li>
          <li><Link>Cài đặt</Link></li>
          {/* <li className="logout"><Link to="/" onClick={handleLogout}><img src="/images/logout.png" alt="Logout" />ĐĂNG XUẤT</Link></li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
