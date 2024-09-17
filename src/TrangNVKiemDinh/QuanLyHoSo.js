import React, { useState, useEffect } from 'react';
import { Input, Select, Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import './QuanLyHoSo.css';

const { Option } = Select;

const KiemDuyetHSNhanNuoi = () => {
  const [data, setData] = useState([]); 
  const [searchText, setSearchText] = useState(''); 
  const [filterField, setFilterField] = useState('nguoiGuiHoSo'); 

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/adoption-profiles');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilterChange = (value) => {
    setFilterField(value);
  };
  const handleAdd = () => {
    navigate('/adoption-profile-management/addAdoptionProfile');
  };

  const handleDelete = async (idHoso) => {
    try {
      await axios.delete(`http://localhost:5000/xoahoso/${idHoso}`);
      setData(data.filter(item => item.idHoso !== idHoso));
      message.success('Profile deleted successfully.');
    } catch (error) {
      console.error('Error deleting profile:', error);
      message.error('Failed to delete profile.');
    }
  };

  const handleEdit = (idHoso) => {
    navigate(`/adoption-profile-management/details/${idHoso}`);
  };

  const handleReview = async (idHoso) => {
    try {
      await axios.put(`http://localhost:5000/adoption-profiles/${idHoso}/review`);
      setData(data.map(item => item.idHoso === idHoso ? { ...item, trangThai: '1' } : item));
      message.success('Profile reviewed successfully.');
    } catch (error) {
      console.error('Error reviewing profile:', error);
      message.error('Failed to review profile.');
    }
  };

  const columns = [
    {
      title: 'ID Hồ sơ',
      dataIndex: 'idHoso',
      key: 'idHoso',
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'ngayguihoso',
      key: 'ngayguihoso',
      render: text => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Yêu Cầu',
      dataIndex: 'yeuCau',
      key: 'yeuCau',
    },
    {
      title: 'GCN Kết Hôn',
      dataIndex: 'ChungNhanKetHon',
      key: 'ChungNhanKetHon',
      render: text => text ? <img src={`http://localhost:5000/${text}`} alt="Marriage Certificate" style={{ width: '100px' }} /> : 'Chưa cập nhật',
    },
    {
      title: 'Giấy khám sức khỏe',
      dataIndex: 'GiayKhamSucKhoe',
      key: 'GiayKhamSucKhoe',
      render: text => text ? <img src={`http://localhost:5000/${text}`} alt="Health Certificate" style={{ width: '100px' }} /> : 'Chưa cập nhật',
    },
    {
      title: 'Tình trạng chỗ ở',
      dataIndex: 'TinhTrangChoo',
      key: 'TinhTrangChoo',
      render: text => (text === 'Y' ? 'Có nhà ở' : 'Chung cư/trọ'),
    },
    {
      title: 'Mức thu nhập hàng tháng',
      dataIndex: 'MucThuNhapHangThang',
      key: 'MucThuNhapHangThang',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: text => {
        switch (text) {
          case '1':
            return 'Đã phê duyệt';
          case '2':
            return 'Chưa duyệt';
          case '3':
            return 'Đang duyệt';
          default:
            return 'Không xác định';
        }
      },
    },
    {
      title: 'Người gửi',
      dataIndex: 'CCCD',
      key: 'CCCD',
    },
    {
      title: 'Nhân viên kiểm duyệt',
      dataIndex: 'idnhanvien',
      key: 'idnhanvien',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} onClick={() => handleEdit(record.idHoso)}  />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa hồ sơ này không?"
            onConfirm={() => handleDelete(record.idHoso)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
      ),
    },
    {
      title: 'Phê duyệt',
      key: 'review',
      render: (text, record) => (        
        <Button icon={<CheckOutlined />} type="primary" onClick={() => handleReview(record.idHoso)} disabled={record.trangThai === 1}>
          Phê duyệt
        </Button>
      ),
    },
  ];
  
  const filteredData = data.filter((item) =>
    item[filterField]?.toString().toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="document-management-container">
      <Sidebar />
      <div className="document-management-content">
        <h2>Quản Lý Hồ Sơ</h2>
        <div className="search-bar">
          <Input.Search
            placeholder="Tìm kiếm"
            style={{ width: 200, marginRight: 10 }}
            onChange={handleSearch}
          />
          <Select style={{ width: 150 }}>
            <Option value="sender">Người gửi</Option>
            <Option value="id">ID Hồ Sơ</Option>
            <Option value="request">Yêu Cầu</Option>
            <Option value="marriageCertificate">GCN Kết Hôn</Option>
            <Option value="healthCertificate">Giấy khám sức khỏe</Option>
            <Option value="housingStatus">Tình trạng chỗ ở</Option>
            <Option value="monthlyIncome">Mức thu nhập hàng tháng</Option>
            <Option value="status">Trạng Thái</Option>
            <Option value="reviewer">Nhân viên kiểm duyệt</Option>
          </Select>
          <Button type="primary" onClick={handleAdd} style={{ marginLeft: 'auto' }}>
            Thêm Hồ Sơ
          </Button>
        </div>
        <Table columns={columns} dataSource={data} rowKey="idHoso" />
      </div>
    </div>
  );
};


export default KiemDuyetHSNhanNuoi;