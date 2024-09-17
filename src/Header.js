import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Header = ({ user, handleLogout }) => {

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <header className="App-header">
      <div className="header-container">
        <a href='/'><img className="logo" src="./images/image1.png" alt="Logo" /></a>
        <span className="header-text">TRUNG TÂM BẢO TRỢ XÃ HỘI <br /> TRẠI TRẺ MỒ CÔI </span>
      </div>
      <div className="nav-links">
        <Link to="/">TRANG CHỦ</Link>
        <a href="/chinhsach">CHÍNH SÁCH</a>
        <a href="/lienhe">LIÊN HỆ</a>
        {user ? (
          <div className='user-info'>
            <img src="./images/icon.png" alt="User Icon" className="user-icon" /> 
            {user.role === 'admin' ? (           
              <>
              <a href='/children-management'>{user.hoVaten}</a>
                <div class="dropdown-options">
                  <a href="/children-management">Trang quản lý</a>
                  <a href="#">Cài đặt</a>
                  <a href="/" onClick={handleLogoutClick}>Đăng xuất</a>
                </div>
              </>
            ) : user.role === 'Nhân viên phòng bảo trợ' ? (
              <>
                <a href='/vnpbt-children-management'>{user.hoVaten}</a>
                <div class="dropdown-options">
                  <a href="/vnpbt-children-management">Quản lý trẻ em</a>
                  <a href="#">Cài đặt</a>
                  <a href="/" onClick={handleLogoutClick}>Đăng xuất</a>
                </div>
              </>              
            ) : user.role === 'Nhân viên kiểm định' ? (
              <>
                <a href='/quanlyhoso'>{user.hoVaten}</a>
                <div class="dropdown-options">
                  <a href="/quanlyhoso">Quản lý hồ sơ</a>
                  <a href="#">Cài đặt</a>
                  <a href="/" onClick={handleLogoutClick}>Đăng xuất</a>
                </div>
              </>   
            ) :(
              // <a href="/profile" className="username">{user.hovaten}</a>
              <>
              <a href='/profile'>{user.hovaten}</a>
              <div class="dropdown-options">
                <a href="/profile">Cập nhật thông tin</a>
                <a href="/hsnhannuoi">Hồ sơ của tôi</a>
                <a href="#">Cài đặt</a>
                <a href="/" onClick={handleLogoutClick}>Đăng xuất</a>
              </div>
            </>
            )}
          </div>
        ) : (
          <>
            <a href="/login">ĐĂNG NHẬP</a>
            <a href="/register">ĐĂNG KÝ</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
