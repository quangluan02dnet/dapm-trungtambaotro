    import React from 'react';
    import { Form, Input, Button, Select, Radio } from 'antd';
    import { Link } from 'react-router-dom';
    import axios from 'axios';
    import '../register/register.css';

    const { Option } = Select;

    const RegisterPage = () => {
        const onFinish = async (values) => {
            const { fullName, dob, gender, cccd, phone, address, email, password } = values;
            const formattedDob = `${dob.year}-${dob.month.padStart(2, '0')}-${dob.day.padStart(2, '0')}`;
            const userData = {
                fullName,
                address,
                gender,
                phone,
                email,
                password,
                dob: formattedDob,
                cccd
            };

            console.log('Formatted values:', userData);

            try {
                const response = await axios.post('http://localhost:5000/register', userData);
                console.log('Registration successful:', response.data);
            } catch (error) {
                console.error('Registration failed:', error);
            }
        };

        const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
        };

        return (
            <div style={{ maxWidth: '1000px', margin: 'auto' }}>
                <h2>Đăng ký tài khoản</h2>
                <Form
                    name="register"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{ remember: true }}
                    layout="horizontal"
                >
                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Input style={{ width: '100%', maxWidth: '600px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Ngày sinh"
                        name="dob"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                    >
                        <div style={{ display: 'flex' }}>
                            <Form.Item
                                name={['dob', 'day']}
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

                            <Form.Item
                                name={['dob', 'month']}
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

                            <Form.Item
                                name={['dob', 'year']}
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

                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                        <Radio.Group className="custom-radio">
                            <Radio value="male">Nam</Radio>
                            <Radio value="female">Nữ</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="CCCD"
                        name="cccd"
                        rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Input style={{ width: '100%', maxWidth: '600px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Input style={{ width: '100%', maxWidth: '600px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Input style={{ width: '100%', maxWidth: '600px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Input style={{ width: '100%', maxWidth: '600px' }} />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Input.Password style={{ width: '100%', maxWidth: '600px', marginLeft: 'auto' }} />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Input.Password style={{ width: '100%', maxWidth: '600px', marginLeft: 'auto' }} />
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/dang-nhap">Đã có tài khoản? Đăng nhập ngay!</Link>
                    </div>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" style={{ alignItems: 'center', width: '30%', backgroundColor: '#111467', marginTop: '20px' }}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    };

    export default RegisterPage;
