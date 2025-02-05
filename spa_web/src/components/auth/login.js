import axios from "axios";
import { useState } from "react";
import { Button, Checkbox, Form, Input, Col, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "./login.css";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onFinish = async (values) => {
        console.log('Success:', values);
        const requestData = {
            email: email,
            password: password
        }
        await axios.post("http://localhost:8000/users", requestData).then((res) => {
            console.log(res.data.users, "users");
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api", {
                email,
                password,
            });

            if (response.data.success) {
                onLogin(response.data);
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("Login failed. Please try again.");
            console.error("Login error:", err);
        }
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



