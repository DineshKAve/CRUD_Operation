import { useEffect, useState } from "react";
import { fetchUsers } from "./../../services/service";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserList = () => {
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
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
