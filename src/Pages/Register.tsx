import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import { useEffect, useState } from 'react';
import countries from '../Country/Country';
import states from '../Country/States';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { EmailRounded, LocationCityRounded, PasswordRounded, Person2Rounded } from '@mui/icons-material';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import axios from "axios";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        Social Canvas
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Register() {
        
  const [name1, setname] = useState('');
  const [email1, setemail] = useState('');
  const [phone1, setphone] = useState('');
  const [country1, setcountry] = useState('');
  const [state1, setstate] = useState('');
  const [gender1, setgender] = useState('');
  const [password1, setpassword] = useState('');
  const [confirmpassword , setconfirmpassword] = useState('');
  const [statesList, setStatesList] = useState<string[]>([]);
  const Home = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGenderChange = (e : any) => {
    setgender(e.target.value);
  };

  const handleCountryChange = (e : any) => {
    setcountry(e.target.value);
  };

  const handleStateChange = (e : any) => {
    setstate(e.target.value);
  }

  useEffect(() => {
    // Update statesList when the selected country changes
    setStatesList(states[country1] || []);
    setstate(''); // Reset selected state when country changes
  }, [country1]);

  // Validation Start
  // Check Email Validation
  const isEmailValid = (email : any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
        // Set Email on Chnage
        const handleemailChange = (e : any) => {
          setemail(e.target.value);
        };

        // Check On Field When field is leave
        const handleemailBlur = () => {
        if(email1 !== ''){ 
          if(!isEmailValid(email1)){
            window.alert("Please enter a valid Email ID");
          };
        };
      }
  
  // Check Phone Validation
  const isPhoneNumberValid = (phoneNumber :any) => {
    const phoneRegex = /^\d{10}$/; // Assumes 10-digit phone number, modify as needed
    return phoneRegex.test(phoneNumber);
  };

    // Set Phone on Chnage
    const handlephoneChange = (e : any) => {
      setphone(e.target.value);
    };

    // Check On Field When field is leave
    const handlephoneBlur = () => {
      if(phone1 !== ''){
      if(!isPhoneNumberValid(phone1)){
        window.alert("Please enter valid Phone number");
      };
    };
  }

  // Check Password Validation
  const isPasswordValid = (password :any) => {
    // Requires at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

      // Set Phone on Chnage
    const handlepasswordChange = (e : any) => {
      setpassword(e.target.value);
    };

    // Check On Field When field is leave
    const handlepasswordBlur = () => {
      if(password1 !== ''){
      if(!isPasswordValid(password1)){
        window.alert("Please enter valid Password");
      };
    };
  }

          // Set Phone on Chnage
          const handlecpasswordChange = (e : any) => {
            setconfirmpassword(e.target.value);
          };

          // Check On Field When field is leave
          const handlecpasswordBlur = () => {
            if(confirmpassword !== ''){
              if(password1 !==  confirmpassword){
                window.alert("Password And Confirm Password Must Be Same");
              };
            };
          }

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(name1==='' || email1==='' || password1 ==='' ||country1==='' || state1 === '' || phone1==='' || gender1 ===''){
          window.alert("Required Fields should not be empty")
        }else{
        if(isEmailValid(email1)){
          if(isPhoneNumberValid(phone1)){
            if(isPasswordValid(password1)) {
              try {
                const response = await axios.post('http://127.0.0.1:8000/create', {
                  name: name1,
                  email: email1,
                  phone: phone1,
                  country: country1,
                  state: state1,
                  gender: gender1,
                  password: password1,
                }, {
                  headers: {
                    'Content-Type': 'application/json',
                  }
                });
              
                if (response.status === 200) {
                  // Handle success, e.g., redirect to a success page or show a success message
                  window.alert('Registration Successful');
                  Home("/Login");
                  console.log('Registration successful!');
                } else {
                  console.log(response.data);
                  if (response.data) {
                    if (response.status === 400) {
                      if (response.data.detail === "Email already exists") {
                        window.alert('Email Already Registered Please Enter Another Email Address');
                      } else if (response.data.detail === "Phone number already exists") {
                        window.alert('Phone Number Already Registered Please Enter Another Phone Number');
                      } else {
                        // Handle other 400 status cases if needed
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('Error occurred:', error);
              }           
            }
            else{
              alert("Please make sure your Password Have 8 Characters Which contains at least one uppercase letter, one lowercase letter, one Number & One Sepcial Character")
            }
          }
          else{
            alert("Please enter valid Phone number");
          }
        }
        else{
          alert("Please Enter Valid Email");
        }
      }
      };

  return (
    <div style={{ backgroundImage: 'url(../SitePhotos/Test32.png)', backgroundSize:'cover'}}>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <Grid container component="main" sx={{}}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square style={{border:'none', 
      margin:'20px' , borderRadius:'20px' , background:'rgba(255, 255, 255, 0.7)'}}>
        <Box
          sx={{
            my: 4,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{display: 'flex',flexDirection: 'row',alignItems: 'center',}}>
            <Avatar sx={{ alignContent:'start', bgcolor:'primary.main' }}>
              <HowToRegOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" style={{marginLeft:'10px'}}>
              Register
            </Typography>
          </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt : 1}}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={(e) => setname(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton disabled>
                        <Person2Rounded style={{color:'#707070'}} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="phone"
                autoFocus
                onChange={handlephoneChange}
                onBlur={handlephoneBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton disabled>
                      <ContactPhoneRoundedIcon style={{color:'#707070'}} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  inputProps:{
                    maxLength : 10
                  }
                }}
                />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleemailChange}
                onBlur={handleemailBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton disabled>
                        <EmailRounded style={{color:'#707070'}} />
                      </IconButton>
                    </InputAdornment>
                  )
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
                onChange={handlepasswordChange}
                onBlur={handlepasswordBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton disabled>
                        <PasswordRounded style={{color:'#707070'}} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <p style={{ textAlign: 'left', fontSize: 12 , marginBottom: 0 , marginTop:0 }}>
                Password Field Contains at least 8 character : 1 UpperCase , 1 LowerCase </p>
              <p style={{ textAlign: 'left', fontSize: 12 , marginTop: 0 , marginBottom:0}}> 1 Number , 1 Special Character</p>
              <TextField
                margin="normal"
                fullWidth
                name="confirmpassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirm password"
                autoComplete="current-password"
                onChange={handlecpasswordChange}
                onBlur={handlecpasswordBlur}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton disabled>
                          <PasswordRounded style={{color:'#707070'}} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              
              {/*Select Gender*/}
              <FormControl fullWidth style={{marginTop:10}}>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="gender"
                  label="Gender"
                  name="gender"
                  onChange={handleGenderChange}
                  style={{ textAlign: 'left'}}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconButton>
                        <PersonRoundedIcon style={{color:'#707070'}}/>
                      </IconButton>
                    </InputAdornment>
                  }
              >
                  <MenuItem value={'Male'}>Male</MenuItem>
                  <MenuItem value={'Female'}>Female</MenuItem>
                  <MenuItem value={'Other'}>Other</MenuItem>
              </Select>
          </FormControl>


              {/*Address Field*/}
              <Grid container spacing={2} mt={0.2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="country"
                    label="Country"
                    name="country"
                    onChange={handleCountryChange}
                    style={{ textAlign: 'left'}}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton>
                          <PublicRoundedIcon style={{color:'#707070'}} />
                        </IconButton>
                      </InputAdornment>
                    }
                >
                    <MenuItem value="">Select a country</MenuItem>
                      {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                      ))}
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                    <div>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">State</InputLabel>
                        <Select
                          id="state"
                          value={state1}
                          onChange={handleStateChange}
                          label="State"
                          startAdornment={
                            <InputAdornment position="start">
                              <IconButton>
                                <LocationCityRounded style={{color:'#707070'}}/>
                              </IconButton>
                            </InputAdornment>
                          }
                        >
                          {!country1 && (
                            <MenuItem value="">
                              Select a state
                            </MenuItem>
                          )}
                          {
                            statesList.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                          
                        </Select>
                      </FormControl>
                    </div>
              </Grid>
              </Grid>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="I Agree to the Terms and Conditions"
                sx={{ display: 'flex', alignItems: 'center', marginLeft: '-8px', mt:2}}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Button href='/Login' style={{textAlign:'end'}}>Already Have An Account? Sign In</Button>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 1 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}