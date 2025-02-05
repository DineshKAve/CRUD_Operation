import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./../components/auth/login";
import UserList from "./../components/pages/userList";
import UserView from "./../components/pages/userView";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserView />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
