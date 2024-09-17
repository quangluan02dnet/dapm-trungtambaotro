import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Chitiethoso.css';

const { Option } = Select;
const { TextArea } = Input;

const CTHS_NVKD = () => {
  const [form] = Form.useForm();
  const { idHoso } = useParams();
  const [chungNhanKetHonFileList, setChungNhanKetHonFileList] = useState([]);
  const [giayKhamSucKhoeFileList, setGiayKhamSucKhoeFileList] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = JSON.parse(sessionStorage.getItem('data'));
    setUser(storedUser);

    const fetchUserData = async () => {
      try {
        const hs = await axios.get(`http://localhost:5000/adoption-profiles/${idHoso}`);

        if (hs.data) {
          const hsData = hs.data;
          console.log('Trang Thai:', hsData.TrangThai);
          form.setFieldsValue({
            cccd: hsData.CCCD,
            yeuCau: hsData.yeuCau,
            mucThuNhapHangThang: hsData.MucThuNhapHangThang,
            tinhTrangChoO: hsData.TinhTrangChoo,
            ngheNghiep: hsData.NgheNghiep,
            trangThai: hsData.trangThai,
            nhanVienKiemDuyet: storedUser && storedUser.role === 'Nhân viên kiểm định' ? storedUser.hovaten : '',
          });

          if (hsData.ChungNhanKetHon) {
            setChungNhanKetHonFileList([{
              uid: '-1',
              name: 'Chứng nhận kết hôn',
              status: 'done',
              url: `http://localhost:5000/${hsData.ChungNhanKetHon}`,
            }]);
          }

          if (hsData.GiayKhamSucKhoe) {
            setGiayKhamSucKhoeFileList([{
              uid: '-1',
              name: 'Giấy khám sức khỏe',
              status: 'done',
              url: `http://localhost:5000/${hsData.GiayKhamSucKhoe}`,
            }]);
          }

          const userInfo = await axios.get(`http://localhost:5000/user-info/${hsData.CCCD}`);
          if (userInfo.data) {
            const userData = userInfo.data;
            form.setFieldsValue({
              tenNguoiNhanNuoi: userData.hovaten,
              gioiTinhNguoiNhanNuoi: userData.gioitinh,
              ngaySinh: {
                day: new Date(userData.ngaySinh).getDate(),
                month: new Date(userData.ngaySinh).getMonth() + 1,
                year: new Date(userData.ngaySinh).getFullYear(),
              },
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        message.error('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [form, idHoso]);

  const handleCancel = () => {
    form.resetFields();
    setChungNhanKetHonFileList([]);
    setGiayKhamSucKhoeFileList([]);
  };

  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append('yeuCau', values.yeuCau);
    formData.append('mucThuNhapHangThang', values.mucThuNhapHangThang);
    formData.append('tinhTrangChoO', values.tinhTrangChoO);
    formData.append('ngheNghiep', values.ngheNghiep);
    formData.append('trangThai', values.trangThai);
    formData.append('nhanVienKiemDuyet', values.nhanVienKiemDuyet);

    if (chungNhanKetHonFileList.length > 0 && chungNhanKetHonFileList[0].originFileObj) {
      formData.append('chungNhanKetHon', chungNhanKetHonFileList[0].originFileObj);
    }

    if (giayKhamSucKhoeFileList.length > 0 && giayKhamSucKhoeFileList[0].originFileObj) {
      formData.append('giayKhamSucKhoe', giayKhamSucKhoeFileList[0].originFileObj);
    }

    try {
      await axios.post(`http://localhost:5000/update-profile/${idHoso}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Failed to update profile');
    }
  };

  return (
    <div className="profile-page-container">
      <Sidebar />
      <div className="profile-page-content">
        <h2>Gửi hồ sơ nhận nuôi</h2>
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ trangThai: '2' }}>
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
                <Select style={{ width: 150, marginRight: 10 }} disabled>
                  {[...Array(31)].map((_, index) => (
                    <Option key={index + 1} value={index + 1}>
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
                <Select style={{ width: 200, marginRight: 10 }} disabled>
                  {[...Array(12)].map((_, index) => (
                    <Option key={index + 1} value={index + 1}>
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
                <Select style={{ width: 230 }} disabled>
                  {[...Array(100)].map((_, index) => (
                    <Option key={index + 1970} value={index + 1970}>
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
              fileList={chungNhanKetHonFileList}
              listType="picture"
              beforeUpload={() => false}
              onChange={({ fileList }) => setChungNhanKetHonFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Giấy khám sức khỏe" name="giayKhamSucKhoe">
            <Upload
              fileList={giayKhamSucKhoeFileList}
              listType="picture"
              beforeUpload={() => false}
              onChange={({ fileList }) => setGiayKhamSucKhoeFileList(fileList)}
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
            <Radio.Group >
              <Radio value="1">Duyệt</Radio>
              <Radio value="2">Chưa duyệt</Radio>
              <Radio value="3">Đang duyệt</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Nhân viên kiểm định" name="nhanVienKiemDuyet">
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button style={{ marginLeft: '10px' }} onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CTHS_NVKD;
