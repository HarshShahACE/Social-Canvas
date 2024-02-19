import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, ...rest }: any) => {
  const navigate = useNavigate();

  useEffect(() =>{
    let login = sessionStorage.getItem('login');
    console.log(login);
    if (!login) {
      navigate('/login'); // Redirect to login if not logged in
    }
  });

  return <Component {...rest} />;
};

export default PrivateRoute;
