import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import Search from './search/Search';
import Admin from './Admin/Admin';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Logout from './Logout/Logout';
import Homepage from './Homepage/Homepage';
import SuperAdmin from './SuperAdmin/SuperAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />  
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/searchbargikaran" element={<Search />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute>
              <SuperAdmin />
            </ProtectedRoute>
          }
        />         
      </Routes>
    </Router>
  )
}

export default App
