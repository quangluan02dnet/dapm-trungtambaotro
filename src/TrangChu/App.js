import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from '../Header';
import Content from '../Content';
import Footer from '../Footer';
import LoginPage from '../login/LoginPage';
import RegisterForm from '../register/RegisterPage';
import ProfilePage from '../TrangNguoiNhanNuoi/TrangNguoiNhanNuoi';
import AdoptionProfilePage from '../TrangNguoiNhanNuoi/HoSoNhanNuoi';
import ChildrenManagement from '../AdminPage/QuanLyTreEm'; 
import EmployeeManagement from '../AdminPage/QuanLyNhanVien';
import AdoptionProfileManagement from '../AdminPage/QuanLyHoSo';
import AddChild from '../AdminPage/Create/Themtre';
import AddEmployee from '../AdminPage/Create/Themnhanvien';
import AddAdoptionProfile from '../AdminPage/Create/Themhoso';
import DetailAdoptionProfile from '../AdminPage/Update_Detail/Chitiethoso';
import EmployeeDetail from '../AdminPage/Update_Detail/ChiTietNhanVien';
import ChildDetail from '../AdminPage/Update_Detail/ChiTietTre';
import DocumentManagement from '../TrangNguoiNhanNuoi/DanhSachYeuCau';
import KiemDuyetHSNhanNuoi from '../TrangNVKiemDinh/QuanLyHoSo';
import ChiTietHoSo from '../TrangNguoiNhanNuoi/ChiTietHoSo';
import CTHS_NVKD from '../TrangNVKiemDinh/ChiTietHoSo';
import NVBTChildrenManagement from '../NhanVienPhongBaoTro/QuanLyTreEm'
import NVPBTAddChild from '../NhanVienPhongBaoTro/Themtre'
import NVPBTChildDetail from '../NhanVienPhongBaoTro/ChiTietTre'
import NVKDAddAdoptionProfile from '../TrangNVKiemDinh/Themhoso'
import ChinhSach from '../chinhsach';
import LienHe from '../lienhe';

function App() {
  const [user, setUser] = useState(null);
  const user1 = JSON.parse(sessionStorage.getItem('data'))

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('data')
  };

  return (
    <Router>
      <div className="App">
        <Header user={user1} handleLogout={handleLogout} />
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/profile" element={<ProfilePage user={user1} />} />
            <Route path="/hsnhannuoi" element={<DocumentManagement />} />
            <Route path="/hsnhannuoi/themhoso" element={<AdoptionProfilePage  user={user1} />} />
            <Route path="/hsnhannuoi/chitiethoso/:idHoso" element={<ChiTietHoSo  user={user1} />} />
            <Route path="/children-management" element={<ChildrenManagement />} /> 
            <Route path="/vnpbt-children-management" element={<NVBTChildrenManagement />} /> 
            <Route path="/vnpbt-children-management/addChild" element={<NVPBTAddChild />} />
            <Route path="/employee-management" element={<EmployeeManagement />} /> 
            <Route path="/adoption-profile-management" element={<AdoptionProfileManagement />} />
            <Route path="/children-management/addChild" element={<AddChild />} />
            <Route path="/employee-management/addEmployee" element={<AddEmployee />} />
            <Route path="/adoption-profile-management/addAdoptionProfile" element={<AddAdoptionProfile />} />
            <Route path="/adoption-profile-management/details/:idHoso" element={<DetailAdoptionProfile />} />
            <Route path="/nvpbt-children-management/child-detail/:id" element={<NVPBTChildDetail />} />
            <Route path="/employee-management/employee-detail/:id" element={<EmployeeDetail />} />
            <Route path="/children-management/child-detail/:id" element={<ChildDetail />} />
            <Route path="/quanlyhoso" element={<KiemDuyetHSNhanNuoi />} />
            <Route path="/quanlyhoso/chitiethoso/:idHoso" element={<CTHS_NVKD  user={user1} />} />
            <Route path="/quanlyhoso/themhoso" element={<NVKDAddAdoptionProfile />} />
            <Route path='/chinhsach' element={<ChinhSach/>} />
            <Route path='/lienhe' element={<LienHe/>} />
          </Routes>
        </div>
        <Footer className="App-footer" />
      </div>
    </Router>
  );
}

export default App;
