import './App.css';
import AppRoutes from "./routes/appRoutes";
import { AuthProvider } from "./context/authContext";
import axios from 'axios';

// axios.defaults.baseURL = "http://localhost:8000/";
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Accept'] = 'application/json';
// axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
