import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react'; // Import useEffect
import { IconButton } from '@mui/material';
import { EmailRounded, PasswordRounded } from '@mui/icons-material';
import { isEmailValid, handlepasswordcheck } from '../utils/validation';
import Copyright from '../Components/Common/Copyright';
import axios, { AxiosError } from 'axios';
import TextFieldComponent from '../Components/Fields/Textfield';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/Common/Loading';
import ButtonComponent from '../Components/Fields/Buttonfield';
import PopUpModel from '../Components/Common/PopupModel';
import CloseIcon from '@mui/icons-material/Close';

export default function Login() {
  
  // Define Username And Password
  const [username, setusername] = useState('');
  const [password1, setpassword] = useState('');
  const [content,setcontent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [success , setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Add state for "Remember me"
  
  // For Closing No Data PopUp
  const handlePopupClose = () => {
    setShowPopup(false);
  };

  // Default BackGround Image
  const defaultImagePath = process.env.REACT_APP_DEFAULT_AUTHENTICATION_IMAGE;
  
  // Define Navigation 
  const navigate = useNavigate()

  // Define Loading Screen
  const [loading, setLoading] = useState(false);

  // Check On Field When field is left
  const handleemailBlur = () => {
    if(username !== ''){
      if(!isEmailValid(username)){
        setcontent("Please enter a valid Email ID");
        setSuccess(false);
        setShowPopup(true);
      };
    }
  };

  // Check Password on leave
  const handlepasswordBlur = () => {
    if(password1 !== ''){
      handlepasswordcheck(password1);
    }
  };

  // On Submit Button
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Check For Blank Values
    if(username==='' || password1 ===''){
      setcontent("Required Fields should not be empty")
      setSuccess(false);
      setShowPopup(true);
    }else{
      // Check For Email Validation
      if(isEmailValid(username)){
        // Password validation
        if(handlepasswordcheck(password1)){
          setLoading(true);
          // Login API 
          try {
            const response = await axios.post(`${process.env.REACT_APP_Fast_API}/login`, {
              email: username,
              password: password1
            });
            
            if (response.status === 200) {
              const data = response.data;
              const id = data.user_id;
              const name = data.user_name;
              sessionStorage.setItem('Myid', id);
              sessionStorage.setItem('Uname',name);
              // If "Remember me" is checked, store credentials in localStorage
              if (rememberMe) {
                localStorage.setItem('username', username);
                localStorage.setItem('password', password1);
              }
              setLoading(false);
              navigate("/Dashboard", { replace: true });
            }
          } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError;
              if (axiosError.response && axiosError.response.status === 400) {
                const responseData = axiosError.response.data;
                if (responseData && typeof responseData === 'object') {
                  // Use a type assertion to inform TypeScript that responseData has a 'detail' property
                  const detail = (responseData as { detail: string }).detail;
                  setcontent(detail);
                  setSuccess(false);
                  setShowPopup(true);
                  setLoading(false);
                }
              } else {
                console.error('Error occurred:', axiosError); 
              }
            }
          }
        }
      }
    }
  }

  // useEffect to check for credentials in localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (storedUsername && storedPassword) {
      setusername(storedUsername);
      setpassword(storedPassword);
      setRememberMe(true); // Set rememberMe to true when localStorage values are found
    }
  }, []); // Listen to changes in rememberMe // Empty dependency array ensures this effect runs only once after the initial render

  return (
    <div style={{ backgroundImage: `url(${defaultImagePath})`,
    backgroundSize:'cover',
    backgroundRepeat:'no-repeat', color:'white'}}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <CssBaseline/>
      <PopUpModel
        isOpen={showPopup}
        onClose={handlePopupClose}
        content={content}
        success={success}
      />
      {loading && <LoadingScreen />}
      <Grid container component="main" style={{ height: '100vh'}}>
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square style={{border:'none', borderRadius:'20px' , margin:'20px' ,boxShadow:'none', background: 'rgba(225, 225, 225, 0.7)'}} >
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{display: 'flex',flexDirection: 'row',alignItems: 'center',}}>
              <Avatar sx={{ m:1, bgcolor: 'primary.main' }}>
                <LoginOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextFieldComponent
                label="Email Address"
                value={username}
                onChange={e=>setusername(e.target.value)}
                onBlur={handleemailBlur}
                startAdornment={<IconButton disabled><EmailRounded style={{color:'#707070'}} /></IconButton>}
              />
              <TextFieldComponent
                label="Password"
                type='password'
                value={password1}
                onChange={e=>setpassword(e.target.value)}
                onBlur={handlepasswordBlur}
                startAdornment={<IconButton disabled><PasswordRounded style={{color:'#707070'}}/></IconButton>}
              />
              <FormControlLabel
                control={<Checkbox value={rememberMe} color="primary" onChange={(e) => setRememberMe(e.target.checked)} />} // Update the state when the checkbox changes
                label="Remember me"
                sx={{ display: 'flex', alignItems: 'center', marginLeft: '-8px' }}
              />
              <ButtonComponent
                type="submit"
                fullWidth
                variant="contained"
                style={{ marginTop: '10px', marginBottom: '10px' }}
              >
                Sign In
              </ButtonComponent>
              <Grid container>
                <Grid item xs>
                  <ButtonComponent variant='text' href='/Forgot_Password'>Forgot Password</ButtonComponent>
                </Grid>
                <Grid item>
                  <ButtonComponent variant='text' href='/Register'> Don't Have Account? Sign Up </ButtonComponent>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
