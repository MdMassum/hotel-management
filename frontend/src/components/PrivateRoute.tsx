import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute : React.FC = () =>{

    const {currentUser} = useSelector((state:any)=>state.user);

  return  currentUser ? <Outlet /> : <Navigate to={'/'} />
}

export default PrivateRoute