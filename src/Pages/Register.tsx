import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IconButton, Paper} from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import { useEffect, useState } from 'react';
import countries from '../assets/country.json';
import states from '../assets/states.json';
import { useNavigate } from 'react-router-dom';
import { EmailRounded, PasswordRounded, Person2Rounded } from '@mui/icons-material';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import axios, { AxiosError } from "axios";
import { isEmailValid , isPhoneNumberValid , isPasswordValid } from '../utils/validation';
import Copyright from '../Components/Common/Copyright';
import TextFieldComponent from '../Components/Fields/Textfield';
import SelectComponent from '../Components/Fields/Selectfield';
import { LocationCity } from '@mui/icons-material';
import ButtonComponent from '../Components/Fields/Buttonfield';

export default function Register() {

  type Country = keyof typeof states;
        
  const [name1, setname] = useState('');
  const [email1, setemail] = useState('');
  const [phone1, setphone] = useState('');
  const [country1, setcountry] = useState<Country>('India');
  const [state1, setstate] = useState('');
  const [gender1, setgender] = useState('');
  const [password1, setpassword] = useState('');
  const [confirmpassword , setconfirmpassword] = useState('');
  const [statesList, setStatesList] = useState<string[]>([]);
  const Home = useNavigate();
  const defaultImagePath = process.env.REACT_APP_DEFAULT_AUTHENTICATION_IMAGE;

  useEffect(() => {
    // Update statesList when the selected country changes
    setStatesList(states[country1] || []);
    setstate(''); // Reset selected state when country changes
  }, [country1]);
  
  // Modify the handleCountryChange function to set the selected country
  const handleCountryChange = (e : string) => {
    const selectedCountry = countries.find(country => country === e);
    setcountry(selectedCountry as Country);
  };
  
  // Modify the handleStateChange function to set the selected state
  const handleStateChange = (e : string) => {
    const selectedState = e;
    setstate(selectedState);
  };

  
  // Check Email Validation
    // Check On Email Field When field is leave
  const handleemailBlur = () => {
    if(email1 !== ''){ 
      if(!isEmailValid(email1)){
        window.alert("Please enter a valid Email ID");
      };
    };
  }
  
  // Check Phone Validation
  // Check On Phone Number Field When field is leave
  const handlephoneBlur = () => {
    if(phone1 !== ''){
      if(!isPhoneNumberValid(phone1)){
        window.alert("Please enter valid Phone number");
      };
    };
  }

  // Check Password Validation
  // Check On Password Field When field is leave
  const handlepasswordBlur = () => {
    if(password1 !== ''){
      if(!isPasswordValid(password1)){
        window.alert("Please enter valid Password");
      };
    };
  }

  // Check Confirm Password On Field When field is leave
  const handlecpasswordBlur = () => {
    if(confirmpassword !== ''){
      if(password1 !==  confirmpassword){
        window.alert("Password And Confirm Password Must Be Same");
      };
    };
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(name1==='' || email1==='' || password1 ==='' || state1 === '' || phone1==='' || gender1 ===''){
      window.alert("Required Fields should not be empty")
    }else{
    if(isEmailValid(email1)){
      if(isPhoneNumberValid(phone1)){
        if(isPasswordValid(password1)) {
          try {
            const response = await axios.post(`${process.env.REACT_APP_Fast_API}/create`, {
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
                  window.alert(response.data.detail)
                }
              }
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
                window.alert('Registration failed. Please try again later.');
              }
            }
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
    <div style={{ backgroundImage: `url(${defaultImagePath})`, backgroundSize:'cover'}}>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <Grid container component="main" sx={{}}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square style={{border:'none', 
      margin:'20px' , borderRadius:'20px' , background:'#191C24'}}>
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
            <TextFieldComponent
              label="Name"
              value={name1}
              onChange={(e) => setname(e.target.value)}
              startAdornment={<IconButton disabled><Person2Rounded style={{ color: '#FFFFFF' }} /></IconButton>}
            />
            <TextFieldComponent
              label="Phone Number"
              value={phone1}
              onChange={e=>setphone(e.target.value)}
              onBlur={handlephoneBlur}
              startAdornment={<IconButton disabled><ContactPhoneRoundedIcon style={{color:'#FFFFFF'}} /></IconButton>}
              maxLength={10}
            />
            <TextFieldComponent
              label="Email Address"
              value={email1}
              onChange={e=>setemail(e.target.value)}
              onBlur={handleemailBlur}
              startAdornment={<IconButton disabled><EmailRounded style={{color:'#FFFFFF'}} /></IconButton>}
            />
            <TextFieldComponent
              label="Password"
              type='password'
              value={password1}
              onChange={e=>setpassword(e.target.value)}
              onBlur={handlepasswordBlur}
              startAdornment={<IconButton><PasswordRounded style={{color:'#FFFFFF'}} /></IconButton>}
            />
            <p style={{ textAlign: 'left', fontSize: 12 , marginBottom: 0 , marginTop:0 }}>
              Password Field Contains at least 8 character : 1 UpperCase , 1 LowerCase </p>
            <p style={{ textAlign: 'left', fontSize: 12 , marginTop: 0 , marginBottom:0}}> 1 Number , 1 Special Character</p>
            <TextFieldComponent
            label="Confirm Password"
            type='password'
            value={confirmpassword}
            onChange={e=>setconfirmpassword(e.target.value)}
            onBlur={handlecpasswordBlur}
            startAdornment={<IconButton><PasswordRounded style={{color:'#FFFFFF'}} /></IconButton>}
            />
              
            {/*Select Gender*/}
            <div style={{marginTop:'10px'}}>
              <SelectComponent
                label="Gender"
                value={gender1}
                onChange={e=>setgender(e)}
                startAdornment={
                  <IconButton>
                    <PersonRoundedIcon style={{ color: '#FFFFFF' }} />
                  </IconButton>
                }
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
            </div>
            {/*Address Field*/}
            <Grid container spacing={2} mt={0.2}>
              <Grid item xs={12} sm={6}>
                <SelectComponent
                  label="Country"
                  value={country1}
                  onChange={handleCountryChange}
                  startAdornment={<IconButton><PublicRoundedIcon style={{ color: '#FFFFFF' }} /></IconButton>}
                  options={countries.map((country) => ({ value: country, label: country }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectComponent
                  label="State"
                  value={state1}
                  onChange={handleStateChange}
                  startAdornment={<IconButton><LocationCity style={{ color: '#FFFFFF' }} /></IconButton>}
                  options={statesList.map((state) => ({ value: state, label: state }))}
                />
              </Grid>
            </Grid>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="I Agree to the Terms and Conditions"
                sx={{ display: 'flex', alignItems: 'center', marginLeft: '-8px', mt:2}}
              />
              <ButtonComponent type="submit" variant="contained" fullWidth style={{ marginTop: '10px', marginBottom: '10px' }}>
                register
              </ButtonComponent>
              <Grid container>
                <Grid item>
                  <ButtonComponent href='/Login' style={{textAlign:'end'}} variant='text'>Already Have An Account? Sign In</ButtonComponent>
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