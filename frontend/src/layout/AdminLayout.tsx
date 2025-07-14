
import TopHeader from '../components/TopHeader';
import AdminSidebar from '../components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <TopHeader/>
      <AdminSidebar />
      <div className="flex-grow p-6 bg-white ml-56 mt-13">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
