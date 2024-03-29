import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import {  EmailRounded, PasswordRounded, PhoneRounded } from '@mui/icons-material';
import { isEmailValid, isPasswordValid } from '../utils/validation';
import Copyright from '../Components/Common/Copyright';
import axios from 'axios';
import TextFieldComponent from '../Components/Fields/Textfield';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/Common/Loading';
import ButtonComponent from '../Components/Fields/Buttonfield';

// Import statements...

export default function ForgotPassword() {
    const [username, setusername] = useState('');
    const [Phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailValid, setEmailValid] = useState(false); // State to track email validity
    const [showNewPassword, setShowNewPassword] = useState(false); // State to show new password field
    const [newPassword, setNewPassword] = useState(''); // State to store new password
    const defaultImagePath = process.env.REACT_APP_DEFAULT_AUTHENTICATION_IMAGE;
    const navigate = useNavigate();
  
    const handleemailBlur = () => {
      if (username !== '') {
        if (!isEmailValid(username)) {
          window.alert("Please enter a valid Email ID");
        }
      }
    };
  
    const handleCheckEmail = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (username === '') {
        window.alert("Required Fields should not be empty");
      } else {
        if (isEmailValid(username)) {
          setLoading(true);
          try {
            const response = await axios.post(`${process.env.REACT_APP_Fast_API}/CheckEmail?user_email=`+username+`&user_phone=`+Phone, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            if (response.status === 200) {
              setEmailValid(true);
              setShowNewPassword(true); // Show new password field
            }
            else{
              setLoading(false);
              window.alert("No User Found , Please Try After Some Time");
            }
          } catch (error: unknown) {
            setLoading(false);
            window.alert("No User Found , Please Try After Some Time");
          }
          setLoading(false);
        }
      }
    };
  
    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewPassword(event.target.value);
    };

    const handleupdatePassword = async(event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPassword === '') {
          window.alert("Required Fields should not be empty");
        } else {
          if (isPasswordValid(newPassword)) {
            setLoading(true);
            try {
              const response = await axios.post(`${process.env.REACT_APP_Fast_API}/UpdatePassword?user_email=`+username+`&User_Password=`+newPassword, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
              if (response.status === 200) {
                window.alert("Password Updated SuccessFully");
                navigate("/Login");
              }
            } catch (error: unknown) {
              window.alert("Try After Some Time");
            }
            setLoading(false);
          }
          else{
            window.alert("Please make sure your Password Have 8 Characters Which contains at least one uppercase letter, one lowercase letter, one Number & One Sepcial Character");
          }
        }
    }
  
    return (
      <div style={{ backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', color: 'white' }}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <CssBaseline />
        {loading && <LoadingScreen />}
        <Grid container component="main" style={{ height: '100vh' }}>
          <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square style={{ border: 'none', borderRadius: '20px', margin: '20px', boxShadow: 'none', background: 'rgba(225, 225, 225, 0.7)' }} >
            <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                  <LoginOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Forgot Password
                </Typography>
              </Box>
              <Box component="form" onSubmit={(event) => emailValid ? handleupdatePassword(event) : handleCheckEmail(event)} sx={{ mt: 1 }}>
                <TextFieldComponent
                  label="Email Address"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  onBlur={handleemailBlur}
                  startAdornment={<IconButton disabled><EmailRounded style={{ color: '#707070' }} /></IconButton>}
                  disabled={emailValid} // Disable email field if email is valid
                />
                <TextFieldComponent
                  label="Phone Number"
                  value={Phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  startAdornment={<IconButton disabled><PhoneRounded style={{ color: '#707070' }} /></IconButton>}
                  disabled={emailValid} // Disable email field if email is valid
                />
                {showNewPassword && (
                  <TextFieldComponent
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    startAdornment={<IconButton disabled><PasswordRounded style={{ color: '#707070' }} /></IconButton>}
                  />
                )}
                <ButtonComponent
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                >
                  {emailValid ? "Update Password" : "Submit"}
                </ButtonComponent>
                <Grid container>
                  <Grid item>
                    <ButtonComponent variant='text' href='/Login'>Sign In</ButtonComponent>
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
  