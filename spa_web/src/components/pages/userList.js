import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Space, Form, Input, Col, Row, Typography, Modal, Table, notification, Popconfirm } from 'antd';
import { TableOutlined, UnorderedListOutlined, UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import './userList.css';

const UserList = () => {
    const { Text, Link } = Typography;
    const [table, setTable] = useState(true);
    const [card, setCard] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [usersListData, setUsersListData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [fileName, setFileName] = useState('');
    const [editUserID, setEditUserID] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const API_URL = "http://localhost:8000";
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, msgs) => {
        api[type]({
            message: msgs,
        });
    };
    useEffect(() => {
        getUserLists();
    }, []);

    const columns = [
        {
            title: '',
            dataIndex: 'profile',
            key: 'profile',
            render: (value) =>
                <div style={{ textAlign: 'center' }}>
                    <img src={value} alt="Profiles" width="40px" height="40px" style={{ borderRadius: "25px" }} />
                </div>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <a>{email}</a>,
        },
        {
            title: 'First Name',
            dataIndex: 'firstname',
            key: 'firstname',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastname',
            key: 'lastname',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, data) =>
                <>
                    <Button color="primary" variant="solid" style={{ marginRight: "5px", borderRadius: "3px" }}
                        onClick={() => EditModelOpen(data)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDelete(data)}
                    >
                        <Button color="danger" variant="solid" style={{ marginLeft: "5px", borderRadius: "3px" }}>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
        },
    ];

    const data = [
        {
            key: 1,
            profile: 'John Brown',
            email: 'kdinesh@12.com',
            firstname: 'Dinesh',
            lastname: 'K',
        },
        {
            key: 2,
            profile: 'John Brown',
            email: 'kdinesh@12.com',
            firstname: 'Dinesh',
            lastname: 'K',
        },
        {
            key: 3,
            profile: 'John Brown',
            email: 'kdinesh@12.com',
            firstname: 'Dinesh',
            lastname: 'K',
        },
        {
            key: 4,
            profile: 'John Brown',
            email: 'kdinesh@12.com',
            firstname: 'Dinesh',
            lastname: 'K',
        },
    ];

    const handleFileChange = async (event) => {
        if (!event.target.files[0]) {
            alert("Please select a file first!");
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
        debugger;
        form.resetFields();
        setFileName('');
        setEditUserID('');
        console.log(data, "datavlue");
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

    const handleSubmit = async (values) => {
        debugger;
        console.log(values, "98765");

        let userDetails = {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            url: values.url
        }
        try {
            await axios.post(`${API_URL}/addUsers`, userDetails).then((response) => {
                if (response.data.status == 1) {
                    console.log(response.data, "users");
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

    const handleUpdateSubmit = async (values) => {
        debugger;
        console.log(values, "98765");

        let userDetails = {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            url: values.url
        }
        try {
            await axios.put(`${API_URL}/updateUsers/${editUserID}`, userDetails).then((response) => {
                if (response.data.status == 1) {
                    console.log(response.data, "users");
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

    const getUserLists = async () => {
        debugger;
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

    const handleDelete = async (value) => {
        debugger;
        await axios.delete(`${API_URL}/deleteUsers/${value.key}`).then((response) => {
            if (response.data.status == 1) {
                console.log(response.data, "users");
                setEditModalOpen(false);
                openNotificationWithIcon('success', "User deleted successfully!");
                getUserLists();
            } else {
                console.log(response.data, "users");
            }
        })
    };

    const handleToggle = (data) => {
        debugger;
        if (data == 'card') {
            setTable(false);
            setCard(true);
        } else if (data == 'table') {
            setCard(false);
            setTable(true);
        }
    }
    const handleSearch = (value) => {
        debugger;
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



    return (
        <>
            <div className="userlist_content_body">
                <div className="userlist_content_card">
                    {contextHolder}
                    <Row className="userlist_card">
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
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        {dataSource.length <= 0 ? <Table columns={columns} dataSource={dataSource} /> :
                            <Table columns={columns} dataSource={dataSource} loading={dataSource.length === 0} />}
                    </Col>
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
                                <input type="file" onChange={handleFileChange} className="userlist_fileupload" />
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
                </div>
            </div>
        </>
    );
};

export default UserList;
