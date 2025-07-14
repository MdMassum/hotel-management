import React from 'react';

import { NavLink } from 'react-router-dom';

const TopHeader: React.FC = () => {
  return (
    <div>
      
    {/* desktop header */}
    <header className="fixed flex justify-between bg-gray-900 py-1 w-full min-w-[800px] absolute top-0 shadow-2xl z-50">
      {/* Left side */}
      <div className="h-12 flex items-center">
        <p className="text-xl text-white font-semibold px-6">Hotel Management System</p>
      </div>

      {/* Right side */}
      <div className="flex w-1/3 gap-9 items-center relative">

        <NavLink to="/astro/profile" className="h-8 w-8 flex gap-3 items-center">
          {/* <img src={""} alt="Profile" className="h-8 w-8 rounded-full object-cover" /> */}
          {/* <p className="text-gray-200 ">Ammy</p> */}
        </NavLink>
        
      </div>
    </header>

    </div>
  );
};

export default TopHeader;
