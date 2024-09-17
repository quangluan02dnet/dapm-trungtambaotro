import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Radio, message } from 'antd';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Trangchitiet.css';

const NVPBTChildDetail = () => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/children/${id}`);
        setProfile(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error('Failed to fetch child data:', error);
        message.error('Failed to fetch child data');
      }
    };
    fetchChild();
  }, [id, form]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    form.resetFields();
    form.setFieldsValue(profile);
  };

  const handleSave = async (values) => {
    try {
      await axios.put(`http://localhost:5000/children/${id}`, values);
      setProfile(values);
      setEditMode(false);
      message.success('Child updated successfully');
    } catch (error) {
      console.error('Failed to save profile data:', error);
      message.error('Failed to save child data');
    }
  };

  return (
    <div className="profile-page-container">
      <Sidebar />
      <div className="profile-page-content">
        <h2>Chi Tiết Trẻ</h2>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Họ và Tên" name="hovaten" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="ngaySinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Giới tính" name="gioitinh" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
            <Radio.Group disabled={!editMode}>
              <Radio value="M">Nam</Radio>
              <Radio value="F">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Ngày nhận nuôi"
            name="ngayNhanNuoi"
            rules={[{ required: true, message: 'Vui lòng chọn ngày nhận nuôi!' }]}
          >
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="trangthai" rules={[{ required: true, message: 'Vui lòng nhập trạng thái' }]}>
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Ghi chú" name="ghichu">
            <Input disabled={!editMode} />
          </Form.Item>
          {editMode ? (
            <div className="form-buttons">
              <Button type="primary" htmlType="submit">Lưu</Button>
              <Button type="default" onClick={handleCancel} style={{ marginLeft: '10px' }}>Hủy</Button>
            </div>
          ) : (
            <Button type="primary" onClick={handleEdit}>Chỉnh sửa</Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default NVPBTChildDetail;
