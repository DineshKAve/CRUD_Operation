import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Space, Form, Input, Col, Row, Typography, Modal, Skeleton, notification, Popconfirm, Avatar, Card } from 'antd';
import { TableOutlined, UnorderedListOutlined, UploadOutlined, EditOutlined, DeleteFilled } from '@ant-design/icons';
import axios from "axios";
import './userView.css';

const UserView = () => {
    const API_URL = "http://localhost:8000";
    const navigate = useNavigate();
    const { Text, Title } = Typography;
    const [form] = Form.useForm();
    const [table, setTable] = useState(false);
    const [card, setCard] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [editUserID, setEditUserID] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, msgs) => {
        api[type]({
            message: msgs,
        });
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        getUserLists();
    }, []);

    {/* File Upload Method Start */ }
    const handleFileChange = async (event) => {
        if (!event.target.files[0]) {
            openNotificationWithIcon('warning', "Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", event.target.files[0]);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("File uploaded successfully:", response.data.filePath);
            setFileName(response.data.filePath);
            form.setFieldsValue({
                url: response.data.filePath,
            });
            openNotificationWithIcon('success', "File uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
            openNotificationWithIcon('error', "Upload failed. Please try again.");
        }
    };
    {/* File Upload Method End */ }

    const handleCancel = () => {
        setModalOpen(false);
        setEditModalOpen(false);
    };

    const ModelOpen = () => {
        form.resetFields();
        setFileName('');
        setModalOpen(true);
    };

    const EditModelOpen = (data) => {
        form.resetFields();
        setFileName('');
        setEditUserID('');
        setEditingUser(data);
        form.setFieldsValue({
            url: data.profile,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
        });
        setFileName(data.profile);
        setEditUserID(data.key);
        setEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    };

    const handleToggle = (data) => {
        if (data == 'card') {
            setTable(false);
            setCard(true);
        } else if (data == 'table') {
            setCard(false);
            setTable(true);
            navigate('/usersList');
        }
    };

    {/* Search Method Start */ }
    const handleSearch = (value) => {
        const searchText = value.toLowerCase();
        const filtered = dataSource.filter((user) =>
            user.firstname.toLowerCase().includes(searchText) ||
            user.lastname.toLowerCase().includes(searchText)
        );
        if (searchText == '') {
            setDataSource(filteredData);
        } else {
            setDataSource(filtered);
        }
    };
    {/* Search Method End */ }


    {/* Post Method Start */ }
    const handleSubmit = async (values) => {

        let userDetails = {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            url: values.url
        }
        try {
            await axios.post(`${API_URL}/addUsers`, userDetails).then((response) => {
                if (response.data.status == 1) {
                    setModalOpen(false);
                    openNotificationWithIcon('success', "User added successfully!");
                    getUserLists();
                } else {
                    console.log(response.data, "users");
                }
            }).catch((err) => {
                console.log('User Adding Failed', err);
            });
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    };
    {/* Post Method End */ }


    {/* Put Method Start */ }
    const handleUpdateSubmit = async (values) => {

        let userDetails = {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            url: values.url
        }
        try {
            await axios.put(`${API_URL}/updateUsers/${editUserID}`, userDetails).then((response) => {
                if (response.data.status == 1) {
                    setEditModalOpen(false);
                    openNotificationWithIcon('success', "User updated successfully!");
                    getUserLists();
                } else {
                    console.log(response.data, "users");
                }
            }).catch((err) => {
                console.log('User Editing Failed', err);
            });
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    };
    {/* Put Method End */ }


    {/* Get Method Start */ }
    const getUserLists = async () => {
        const response = await axios.get(`${API_URL}/getUsersList`);
        let usersListData = [];
        usersListData.push(response.data.data);

        const formattedData = usersListData[0].map((res) => ({
            key: res.id,
            profile: res.url,
            email: res.email,
            firstname: res.firstname,
            lastname: res.lastname,
        }));

        setDataSource(formattedData);
        setFilteredData(formattedData);
    };
    {/* Get Method End */ }

    
    {/* Delete Method Start */ }
    const handleDelete = async (value) => {
        await axios.delete(`${API_URL}/deleteUsers/${value.key}`).then((response) => {
            if (response.data.status == 1) {
                setEditModalOpen(false);
                openNotificationWithIcon('success', "User deleted successfully!");
                getUserLists();
            } else {
                console.log(response.data, "users");
            }
        })
    };
    {/* Delete Method End */ }


    const UserCard = ({ user }) => {
        const [hovered, setHovered] = useState(false);

        return (
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <Skeleton loading={loading}>
                    {/* UserView Card Start */}
                    <Card
                        style={{
                            textAlign: "center",
                            position: "relative",
                            background: "#fff",
                            boxShadow: "3px 5px 15px 5px #dbdbdb",
                            width: 300,
                            cursor: "pointer",
                        }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {/* Hover Overlay */}
                        {hovered && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: "rgba(187, 179, 187, 0.73)",
                                    borderRadius: "3px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 9,
                                }}
                            >
                                <div style={{ display: "flex", gap: "15px" }}>
                                    <EditOutlined
                                        style={{
                                            background: "#A29BFE",
                                            padding: 10,
                                            borderRadius: "50%",
                                            fontSize: "18px",
                                            color: "#fff",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => EditModelOpen(user)}
                                    />
                                    <Popconfirm
                                        title="Are you sure to delete this user?"
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => handleDelete(user)}
                                    >
                                        <DeleteFilled
                                            style={{
                                                background: "#FF3B30",
                                                padding: 10,
                                                borderRadius: "50%",
                                                fontSize: "18px",
                                                color: "#fff",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </Popconfirm>
                                </div>
                            </div>
                        )}

                        {/* User Info */}
                        <Avatar size={90} src={user.profile} />
                        <Title level={4}>{user.firstname + " " + user.lastname}</Title>
                        <Text type="secondary">{user.email}</Text>
                    </Card>
                    {/* UserView Card End */}
                </Skeleton>
            </Space>
        );
    };


    return (
        <>
            <div className="userview_content_body">
                <div className="userview_content_card">
                    {contextHolder}
                    {/* UserView Header Start */}
                    <Row className="userview_card">
                        <Col xs={6} sm={6} md={2} lg={2} xl={2}>
                            <Text strong style={{ fontSize: '20px' }}>Users</Text>
                        </Col>
                        <Col xs={2} sm={5} md={13} lg={15} xl={16}></Col>
                        <Col xs={9} sm={8} md={4} lg={4} xl={4}>
                            <Input.Search
                                placeholder="Search"
                                allowClear
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ borderRadius: '3px' }}
                            />
                        </Col>
                        <Col xs={7} sm={5} md={5} lg={3} xl={2} style={{ paddingLeft: '8px' }}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', borderRadius: '3px' }}
                                onClick={() => ModelOpen()}>
                                Create User
                            </Button>
                        </Col>
                        <Col xs={12} sm={12} md={10} lg={6} xl={4} style={{ paddingTop: '10px' }}>
                            {table == true &&
                                <>
                                    <Button color="primary" variant="outlined" icon={<TableOutlined />} >Table</Button>
                                    <Button icon={<UnorderedListOutlined />} onClick={() => handleToggle('card')}>Card</Button>
                                </>}
                            {card == true &&
                                <>
                                    <Button icon={<TableOutlined />} onClick={() => handleToggle('table')}>Table</Button>
                                    <Button color="primary" variant="outlined" icon={<UnorderedListOutlined />}>Card</Button>
                                </>}
                        </Col>
                        <Col xs={12} sm={12} md={16} lg={18} xl={20} style={{ paddingTop: '10px' }}></Col>
                    </Row>
                    {/* UserView Header End */}

                    {/* UserView Card Method Start */}
                    <Row gutter={[16, 16]} justify="center" style={{ padding: "10px 35px" }}>
                        {dataSource.map((user) => (
                            <Col key={user.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                                <UserCard user={user} />
                            </Col>
                        ))}
                    </Row>
                    {/* UserView Card Method End */}

                    {/* Add User Model Method Start */}
                    <Modal title="Create New User" centered open={modalOpen} footer='' onCancel={handleCancel}>
                        <Form form={form} onFinish={handleSubmit} name="validateOnly" layout="vertical" autoComplete="off" style={{ paddingTop: '12px' }}>
                            <Form.Item
                                name="firstname"
                                label="First Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your firstname!',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter first name" style={{ borderRadius: '3px' }} />
                            </Form.Item>
                            <Form.Item
                                name="lastname"
                                label="Last Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your lastname!',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter last name" style={{ borderRadius: '3px' }} />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        type: 'email',
                                        required: true,
                                        message: 'Please enter your email!',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter email" style={{ borderRadius: '3px' }} />
                            </Form.Item>
                            <Form.Item
                                name="url"
                                label="Profile Image Link"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please upload your profile!',
                                    },
                                    {
                                        type: 'url',
                                        warningOnly: true,
                                    },
                                    {
                                        type: 'string',
                                        min: 6,
                                    },
                                ]}
                            >
                                <input type="file" onChange={handleFileChange} className="userview_fileupload" />
                                <Input placeholder="Please enter profile image link" value={fileName} style={{ borderRadius: '3px' }} suffix={<UploadOutlined />} />
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'end' }}>
                                <Space>
                                    <Button htmlType="reset" style={{ borderRadius: '3px' }}>Cancel</Button>
                                    <Button type="primary" htmlType="submit" style={{ borderRadius: '3px' }}>Submit</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                    {/* Add User Model Method End */}

                    {/* Edit User Model Method Start */}
                    <Modal title="Edit User" centered open={editModalOpen} footer='' onCancel={handleCancel}>
                        <Form form={form} onFinish={handleUpdateSubmit} name="validateOnly" layout="vertical" autoComplete="off" style={{ paddingTop: '12px' }}>
                            <Form.Item
                                name="firstname"
                                label="First Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your firstname!',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter first name" style={{ borderRadius: '3px' }}
                                    value={editingUser?.firstname}
                                    onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item
                                name="lastname"
                                label="Last Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your lastname!',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter last name" style={{ borderRadius: '3px' }}
                                    value={editingUser?.lastname}
                                    onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        type: 'email',
                                        required: true,
                                        message: 'Please enter your email!',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter email" style={{ borderRadius: '3px' }}
                                    value={editingUser?.email}
                                    onChange={handleInputChange} />
                            </Form.Item>
                            <Form.Item
                                name="url"
                                label="Profile Image Link"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please upload your profile!',
                                    },
                                    {
                                        type: 'url',
                                        warningOnly: true,
                                    },
                                    {
                                        type: 'string',
                                        min: 6,
                                    },
                                ]}
                            >
                                <input type="file" onChange={handleFileChange} className="userlist_fileupload" />
                                <Input placeholder="Please enter profile image link" value={fileName} style={{ borderRadius: '3px' }} suffix={<UploadOutlined />} />
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'end' }}>
                                <Space>
                                    <Button onClick={() => handleCancel()} style={{ borderRadius: '3px' }}>Cancel</Button>
                                    <Button type="primary" htmlType="submit" style={{ borderRadius: '3px' }}>Update</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>
                    {/* Edit User Model Method End */}
                </div>
            </div>
        </>
    );
};

export default UserView;
