import { Navigate, Route,Routes } from 'react-router-dom';
import Register from './Pages/Register'; 
import Login from './Pages/Login';
import Homepage from './Pages/HomePage';
import Profile from './Pages/Profile';
import EditProfile from './Pages/EditProfile';
import Schedule_Post from './Pages/SchedulePost';

function App() {
  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <Routes>
          <Route path='/' element={<Navigate to="/login" replace />}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/Register' element={<Register/>}></Route>
          <Route path='/Dashboard' element={<Homepage/>}></Route>
          <Route path='/Profile' element={<Profile/>}></Route>
          <Route path='/EditProfile' element={<EditProfile/>}></Route>
          {/* <Route path='/Insta' element={<Insta/>}></Route> */}
          <Route path='/Schedule_Post'  element={<Schedule_Post/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
