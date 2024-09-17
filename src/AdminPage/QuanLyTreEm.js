import React, { useState, useEffect } from 'react';
import { Input, Select, Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import './QuanLyTreEm.css';

const { Option } = Select;

const ChildManagement = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterField, setFilterField] = useState('hovaten');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/children');
        console.log('Raw Data:', response.data); // Log raw data for inspection

        const formattedData = response.data.map(child => {
          const ngaySinh = new Date(child.ngaysinh);
          const ngayNhanNuoi = new Date(child.ngayNhanNuoi);

        // Check for Unix epoch date and set it to "Không có ngày sinh"
          const formattedNgaySinh = ngaySinh.getTime() === new Date('1970-01-01T00:00:00Z').getTime()
            ? 'Không có ngày sinh'
            : ngaySinh.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });

          const formattedNgayNhanNuoi = !isNaN(ngayNhanNuoi) ? ngayNhanNuoi.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'Invalid Date';
          return {
            ...child,
            gioitinh: child.gioitinh === 'M' ? 'Nam' : 'Nữ',
            ngaysinh: formattedNgaySinh,
            ngayNhanNuoi: formattedNgayNhanNuoi
          };
        });
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
    navigate('/children-management/addChild');
  };

  const handleFilterChange = (value) => {
    setFilterField(value);
  };

  const handleEdit = (id) => {
    navigate(`/children-management/child-detail/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/children/${id}`);
      setData(prevData => prevData.filter(item => item.idTre !== id));
      message.success('Child deleted successfully');
    } catch (error) {
      console.error('Failed to delete child:', error);
      message.error('Failed to delete child');
    }
  };

  const columns = [
    {
      title: 'ID Trẻ',
      dataIndex: 'idTre',
      key: 'idTre',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'hovaten',
      key: 'hovaten',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaysinh',
      key: 'ngaysinh',
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gioitinh',
      key: 'gioitinh',
    },
    {
      title: 'Ngày Nhận Nuôi',
      dataIndex: 'ngayNhanNuoi',
      key: 'ngayNhanNuoi',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangthai',
      key: 'trangthai',
    },
    {
      title: 'Ghi Chú',
      dataIndex: 'ghichu',
      key: 'ghichu',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => handleEdit(record.idTre)} style={{ marginRight: 8 }} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trẻ này không?"
            onConfirm={() => handleDelete(record.idTre)}
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
    <div className="child-management-container">
      <Sidebar />
      <div className="child-management-content">
        <h2>Quản Lý Trẻ</h2>
        <div className="search-bar">
          <Input.Search
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200, marginRight: 10 }}
          />
          <Select value={filterField} onChange={handleFilterChange} style={{ width: 150 }}>
            <Option value="hovaten">Họ và Tên</Option>
            <Option value="idTre">ID Trẻ</Option>
            <Option value="ngaysinh">Ngày Sinh</Option>
            <Option value="gioitinh">Giới Tính</Option>
            <Option value="ngayNhanNuoi">Ngày Nhận Nuôi</Option>
            <Option value="trangthai">Trạng Thái</Option>
          </Select>
          <Button type="primary" onClick={handleAdd} style={{ marginLeft: 'auto' }}>
            Thêm Trẻ
          </Button>
        </div>
        <Table columns={columns} dataSource={filteredData} rowKey="idTre" />
      </div>
    </div>
  );
};

export default ChildManagement;
