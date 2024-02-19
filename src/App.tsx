import { Navigate, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register'; 
import Login from './Pages/Login';
import Homepage from './Pages/HomePage';
import Profile from './Pages/Profile';
import Schedule_Post from './Pages/SchedulePost';
import PrivateRoute from './Components/Private_Route';


function App() {
  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />

        {/* Private Routes */}
        <Route path='/Dashboard' element={<PrivateRoute element={Homepage}/>} />
        <Route path='/profile' element={<PrivateRoute element={Profile}/>} />
        <Route path='/schedule_post' element={<PrivateRoute element={Schedule_Post}/>} />
      </Routes>
    </div>
  );
}

export default App;
