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
import { EmailRounded, PasswordRounded } from '@mui/icons-material';
import { isEmailValid, isPasswordValid } from '../utils/validation';
import LoadingScreen from '../Components/Common/Loading';
import ButtonComponent from '../Components/Fields/Buttonfield';
import axios from 'axios';
import TextFieldComponent from '../Components/Fields/Textfield';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Copyright from '../Components/Common/Copyright';
import PopUpModel from '../Components/Common/PopupModel';

export default function ForgotPassword() {
  const [username, setusername] = useState(''); // State for email
  const [loading, setLoading] = useState(false); // State for loading status
  const [emailValid, setEmailValid] = useState(false); // State to track email validity
  const [showOTPField, setShowOTPField] = useState(false); // State to show OTP field
  const [otp, setOTP] = useState(''); // State for OTP
  const [showNewPassword, setShowNewPassword] = useState(false); // State to show new password field
  const [newPassword, setNewPassword] = useState(''); // State to store new password
  const defaultImagePath = process.env.REACT_APP_DEFAULT_AUTHENTICATION_IMAGE; // Default image path
  const navigate = useNavigate(); // Navigation hook
  const [content,setcontent] = useState('');
  const [success,setSuccess] = useState(Boolean);
  const [showPopup, setShowPopup] = useState(false);

   // For Closing No Data PopUp
   const handlePopupClose = () => {
    setShowPopup(false);
  };


  useEffect(() => {
    if (emailValid) {
      setShowOTPField(true); // Show OTP field after email validation
    }
  }, [emailValid]);

  // Function to handle blur event on email field
  const handleEmailBlur = () => {
    if (username !== '') {
      if (!isEmailValid(username)) {
        setcontent("Please enter a valid Email ID");
        setSuccess(false)
        setShowPopup(true);
      }
    }
  };

  // Function to check email validity and fetch user details
  const handleCheckEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === '') {
      setcontent("Required Fields should not be empty");
      setSuccess(false)
      setShowPopup(true);
    } else {
      if (isEmailValid(username)) {
        setLoading(true);
        try {
          const response = await axios.post(`${process.env.REACT_APP_Fast_API}/forgot_password`, {
            email : username
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 200) {
            let CheckOtp = response.data.otp;
            sessionStorage.setItem('OTP', CheckOtp);
            setcontent("Check Your Email For OTP")
            setSuccess(true)
            setShowPopup(true);
            setEmailValid(true);
          }
          else{
            setLoading(false);
            setcontent("No User Found , Please Try After Some Time");
            setSuccess(false)
            setShowPopup(true);
          }
        } catch (error: unknown) {
          setLoading(false);
          setcontent("No User Found , Please Try After Some Time");
          setSuccess(false)
          setShowPopup(true);
        }
        setLoading(false);
      }
    }
  };

  // Function to handle OTP verification
  const handleOTPVerification = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp === '') {
      setcontent("OTP Field should not be empty");
      setSuccess(false)
      setShowPopup(true)
    } else {
      setLoading(true);
      const CheckOtp = sessionStorage.getItem('OTP');
      if(otp === CheckOtp){
      setLoading(false);
      setShowOTPField(false);
      setShowNewPassword(true); // Show new password field
      sessionStorage.removeItem('OTP');
      }else{
        setLoading(false);
        console.log("Otp",otp,"Check",CheckOtp);
        setcontent("Otp Not Match, Try After Some Time.");
        setSuccess(false)
        setShowPopup(true);
      }
  };
  }

  // Function to handle new password change event
  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  // Function to handle update password form submission
  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword === '') {
      setcontent("New Password Field should not be empty");
      setSuccess(false)
      setShowPopup(true);
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
            setcontent("Password Updated Successfully");
            setSuccess(true)
            setShowPopup(true);
            navigate("/Login");
          }
        } catch (error: unknown) {
          setcontent("Try After Some Time");
          setSuccess(false)
          setShowPopup(true);
        }
        setLoading(false);
      }
      else{
        setcontent("Please make sure your Password Have 8 Characters Which contains at least one uppercase letter, one lowercase letter, one Number & One Special Character");
        setSuccess(false)
        setShowPopup(true);
      }
    }
  };

  return (
    <div style={{ backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', color: 'white' ,height:'100vh' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <CssBaseline />
      {loading && <LoadingScreen />}
      <PopUpModel
              isOpen={showPopup}
              onClose={handlePopupClose}
              content={content}
              success={success}
            />
      <Grid container component="main">
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
            <Box component="form" onSubmit={(event) => {
              if (showOTPField) {
                handleOTPVerification(event);
              } else if (showNewPassword) {
                handleUpdatePassword(event);
              } else {
                handleCheckEmail(event);
              }
            }} sx={{ mt: 1 }}>
              <TextFieldComponent
                label="Email Address"
                value={username}
                type='text'
                onChange={(e) => setusername(e.target.value)}
                onBlur={handleEmailBlur}
                startAdornment={<IconButton disabled><EmailRounded style={{ color: '#707070' }} /></IconButton>}
                disabled={emailValid} // Disable email field if email is valid
              />
              {showOTPField && (
                <TextFieldComponent
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  startAdornment={<IconButton disabled><PasswordRounded style={{ color: '#707070' }} /></IconButton>}
                />
              )}
              {showNewPassword && (
                <>
                <TextFieldComponent
                  label="Update Password"
                  type="password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  startAdornment={<IconButton disabled><PasswordRounded style={{ color: '#707070' }} /></IconButton>}
                />
                {/* <TextFieldComponent
                  label="Confirm Password"
                  type="password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  startAdornment={<IconButton disabled><PasswordRounded style={{ color: '#707070' }} /></IconButton>}
                /> */}
                </>
              )}
              <ButtonComponent
                type="submit"
                fullWidth
                variant="contained"
                style={{ marginTop: '10px', marginBottom: '10px' }}
              >
                {showOTPField ? "Verify OTP" : showNewPassword ? "Update Password" : "Submit"}
              </ButtonComponent>
              <Grid container justifyContent="center">
                <Grid item>
                  <ButtonComponent variant='text' href='/Login'>Back To Login</ButtonComponent>
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
