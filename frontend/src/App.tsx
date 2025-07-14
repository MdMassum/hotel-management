import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
// import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import AdminDashboard from './pages/AdminPages/AdminDashboard';
// import AdminRoute from './components/admin/AdminRoute'
import AdminLayout from './layout/AdminLayout';
import PropertyPage from './pages/AdminPages/PropertyPage';
import RoomPage from './pages/AdminPages/RoomPage';
import TenantPage from './pages/AdminPages/TenantPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* <Route element={<AdminRoute />}> */}
        <Route element={<AdminLayout />}>
          
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/properties" element={<PropertyPage />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/tenants" element={<TenantPage />} />
          
        </Route>
      {/* </Route> */}

        {/* Not found page */}
        <Route path='/*' element={<NotFoundPage/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
