import React, { useContext } from 'react';
import { AppState } from '../../App';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AppState);
  if (!user) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

 
  
 
  
  return (
    <div className='container-fluid bg-light p-5'>
     <div className="clearfix "> <h1 style={{float:'left'}}>Dashboard</h1>
     <button style={{float:"right"}} onClick={logout} className="btn btn-secondary btn-sm">Logout</button></div>
      <hr />
      <h2>Welcome, {user?.username}!</h2>
    </div>
  );
};

export default Dashboard;
