import React from 'react';
import { Form, Input, Button, Radio, Select, message } from 'antd';
import axios from 'axios';
import Sidebar from '../Sidebar'; 
import './Themnhanvien.css'; 

const { Option } = Select;

const AddEmployee = () => {
  const [form] = Form.useForm();

  const handleAdd = async (values) => {
    try {
      await axios.post('http://localhost:5000/add-employee', values);
      message.success('Employee added successfully');
      form.resetFields();
    } catch (error) {
      console.error('Failed to add employee:', error);
      message.error('Failed to add employee');
    }
  };

  return (
    <div className="add-employee-container">
      <Sidebar />
      <div className="add-employee-content">
        <h2>Thêm Nhân Viên</h2>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Họ và Tên" name="hovaten" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="ngaySinh"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <div style={{ display: 'flex' }}>
              <Form.Item
                name={['ngaySinh', 'day']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <Select style={{ width: 100, marginRight: 10 }}>
                  {[...Array(31)].map((_, index) => (
                    <Option key={index + 1} value={`${index + 1}`}>
                      {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name={['ngaySinh', 'month']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
              >
                <Select style={{ width: 100, marginRight: 10 }}>
                  {[...Array(12)].map((_, index) => (
                    <Option key={index + 1} value={`${index + 1}`}>
                      Tháng {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name={['ngaySinh', 'year']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn năm!' }]}
              >
                <Select style={{ width: 120 }}>
                  {[...Array(100)].map((_, index) => (
                    <Option key={index + 1970} value={`${index + 1970}`}>
                      {index + 1970}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="Vai trò" name="vaitro" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
            <Radio.Group>
              <Radio value="1">Nhân viên quản lý</Radio>
              <Radio value="2">Nhân viên phòng bảo trợ trẻ em</Radio>
              <Radio value="3">Nhân viên kiểm định</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Địa chỉ" name="diachi" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="sdt" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Giới tính" name="gioitinh" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
            <Radio.Group>
              <Radio value="m">Nam</Radio>
              <Radio value="f">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Mật khẩu" name="matkhau" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password />
          </Form.Item>
          <div className="form-buttons">
            <Button type="default" onClick={() => form.resetFields()}>Quay lại</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>Thêm</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddEmployee;
