import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import {  EmailRounded, PasswordRounded } from '@mui/icons-material';
import { isEmailValid, handlepasswordcheck } from '../utils/validation';
import Copyright from '../Components/Copyright';
import axios, { AxiosError } from 'axios';
import TextFieldComponent from '../Components/Textfield';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/Loading';

export default function Login() {
  
  // Define Username And Password
  const [username, setusername] = useState('');
  const [password1, setpassword] = useState('');

  // Default BackGround Image
  const defaultImagePath = process.env.REACT_APP_DEFAULT_AUTHENTICATION_IMAGE;
  
  // Define Naviagation 
  const navigate = useNavigate()

  // Define Loading Screen
  const [loading, setLoading] = useState(false);

  // Set Email on Chnage
  const handleemailChange = (e : any) => {
    setusername(e.target.value);
  };

  // Check On Field When field is leave
  const handleemailBlur = () => {
    if(username !== ''){
    if(!isEmailValid(username)){
      window.alert("Please enter a valid Email ID");
    };
    }
  };

  // Set Password on Chnage
  const handlepasswordChange = (e : any) => {
    setpassword(e.target.value);
  };

  // Check Password on  leave
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
        window.alert("Required Fields should not be empty")
      }else{
        // Check For Email Validation
      if(isEmailValid(username)){
        // Password validation
        if(handlepasswordcheck(password1)){
          setLoading(true);
          // Login API 
            try {

              const timeoutId = setTimeout(() => {
                setLoading(false);
                window.alert("Request timed out. Please try again later.");
              }, 2000);

              const response = await axios.post(`${process.env.REACT_APP_Fast_API}/login`, {
                email: username,
                password: password1
              });

              clearTimeout(timeoutId);
            
              if (response.status === 200) {
                const data = response.data;
                const id = data.user_id;
                sessionStorage.setItem('Myid', id);
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
                    window.alert(detail)
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
  return (
    <div style={{ backgroundImage: `url(${defaultImagePath})`,
    backgroundSize:'cover',
    backgroundRepeat:'no-repeat'}}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <CssBaseline/>
      {loading && <LoadingScreen />}
      <Grid container component="main" style={{ height: '100vh'}}>
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square style={{border:'none', borderRadius:'20px' , margin:'20px' ,boxShadow:'none', background: 'rgba(255, 255, 255, 0.7)'}} >
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
                onChange={handleemailChange}
                onBlur={handleemailBlur}
                startAdornment={<IconButton disabled><EmailRounded style={{color:'#707070'}} /></IconButton>}
              />
              <TextFieldComponent
                label="Password"
                type='password'
                value={password1}
                onChange={handlepasswordChange}
                onBlur={handlepasswordBlur}
                startAdornment={<IconButton disabled><PasswordRounded style={{color:'#707070'}} /></IconButton>}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary"/>}
                label="Remember me"
                sx={{ display: 'flex', alignItems: 'center', marginLeft: '-8px' }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button href='/'>Forgot Password</Button>
                </Grid>
                <Grid item>
                  <Button href='/Register'> Don't Have Account? Sign Up </Button>
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