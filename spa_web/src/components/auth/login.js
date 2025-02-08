import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Checkbox, Form, Input, Col, Row, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "./login.css";

const Login = ({ onLogin }) => {
    const API_URL = "http://localhost:8000";
    const navigate = useNavigate();
    const { Text } = Typography;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errormsgs, setErrormgs] = useState(false);
    const [inCorrectError, setInCorrectError] = useState("");

    {/* Login Form Method Start */ }
    const onFinish = async (values) => {
        setErrormgs(false);
        console.log('Success:', values);
        if (values.password != '') {
            const requestData = {
                email: values.email,
                password: values.password,
            }
            try {
                await axios.post(`${API_URL}/login`, requestData).then((response) => {
                    if (response.data.status == 1) {
                        setErrormgs(false);
                        localStorage.setItem("userId", response.data.status);
                        navigate('/usersList');
                        return response.data;
                    } else {
                        setErrormgs(true);
                        setInCorrectError(response.data.message);
                        console.log(response.data, "users");
                    }
                }).catch((err) => {
                    console.log('Login Failed', err);
                });;
            } catch (error) {
                throw error.response ? error.response.data : error.message;
            }
        } else {
            console.log('please enter the password');
        }
    };
    {/* Login Form Method End */ }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div className="login_content_body">
                <div className="login_content_card">
                    <Form name="basic"
                        style={{
                            maxWidth: 400,
                            padding: 23
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            type: 'email',
                                            required: true,
                                            message: 'Please enter your email!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Email" value={email}
                                        onChange={(e) => setEmail(e.target.value)} prefix={<UserOutlined />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="Password" value={password}
                                        onChange={(e) => setPassword(e.target.value)} prefix={<LockOutlined />} />
                                </Form.Item>
                            </Col>
                            {errormsgs == true && <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Text type="danger">{inCorrectError}</Text>
                            </Col>}
                            <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                                <Form.Item name="remember" valuePropName="checked">
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col xs={14} sm={14} md={14} lg={14} xl={14}></Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                        Log in
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Login;



