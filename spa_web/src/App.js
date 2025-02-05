import './App.css';
import AppRoutes from "./routes/appRoutes";
import { AuthProvider } from "./context/authContext";


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
