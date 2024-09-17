import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const handleLogout = () => {
  sessionStorage.removeItem('data')
};

const sidebar = () => {  
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li ><Link to="/children-management">Quản lý trẻ em</Link></li>
          <li ><Link to="/employee-management">Quản lý nhân viên</Link></li>
          <li ><Link to="/adoption-profile-management">Quản lý hồ sơ</Link></li>
          <li><Link>Thông báo</Link></li>
          <li><Link>Cài đặt</Link></li>
          {/* <li className="logout"><Link to="/" onClick={handleLogout}><img src="/images/logout.png" alt="Logout"/>ĐĂNG XUẤT</Link></li> */}
        </ul>
      </nav>
    </div>
  );
};

export default sidebar;
