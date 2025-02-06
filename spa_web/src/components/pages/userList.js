import { useEffect, useState } from "react";
import { fetchUsers } from "./../../services/service";
import { useNavigate } from "react-router-dom";
import { Button, Space, Form, Input, Col, Row, Typography, Radio } from 'antd';
import { TableOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from "axios";
import './userList.css';

const UserList = () => {
    const { Text, Link } = Typography;
    const { Search } = Input;
    const [table, setTable] = useState(true);
    const [card, setCard] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers().then(setUsers);
        getUserLists();
    }, []);

    const getUserLists = async () => {
        await axios.get("http://localhost:8000/users").then((res) => {
            console.log(res.data.users, "users");
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
    const handleSearch = (e) => {
        const searchText = e.target.value.toLowercase();
        const filteredData = users.filter((user) => {
            user.name.toLowercase().includes(searchText) || user.name.toLowercase().includes(searchText)
        });
        setFilteredData(filteredData);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
            setUsers(res.data);
            setFilteredData(res.data);
        })
    };
    return (
        <>
            <div className="userlist_content_body">
                <div className="userlist_content_card">
                    <Row className="userlist_card">
                        <Col xs={6} sm={6} md={2} lg={2} xl={2}>
                            <Text strong>Users</Text>
                        </Col>
                        <Col xs={2} sm={5} md={16} lg={16} xl={16}></Col>
                        <Col xs={9} sm={8} md={4} lg={4} xl={4}>
                            <Space.Compact>
                                <Search placeholder="Search" allowClear />
                            </Space.Compact>
                        </Col>
                        <Col xs={7} sm={5} md={2} lg={2} xl={2}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Create User
                            </Button>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
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
                        <Col xs={0} sm={0} md={12} lg={18} xl={18}></Col>
                    </Row>
                </div>
            </div>


            {/*<h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
                        {user.name}
                    </li>
                ))}
            </ul> */}
        </>
    );
};

export default UserList;
