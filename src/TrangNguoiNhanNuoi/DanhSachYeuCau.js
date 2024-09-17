import React, { useState, useEffect } from 'react';
import { Input, Select, Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import './DanhSachYeuCau.css';

const { Option } = Select;

const DocumentManagement = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const storedData = sessionStorage.getItem('data');
  const user = storedData ? JSON.parse(storedData) : null;
  const cccd = user ? user.CCCD : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!cccd) {
        message.error('CCCD not found.');
        return;
      }
      try {
        console.log(`Fetching profiles for CCCD: ${cccd}`);
        const response = await axios.get(`http://localhost:5000/get-adoption-profiles/${cccd}`);
        console.log('Profiles fetched:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to fetch data.');
      }
    };

    fetchData();
  }, [cccd]);

  const handleAdd = () => {
    navigate('/hsnhannuoi/themhoso');
  };

  const handleEdit = (idHoso) => {
    navigate(`/hsnhannuoi/chitiethoso/${idHoso}`);
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
            return 'Duyệt';
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
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} onClick={() => handleEdit(record.idHoso)} />
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
  ];

  return (
    <div className="document-management-container">
      <Sidebar />
      <div className="document-management-content">
        <h2>Quản Lý Hồ Sơ</h2>
        <div className="search-bar">
          <Input.Search
            placeholder="Tìm kiếm"
            style={{ width: 200, marginRight: 10 }}
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

export default DocumentManagement;
