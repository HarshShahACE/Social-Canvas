import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IconButton, Paper } from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import { useEffect, useState } from 'react';
import countries from '../assets/country.json';
import states from '../assets/states.json';
import { Link, useNavigate } from 'react-router-dom';
import { EmailRounded, PasswordRounded, Person2Rounded } from '@mui/icons-material';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import axios, { AxiosError } from "axios";
import { isEmailValid , isPhoneNumberValid , isPasswordValid } from '../utils/validation';
import Copyright from '../Components/Common/Copyright';
import TextFieldComponent from '../Components/Fields/Textfield';
import SelectComponent from '../Components/Fields/Selectfield';
import { LocationCity } from '@mui/icons-material';
import ButtonComponent from '../Components/Fields/Buttonfield';
import LoadingScreen from '../Components/Common/Loading';
import CallIcon from '@mui/icons-material/Call';
import PopUpModel from '../Components/Common/PopupModel';

export default function Register() {

  // Define the type for the selected country
  type Country = keyof typeof states;

  // Variable Declaration
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
  const [loading,setloading] = useState(false);
  const [content,setcontent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [sucess,setSuccess] = useState(Boolean);

   // For Closing No Data PopUp
   const handlePopupClose = () => {
    setShowPopup(false);
  };

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

  // Check On Email Field When field is left
  const handleemailBlur = () => {
    if(email1 !== ''){ 
      if(!isEmailValid(email1)){
        setcontent("Please enter a valid Email ID");
        setSuccess(false);
        setShowPopup(true);
      };
    };
  }

  // Check On Phone Number Field When field is left
  const handlephoneBlur = () => {
    if(phone1 !== ''){
      if(!isPhoneNumberValid(phone1)){
        setcontent("Please enter valid Phone number");
        setSuccess(false);
        setShowPopup(true);
      };
    };
  }

  // Check On Password Field When field is left
  const handlepasswordBlur = () => {
    if(password1 !== ''){
      if(!isPasswordValid(password1)){
        setcontent("Please enter valid Password");
        setSuccess(false);
        setShowPopup(true);
      };
    };
  }

  // Check Confirm Password On Field When field is left
  const handlecpasswordBlur = () => {
    if(confirmpassword !== ''){
      if(password1 !==  confirmpassword){
        setcontent("Password And Confirm Password Must Be Same");
        setSuccess(false);
        setShowPopup(true);
      };
    };
  }

  // On Submit 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const agreeCheckbox = document.querySelector<HTMLInputElement>('input[type="checkbox"][value="Agree"]');
    if (!agreeCheckbox || !agreeCheckbox.checked) {
      setcontent("Please agree to the Terms and Conditions before Registering.");
      setSuccess(false);
      setShowPopup(true);
      return; // Exit the function early if terms are not agreed
    }
    if(name1==='' || email1==='' || password1 ==='' || phone1==='' || state1 === ''  || gender1 ===''){
      setcontent("Required Fields should not be empty")
      setSuccess(false);
      setShowPopup(true);
    }else{
    if(isEmailValid(email1)){
      if(isPhoneNumberValid(phone1)){
        if(isPasswordValid(password1)) {
          try {
            setloading(true);
            //Api Call
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
              setcontent('Registration Successful');
              setShowPopup(true);
              setSuccess(true);
              setloading(false);
              Home("/Login");
              console.log('Registration successful!');
            } else {
              console.log(response.data);
              if (response.data) {
                if (response.status === 400) {
                  setloading(false);
                  setcontent(response.data.detail);
                  setSuccess(true);
                  setShowPopup(true);
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
                  setcontent(detail);
                  setSuccess(false);
                  setShowPopup(true);
                  setloading(false)
                }
              } else {
                setloading(false);
                console.error('Error occurred:', axiosError);
                setcontent('Registration failed. Please try again later.');
                setSuccess(false);
                setShowPopup(true);
              }
            }
          }
        }
        else{
          setcontent("Please make sure your Password Have 8 Characters Which contains at least one uppercase letter, one lowercase letter, one Number & One Sepcial Character")
          setSuccess(false);
          setShowPopup(true);
        }
      }
      else{
        setcontent("Please enter valid Phone number");
        setSuccess(false);
        setShowPopup(true);
      }
    }
    else{
      setcontent("Please Enter Valid Email");
      setSuccess(false);
      setShowPopup(true);
    }
  }
  };

  return (
    <div style={{ backgroundImage: `url(${defaultImagePath})`, backgroundSize:'cover'}}>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    {loading && <LoadingScreen />}
    <PopUpModel
        isOpen={showPopup}
        onClose={handlePopupClose}
        content={content}
        success={sucess}
      />
    <Grid container component="main" sx={{}}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square style={{border:'none', 
      margin:'20px' , borderRadius:'20px' , background: 'rgba(225, 225, 225, 0.7)'}}>
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
              startAdornment={<IconButton disabled><Person2Rounded style={{ color: '#707070' }} /></IconButton>}
            />
            <TextFieldComponent
              type='tel'
              label="Phone Number"
              value={phone1}
              onChange={e=>setphone(e.target.value)}
              onBlur={handlephoneBlur}
              startAdornment={<IconButton disabled><CallIcon style={{color:'#707070'}} /></IconButton>}
              maxLength={10}
            />
            <TextFieldComponent
              label="Email Address"
              value={email1}
              onChange={e=>setemail(e.target.value)}
              onBlur={handleemailBlur}
              startAdornment={<IconButton disabled><EmailRounded style={{color:'#707070'}} /></IconButton>}
            />
            <TextFieldComponent
              label="Password"
              type='password'
              value={password1}
              onChange={e=>setpassword(e.target.value)}
              onBlur={handlepasswordBlur}
              startAdornment={<IconButton><PasswordRounded style={{color:'#707070'}} /></IconButton>}
              suggestion='8 character: 1 UC(A-Z), 1 LC(a-z), 1 Number(0-9), 1 SC(@,#,$..)'
            />
            <TextFieldComponent
            label="Confirm Password"
            type='password'
            value={confirmpassword}
            onChange={e=>setconfirmpassword(e.target.value)}
            onBlur={handlecpasswordBlur}
            startAdornment={<IconButton><PasswordRounded style={{color:'#707070'}} /></IconButton>}
            />
              
            {/*Select Gender*/}
            <div style={{marginTop:'10px'}}>
              <SelectComponent
                label="Gender"
                value={gender1}
                onChange={e=>setgender(e)}
                startAdornment={
                  <IconButton>
                    <Person2Rounded style={{ color: '#707070' }} />
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
                  startAdornment={<IconButton><PublicRoundedIcon style={{ color: '#707070' }} /></IconButton>}
                  options={countries.map((country) => ({ value: country, label: country }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectComponent
                  label="State"
                  value={state1}
                  onChange={handleStateChange}
                  startAdornment={<IconButton><LocationCity style={{ color: '#707070' }} /></IconButton>}
                  options={statesList.map((state) => ({ value: state, label: state }))}
                />
              </Grid>
            </Grid>
              <FormControlLabel
                control={<Checkbox value="Agree" color="primary" />}
                label="I Agree to the Terms and Conditions"
                sx={{ display: 'flex', alignItems: 'center', marginLeft: '-8px', mt:2}}
              />
              <ButtonComponent type="submit" variant="contained" fullWidth style={{ marginTop: '10px', marginBottom: '10px' }}>
                Register
              </ButtonComponent>
              <Grid container>
                <Grid item>
                  <ButtonComponent style={{textAlign:'end'}} variant='text'>
                    <Link to="/Login">
                    Already Have An Account? Sign In
                    </Link>
                  </ButtonComponent>
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
