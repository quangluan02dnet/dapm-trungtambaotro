import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import axios from 'axios';
import Sidebar from './Sidebar'; 
import './ProfilePage.css'; 

const ProfilePage = ({ user }) => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [initialSDT, setInitialSDT] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/profile', { SDT: user.SDT });
        form.setFieldsValue(response.data.user);
        setInitialSDT(response.data.user.SDT);
        setUserData(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [form, user.SDT]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    form.setFieldsValue(userData);
  };

  const handleSave = async (values) => {
    try {
      await axios.post('http://localhost:5000/update-profile', { ...values, initialSDT });
      message.success('Thông tin đã được cập nhật thành công');
      setEditMode(false);
      setInitialSDT(values.SDT);
      setUserData(values);
    } catch (error) {
      console.error('Failed to update user data:', error);
      message.error('Cập nhật thông tin thất bại');
    }
  };

  return (
    <div className="profile-page-container">
      <Sidebar />
      <div className="profile-page-content">
        <h2>Hồ sơ của tôi</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item label="Tên người nhận nuôi" name="hovaten" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="diachi" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item label="Giới tính" name="gioitinh" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
            <Radio.Group disabled={!editMode}>
              <Radio value="m">Nam</Radio>
              <Radio value="f">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Ngày tháng năm sinh" name="ngaySinh" rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}>
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="SDT" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input disabled={!editMode} />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
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

export default ProfilePage;
