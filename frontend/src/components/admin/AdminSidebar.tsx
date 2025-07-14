
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutFailure, signOutStart, signOutSuccess } from '../../redux/authSlice/index';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const nav = [
    {
      icon: "#",
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: "#",
      label: 'Properties',
      href: '/properties',
    },
    {
      icon: "#",
      label: 'Rooms',
      href: '/rooms',
    },
    {
      icon: "#",
      label: 'Tenants',
      href: '/tenants',
    }
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/logout`, { withCredentials: true });
      if (response.data.success === false) {
        dispatch(signOutFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }
      console.log("Logout Success:", response.data);
      toast.success("Logout Successful");
      dispatch(signOutSuccess());
      navigate('/');
    } catch (error : any) {
      console.log(error);
      dispatch(signOutFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed flex flex-col absolute left-0 top-14 h-[90vh] items-center text-lg shadow-2xl pb-4 z-50 max-w-[16rem] bg-gray-200 mr-56 z-30">

    <div className="h-32 flex justify-center items-center gap-2 ">
      <h1 className="text-gray-700 text-2xl font-bold mb-3">Admin</h1>
    </div>

      <div className="flex flex-col w-full h-full px-4 gap-5 text-center py-3 items-center ">
        {nav.map((item) => (
          <NavLink
          to={item.href}
          key={item.href}
          className={({ isActive }) =>
            `flex items-center w-48 gap-2 pl-2 py-2 font-semibold rounded-sm transition-colors duration-300
             ${isActive ? 'bg-white text-black border-l-4 border-black' : 'hover:bg- border-l-4 border-transparent'}`
          }
        >
          <p className='max-w-20'>{item.label}</p>
        </NavLink>
        ))}
      </div>

      <div 
        onClick={() => handleLogout()}
        className='flex w-full rounded-md  gap-1 items-center justify-center px-4  mt-2 cursor-pointer'>
        <p className='py-2 hover:bg-white hover:border-l-4 hover:border-black hover:text-black rounded-sm px-3 w-full font-semibold'>Logout</p>
      </div>
    </div>
  );
};

export default AdminSidebar;
