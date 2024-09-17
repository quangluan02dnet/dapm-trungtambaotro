import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link to="/profile">Hồ sơ của tôi</Link></li>
          <li><Link to="/hsnhannuoi">Hồ sơ nhận nuôi</Link></li>
          <li><Link to="#">Thông báo</Link></li>
          <li><Link to="#">Cài đặt</Link></li>
          {/* <li className="logout"><Link to="/" onClick={handleLogout}><img src="/images/logout.png" alt="Logout" />ĐĂNG XUẤT</Link></li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
