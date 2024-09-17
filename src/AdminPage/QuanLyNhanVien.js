import React, { useState, useEffect } from 'react';
import { Input, Select, Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar'; 
import './QuanLyNhanVien.css'; 

const { Option } = Select;

const EmployeeManagement = () => {
  const [data, setData] = useState([]); 
  const [searchText, setSearchText] = useState(''); 
  const [filterField, setFilterField] = useState('hoVaten'); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/employees');
        const formattedData = response.data.map(employee => ({
          ...employee,
          gioiTinh: employee.gioiTinh === 'M' ? 'Nam' : 'Nữ',
          ngaySinh: new Date(employee.ngaySinh).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAdd = () => {
    navigate('/employee-management/addEmployee');
  };

  const handleFilterChange = (value) => {
    setFilterField(value);
  };

  const handleEdit = (id) => {
    navigate(`/employee-management/employee-detail/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      setData(prevData => prevData.filter(item => item.idNhanvien !== id));
      message.success('Employee deleted successfully');
    } catch (error) {
      console.error('Failed to delete employee:', error);
      message.error('Failed to delete employee');
    }
  };

  const columns = [
    {
      title: 'ID Nhân Viên',
      dataIndex: 'idNhanvien',
      key: 'idNhanvien',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'hoVaten',
      key: 'hoVaten',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'SDT',
      key: 'SDT',
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
    },
    {
      title: 'Mật Khẩu',
      dataIndex: 'matkhau',
      key: 'matkhau',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => handleEdit(record.idNhanvien)} style={{ marginRight: 8 }} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này không?"
            onConfirm={() => handleDelete(record.idNhanvien)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredData = data.filter((item) =>
    item[filterField]?.toString().toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="employee-management-container">
      <Sidebar />
      <div className="employee-management-content">
        <h2>Quản Lý Nhân Viên</h2>
        <div className="search-bar">
          <Input.Search
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200, marginRight: 10 }}
          />
          <Select value={filterField} onChange={handleFilterChange} style={{ width: 150 }}>
            <Option value="hoVaten">Họ và Tên</Option>
            <Option value="idNhanvien">ID Nhân Viên</Option>
            <Option value="diaChi">Địa Chỉ</Option>
            <Option value="Email">Email</Option>
            <Option value="SDT">Số Điện Thoại</Option>
            <Option value="gioiTinh">Giới Tính</Option>
          </Select>
          <Button type="primary" onClick={handleAdd} style={{ marginLeft: 'auto' }}>
            Thêm Nhân Viên
          </Button>
        </div>
        <Table columns={columns} dataSource={filteredData} rowKey="idNhanvien" />
      </div>
    </div>
  );
};

export default EmployeeManagement;
