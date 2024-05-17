import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result : any) => {
      if (result.isConfirmed) {
        console.log("logging out");
        sessionStorage.clear();
        navigate("/Login");
      }
    });
  };

  return handleLogout;
};
