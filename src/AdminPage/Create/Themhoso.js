import React from 'react';
import { Form, Input, Button, Radio, Upload, Row, Col, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Sidebar from '../../AdminPage/Sidebar'; 
import './Themhoso.css'; 

const { Option } = Select;
const AddAdoptionProfile = () => {
  const [form] = Form.useForm();

  const handleAdd = (values) => {
    console.log('Form Values:', values);
    
  };

  return (
    <div className="add-adoption-profile-container">
      <Sidebar />
      <div className="add-adoption-profile-content">
        <h2>Thêm Hồ Sơ Nhận Nuôi</h2>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item label="Người gửi hồ sơ" name="nguoigui" rules={[{ required: true, message: 'Vui lòng nhập ID hồ sơ' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày gửi"
            name="ngaygui"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            rules={[{ required: true, message: 'Vui lòng chọn ngày gửi' }]}
          >
            <div style={{ display: 'flex' }}>
              {/* Combobox cho ngày */}
              <Form.Item
                name={['ngayNhanNuoi', 'day']}
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <Select defaultValue="1" style={{ width: 150, marginRight: 10 }}>
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
                <Select defaultValue="1" style={{ width: 200, marginRight: 10 }}>
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
                <Select defaultValue="2022" style={{ width: 230 }}>
                  {[...Array(100)].map((_, index) => (
                    <Option key={index + 1970} value={`${index + 1970}`}>
                      {index + 1970}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="Yêu cầu" name="yeucau" rules={[{ required: true, message: 'Vui lòng nhập yêu cầu' }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Chứng Nhận Kết Hôn" name="chungNhanKetHon" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
                <Upload name="chungNhanKetHon" listType="picture" beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giấy Khám Sức Khỏe" name="giayKhamSucKhoe" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
                <Upload name="giayKhamSucKhoe" listType="picture" beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Tình trạng chỗ ở" name="tinhtrangchoo" rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}>
            <Radio.Group>
              <Radio value="Conha">Có nhà ở</Radio>
              <Radio value="Chuaconha">Chung cư/trọ</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Mức thu nhập hằng tháng" name="mucthunhap" rules={[{ required: true, message: 'Vui lòng nhập mức thu nhập' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Nghề nghiệp" name="nghenghiep" rules={[{ required: true, message: 'Vui lòng nhập nghề nghiệp' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Trạng thái" name="trangthai" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Radio.Group>
              <Radio value="daduyet">Đã duyệt</Radio>
              <Radio value="chuaduyet">Chưa duyệt</Radio>
              <Radio value="dangduyet">Đang duyệt</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Nhân viên kiểm định" name="nhanvienkiemdinh" rules={[{ required: true, message: 'Vui lòng nhập nhân viên kiểm định' }]}>
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

export default AddAdoptionProfile;
