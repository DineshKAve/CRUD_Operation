import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./../components/auth/login";
import UserList from "./../components/pages/userList";
import UserView from "./../components/pages/userView";

const isAuthenticated = () => {
    return !!localStorage.getItem("userId");
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" replace />;
};


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/usersList" element={<ProtectedRoute element={<UserList />} />} />
                <Route path="/usersView" element={<ProtectedRoute element={<UserView />} />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
