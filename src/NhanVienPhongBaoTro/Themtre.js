import React, { useState } from 'react';
import { Form, Input, Button, Select, Radio, message } from 'antd';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './Themtre.css'; // Import your CSS file for styling
const { Option } = Select;

const NVPBTAddChild = () => {  
  const [form] = Form.useForm();
  const [hasNgaySinh, setHasNgaySinh] = useState(true);

  const handleAdd = async (values) => {
    const { ngaySinh, ngayNhanNuoi, ...rest } = values;

    // Convert ngayNhanNuoi to the correct format
    const formattedNgayNhanNuoi = `${ngayNhanNuoi.year}-${ngayNhanNuoi.month}-${ngayNhanNuoi.day}`;

    // Create payload
    const payload = {
      ...rest,
      ngayNhanNuoi: formattedNgayNhanNuoi,
      gioitinh: values.gioitinh === 'Nam' ? 'M' : 'F',
      trangthai: values.trangthai === 1 ? '0' : values.trangthai === 2 ? '1' : '2',
    };

    // Handle ngaySinh
    if (hasNgaySinh) {
      if (ngaySinh && ngaySinh.year && ngaySinh.month && ngaySinh.day) {
        const formattedNgaySinh = `${ngaySinh.year}-${ngaySinh.month}-${ngaySinh.day}`;
        payload.ngaySinh = formattedNgaySinh;
      } else {
        message.error('Vui lòng chọn đầy đủ ngày, tháng và năm sinh!');
        return;
      }
    } else {
      payload.ngaySinh = null;
    }

    try {
      const response = await axios.post('http://localhost:5000/add-child', payload);
      if (response.status === 200) {
        message.success('Thêm trẻ thành công!');
        form.resetFields();
      } else {
        message.error('Đã xảy ra lỗi khi thêm trẻ.');
      }
    } catch (error) {
      console.error('Error adding child:', error);
      message.error('Đã xảy ra lỗi khi thêm trẻ.');
    }
  };

  return (
    <div className="add-child-container">
      <Sidebar />
      <div className="add-child-content">
        <h2>Thêm Trẻ</h2>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Họ tên" name="hovaten" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Ngày sinh">
            <Radio.Group 
              onChange={(e) => setHasNgaySinh(e.target.value === 'co')}
              value={hasNgaySinh ? 'co' : 'khong'}
            >
              <Radio value="co">Có ngày sinh</Radio>
              <Radio value="khong">Không có ngày sinh</Radio>
            </Radio.Group>
          </Form.Item>
          {hasNgaySinh && (
            <Form.Item
              label="Ngày sinh"
              name="ngaySinh"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <div style={{ display: 'flex' }}>
                {/* Combobox cho ngày */}
                <Form.Item
                  name={['ngaySinh', 'day']}
                  noStyle
                  rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                  <Select style={{ width: 150, marginRight: 10 }}>
                    {[...Array(31)].map((_, index) => (
                      <Option key={index + 1} value={`${index + 1}`}>
                        {index + 1}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Combobox cho tháng */}
                <Form.Item
                  name={['ngaySinh', 'month']}
                  noStyle
                  rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
                >
                  <Select style={{ width: 200, marginRight: 10 }}>
                    {[...Array(12)].map((_, index) => (
                      <Option key={index + 1} value={`${index + 1}`}>
                        Tháng {index + 1}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Combobox cho năm */}
                <Form.Item
                  name={['ngaySinh', 'year']}
                  noStyle
                  rules={[{ required: true, message: 'Vui lòng chọn năm!' }]}
                >
                  <Select style={{ width: 230 }}>
                    {[...Array(100)].map((_, index) => (
                      <Option key={index + 1970} value={`${index + 1970}`}>
                        {index + 1970}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form.Item>
          )}

          <Form.Item
            label="Ngày nhận nuôi"
            name="ngayNhanNuoi"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: 'Vui lòng chọn ngày nhận nuôi!' }]}
          >
            <div style={{ display: 'flex' }}>
              {/* Combobox cho ngày */}
              <Form.Item
                name={['ngayNhanNuoi', 'day']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <Select style={{ width: 150, marginRight: 10 }}>
                  {[...Array(31)].map((_, index) => (
                    <Option key={index + 1} value={`${index + 1}`}>
                      {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Combobox cho tháng */}
              <Form.Item
                name={['ngayNhanNuoi', 'month']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
              >
                <Select style={{ width: 200, marginRight: 10 }}>
                  {[...Array(12)].map((_, index) => (
                    <Option key={index + 1} value={`${index + 1}`}>
                      Tháng {index + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Combobox cho năm */}
              <Form.Item
                name={['ngayNhanNuoi', 'year']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn năm!' }]}
              >
                <Select style={{ width: 230 }}>
                  {[...Array(100)].map((_, index) => (
                    <Option key={index + 1970} value={`${index + 1970}`}>
                      {index + 1970}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="Giới tính" name="gioitinh" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
            <Radio.Group>
              <Radio value="Nam">Nam</Radio>
              <Radio value="Nữ">Nữ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Trạng thái" name="trangthai" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Radio.Group>
              <Radio value={1}>Chưa được nhận nuôi</Radio>
              <Radio value={2}>Đang chờ nhận nuôi</Radio>
              <Radio value={3}>Đã được nhận nuôi</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ghi chú" name="ghichu">
            <Input.TextArea />
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

export default NVPBTAddChild;
