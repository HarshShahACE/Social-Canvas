import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import {  EmailRounded, PasswordRounded } from '@mui/icons-material';

// To Change Copyright Statement
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Social Canvas
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login() {
  
  const [username, setusername] = useState('');
  const [password1, setpassword] = useState('');
  const Home = useNavigate();
  const defaultImagePath = process.env.REACT_APP_DEFAULT_AUTHENTICATION_IMAGE;

  // To Show Password To User
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  // Check Email Validation
  const isEmailValid = (email : any) => {
    if(email === ''){
      window.alert('Please enter a valid Email ID');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
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

  // Password Validation
  const handlepasswordcheck = (value : any) => {
    if ( value.trim() === '' ) {
      window.alert('Password Should Not Be Blank');
      }
    else{
      if(value.length <=7){
        window.alert('Password Length Should Not Be Below 8');
      }
      else{
        return true
      }
    }
  }
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

    if(username==='' || password1 ===''){
      window.alert("Required Fields should not be empty")
    }else{
    if(isEmailValid(username)){
      if(handlepasswordcheck(password1)){
        try {
          const response = await fetch(`${process.env.REACT_APP_Fast_API}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email : username,
              password : password1
            }),
          });
    
          if (response.ok) {
            if (response.body) {
              let data: any = await response.json();
              console.log(data);
        
              if (response.status === 200) {
                if (data.message === "Login Successful") {
                  const id = data.user_id;
                  console.log(id)
                  sessionStorage.setItem('Myid', id);
                  let booleanValue = true; // or false
                  sessionStorage.setItem('login', JSON.stringify(booleanValue));
                  Home('/Dashboard');
                }
              }
            }
          } else {
            console.log(response.body);
            if (response.body) {
              let data: any = await response.json();
              console.log(data);
        
              if (response.status === 400) {
                if (data.detail === "Invalid Credentials") {
                  window.alert('Incorrect EmailID or Password');
              }
            }
          }
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
      }
    }
  }
    
          
      }
  // //Theme 
  // const [isDarkMode, setIsDarkMode] = useState(true);

  // const toggleTheme = () => {
  //   setIsDarkMode((prevMode) => !prevMode);
  // };

  // // Determine the current theme based on the state
  // const currentTheme = isDarkMode ? darkTheme : lighttheme;

  

  return (
    <div style={{ backgroundImage: `url(${defaultImagePath})`,
    backgroundSize:'cover',
    backgroundRepeat:'no-repeat'}}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <CssBaseline/>
      <Grid container component="main" style={{ height: '100vh'}}>
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square style={{border:'none', borderRadius:'20px' , margin:'20px' ,boxShadow:'none', background: 'rgba(255, 255, 255, 0.7)'}} >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              
            }}
          >
            <Box sx={{display: 'flex',flexDirection: 'row',alignItems: 'center',}}>
            <Avatar sx={{ m:1, bgcolor: 'primary.main' }}>
              <LoginOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                style={{}}
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleemailChange}
                onBlur={handleemailBlur}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton disabled>
                        <EmailRounded style={{color:'#707070'}} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment:(
                    <InputAdornment position="start">
                      <IconButton disabled>
                        <PasswordRounded style={{color:'#707070'}}/>
                      </IconButton>
                    </InputAdornment>),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handlepasswordChange}
                onBlur={handlepasswordBlur}
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