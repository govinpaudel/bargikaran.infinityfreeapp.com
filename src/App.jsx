import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import Search from './search/Search';
import Admin from './Admin/Admin';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Logout from './Logout/Logout';
import Homepage from './Homepage/Homepage';
import ListUser from './SuperAdmin/ListUser';
import SyncData from './SuperAdmin/SyncData';
import UploadExcel from './SuperAdmin/UploadExcel';

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
          path="/listuser"
          element={
            <ProtectedRoute>
              <ListUser />
            </ProtectedRoute>
          }
        /> 
         <Route
          path="/syncdata"
          element={
            <ProtectedRoute>
              <SyncData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadexcel"
          element={
            <ProtectedRoute>
              <UploadExcel />
            </ProtectedRoute>
          }
        />         
      </Routes>
    </Router>
  )
}

export default App
