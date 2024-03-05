import { Navigate, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register'; 
import Login from './Pages/Login';
import Homepage from './Pages/HomePage';
import Profile from './Pages/Profile';
import Schedule_Post from './Pages/SchedulePost';
import ManagePost from './Pages/ManagePost';
import Analysis from './Pages/Analysis';
import PrivateRoute from './Components/Authentication/Private_Route';
import { useState } from 'react';
import LoadingScreen from './Components/Loading';


function App() {

  const [loading, setLoading] = useState(false);

  const Logout = () => {
      setLoading(true);
      console.log("logging out");
      sessionStorage.clear();
      // Redirect to the login page
      setLoading(false);
      window.location.href = "/Login";
    return(
      <>
        {loading && <LoadingScreen />}
      </>
    )
  }


  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Navigate to="/Login" replace />} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/Register' element={<Register/>} />
        <Route path='/Logout' element={<Logout/>} />

        {/* Private Routes */}
        <Route path='/Dashboard' element={<PrivateRoute element={Homepage}/>} />
        <Route path='/Profile' element={<PrivateRoute element={Profile}/>} />
        <Route path='/Schedule_Post' element={<PrivateRoute element={Schedule_Post}/>} />
        <Route path='/Manage_Post' element={<PrivateRoute element={ManagePost}/>} />
        <Route path='/Analysis' element={<PrivateRoute element={Analysis}/>} />
      </Routes>
    </div>
  );
}

export default App;
