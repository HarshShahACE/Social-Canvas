import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, ...rest } : any) => {
  // Variable Declaration
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check For Item In Session Storage
  useEffect(() => {
    const checkUserToken = () => {
      const userToken = sessionStorage.getItem('Myid');
      if (userToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate('/Login'); // Redirect to login if user token is not present
      }
    };

    checkUserToken();
  }, [navigate]);

  if (location.pathname === '/login' && isLoggedIn) {
    navigate('/Dashboard'); // Redirect to dashboard if user is already logged in and trying to access the login page
    return null; // Return null to prevent rendering the component
  }
  else{
    <Component {...rest} />
  }

  // Render the component only if user is authenticated
  return isLoggedIn ? <Component {...rest} /> : null;
};

export default PrivateRoute;
