import { useEffect, useState } from "react";
import { fetchUsers } from "./../../services/service";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

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
