import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ setUser }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/login', values);
      message.success(response.data.message);
      sessionStorage.setItem('data', JSON.stringify(response.data.user));
      setUser(response.data.user);  
      setLoggedIn(true);
    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data.message);
        message.error('Login failed. Please check your phone number and password.');
      } else if (error.request) {
        console.error('Request failed:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ maxWidth: '300px', margin: 'auto' }}>
      <h2>Đăng nhập</h2>
      <Form
        name="login"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ remember: true }}
        layout="horizontal"
      >
        <Form.Item
          label="Số điện thoại"
          name="SDT"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Input style={{ width: '100%', maxWidth: '250px' }} />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Input.Password style={{ width: '100%', maxWidth: '250px', marginLeft: 'auto' }} />
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <Link to="/dang-ky">Quên mật khẩu</Link>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#111467', marginTop: '20px' }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
