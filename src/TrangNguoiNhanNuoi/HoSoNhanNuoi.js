import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Sidebar from './Sidebar';
import './ProfilePage.css';

const { Option } = Select;
const { TextArea } = Input;

const AdoptionProfilePage = ({ user }) => {
  const [form] = Form.useForm();
  const [fileListChungNhanKetHon, setFileListChungNhanKetHon] = useState([]);
  const [fileListGiayKhamSucKhoe, setFileListGiayKhamSucKhoe] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/profile', { SDT: user.SDT });
        if (response.data.user) {
          const userData = response.data.user;
          form.setFieldsValue({
            tenNguoiNhanNuoi: userData.hovaten,
            gioiTinhNguoiNhanNuoi: userData.gioitinh === 'm' ? 'm' : 'f',
            ngaySinh: {
              day: new Date(userData.ngaySinh).getDate(),
              month: new Date(userData.ngaySinh).getMonth() + 1,
              year: new Date(userData.ngaySinh).getFullYear(),
            },
            cccd: userData.CCCD,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        message.error('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [form]);

  const handleCancel = () => {
    form.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
  
    formData.append('yeuCau', values.yeuCau);
    formData.append('TinhTrangChoo', values.tinhTrangChoO);
    formData.append('MucThuNhapHangThang', values.mucThuNhapHangThang);
    formData.append('NgheNghiep', values.ngheNghiep);
    formData.append('trangThai', values.trangThai);
    formData.append('CCCD', values.cccd);
  
    if (fileListChungNhanKetHon.length > 0) {
      formData.append('chungNhanKetHon', fileListChungNhanKetHon[0]);
    }
  
    if (fileListGiayKhamSucKhoe.length > 0) {
      formData.append('giayKhamSucKhoe', fileListGiayKhamSucKhoe[0]);
    }
  
    try {
      await axios.post('http://localhost:5000/submit-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success('Profile submitted successfully');
      form.resetFields();
    } catch (error) {
      console.error('Failed to submit profile:', error);
      message.error('Failed to submit profile');
    }
  };

  return (
    <div className="profile-page-container">
      <Sidebar />
      <div className="profile-page-content">
        <h2>Gửi hồ sơ nhận nuôi</h2>
        <Form form={form} layout="vertical" initialValues={{ trangThai: '2' }} onFinish={handleSubmit}>
          <Form.Item label="Tên người nhận nuôi" name="tenNguoiNhanNuoi">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Giới tính" name="gioiTinhNguoiNhanNuoi">
            <Radio.Group disabled>
              <Radio value="m">Nam</Radio>
              <Radio value="f">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="ngaySinh"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <div style={{ display: 'flex' }}>
              <Form.Item
                name={['ngaySinh', 'day']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <Select defaultValue="1" style={{ width: 150, marginRight: 10 }} disabled>
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
                <Select defaultValue="1" style={{ width: 200, marginRight: 10 }} disabled>
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
                <Select defaultValue="2022" style={{ width: 230 }} disabled>
                  {[...Array(100)].map((_, index) => (
                    <Option key={index + 1970} value={`${index + 1970}`}>
                      {index + 1970}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item label="CCCD" name="cccd">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Yêu cầu" name="yeuCau">
            <TextArea />
          </Form.Item>

          <Form.Item label="Mức thu nhập hàng tháng" name="mucThuNhapHangThang">
            <Input />
          </Form.Item>

          <Form.Item label="Chứng nhận kết hôn" name="chungNhanKetHon">
            <Upload
              fileList={fileListChungNhanKetHon}
              beforeUpload={file => {
                setFileListChungNhanKetHon([file]);
                return false;
              }}
              onRemove={() => setFileListChungNhanKetHon([])}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Giấy khám sức khỏe" name="giayKhamSucKhoe">
            <Upload
              fileList={fileListGiayKhamSucKhoe}
              beforeUpload={file => {
                setFileListGiayKhamSucKhoe([file]);
                return false;
              }}
              onRemove={() => setFileListGiayKhamSucKhoe([])}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Tình trạng chỗ ở" name="tinhTrangChoO">
            <Radio.Group>
              <Radio value="Y">Có nhà ở</Radio>
              <Radio value="N">Chung cư/trọ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Nghề nghiệp" name="ngheNghiep">
            <Input />
          </Form.Item>

          <Form.Item label="Trạng thái" name="trangThai">
            <Radio.Group disabled>
              <Radio value="1">Duyệt</Radio>
              <Radio value="2">Chưa duyệt</Radio>
              <Radio value="3">Đang duyệt</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Nhân viên kiểm duyệt" name="nhanVienKiemDuyet">
            <Input disabled />
          </Form.Item>

          <div className="profile-requirements">
            <h3>Hồ sơ cá nhân: <span style={{ color: 'red' }}>Bao gồm</span></h3>
            <ol>
              <li>Đơn xin nhận con nuôi</li>
              <li>Bản sao hộ chiếu, giấy cmnd/cccd hoặc giấy tờ có giá trị thay thế</li>
              <li>Phiếu lý lịch tư pháp</li>
              <li>Văn bản xác nhận tình trạng hôn nhân</li>
              <li>
                Giấy khám sức khỏe do cơ quan y tế huyện trở lên cấp, văn bản xác nhận hoàn cảnh gia đình,
                điều kiện kinh tế do ủy ban nhân dân cấp xã nơi người nhận nuôi thường trú cấp
              </li>
            </ol>
          </div>
          <div className="profile-form-buttons">
            <Button type="primary" htmlType="submit">
              Gửi
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AdoptionProfilePage;
