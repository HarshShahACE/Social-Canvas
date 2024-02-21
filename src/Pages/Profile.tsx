import { Avatar, Button, Card, CardContent, CssBaseline, Grid, MenuItem, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import SideNav from "../Components/Navbar";
import { deepOrange } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import countries from '../assets/country.json';
import states from '../assets/states.json';

const isEmailValid = (email : any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const isPhoneNumberValid = (phoneNumber :any) => {
const phoneRegex = /^\d{10}$/; // Assumes 10-digit phone number, modify as needed
return phoneRegex.test(phoneNumber);
};

interface UserData {
  name: string,
  email: string,
  phone: string,
  country: string,
  state: string,
  gender: string,
  password: string
}

const Profile = () => {

  const isMobile = useMediaQuery('(max-width:600px)');
  type Country = keyof typeof states;

  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    gender: '',
    password: ''
  });

  const [country1, setcountry1] = useState<Country>('India');
  const [state1, setState1] = useState('');
  const [statesList, setStatesList] = useState<string[]>([]);
  const Home = useNavigate()
  const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

  const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
      if (idString !== null) {
        var id = parseInt(idString);
    }

  // API Call For Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_Fast_API}/profile?user_id=`+id, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          const jsonData = response.data;
          setFormData(jsonData);
          setcountry1(jsonData.country); // Set country from API data
          setState1(jsonData.state); // Set state from API data
          console.log(jsonData);
        } else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function

  }, []);

  // For Setting State According to Country
  useEffect(() => { 
    setStatesList(states[country1] || []);
  }, [country1]);

  const getInitials = (name: string): string => {
    if (!name) {
      return '';
    }
  
    const nameParts = name.split(' ');
    let initials = nameParts[0].charAt(0);
  
    if (nameParts.length > 1) {
      initials += nameParts[1].charAt(0);
    }
  
    return initials.toUpperCase();
  };

  // Handle Change On Data
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle Change On Country
  const handleCountryChange = (e: any) => {
    const selectedCountry = e.target.value as keyof typeof states;
    setcountry1(selectedCountry);
    setState1('');
    setStatesList(states[selectedCountry] || []);
    handleChange(e);
  };

  // Handle Chnage On State
  const handleStateChange = (e: any) => {
    const selectedState = e.target.value;
    setState1(selectedState);
    handleChange(e);
  };

  const handlecancel = () =>{
    setFormData({
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      gender: '',
      password: ''
    });
    window.location.reload()
  }

  // Save The Changes Of Data
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if  (formData.name === '' || formData.email === ''|| formData.phone === '' || formData.gender === '' || formData.country === '' || formData.state === ''){
        window.alert("Required Fields should not be empty")
      }else{
      if(isEmailValid(formData.email)){
        if(isPhoneNumberValid(formData.phone)){
            try {
              const response = await fetch(`${process.env.REACT_APP_Fast_API}/edit-profile?user_id=`+id, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name : formData.name,
                    email : formData.email,
                    phone : formData.phone,
                    country : formData.country,
                    state : formData.state,
                    gender : formData.gender,
                }),
              });
            
              if (response.ok) {
                // Handle success, e.g., redirect to a success page or show a success message
                window.alert('Profile Updated SuccessFull');
                Home("/Profile")
              } else {
                console.log(response.body);
                if (response.body) {
                  let data: any = await response.json();
                  console.log(data);
            
                  if (response.status === 400) {
                    if (data.detail === "Email already exists") {
                      window.alert('Email Already Registered Please Enter Another Email Address');
                    } else if (data.detail === "Phone number already exists") {
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
            alert("Please enter valid Phone number");
          }
        }
      else{
        alert("Please Enter Valid Email");
      }
    };
  }

    return(
      <>
        <div style={{ display: 'flex' , backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'bottom right'  , height:'100vh' }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <CssBaseline />
            {/* Sidebar */}
            <SideNav/>
            {/* Main content */}
            <div style={{ flex: 1  }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px' , marginLeft: isMobile? '20px' : '240px' }}>
                  <Grid container>
                    <Grid item xs={12} md={9}>
                      <Typography variant="h5" gutterBottom style={{ margin:'10px' }}>
                        User Profile
                      </Typography>
                      <Card sx={{ borderRadius: '20px', background: 'rgba(255, 255, 255 , 0.9)', fontWeight: 'bold' }}>
                        <CardContent sx={{ color: 'black', padding: '20px' }}>
                          <Grid container spacing={2} alignItems="flex-start">
                            {/* Avatar */}
                            <Grid item xs={12} sm={2}>
                              <Avatar
                                sx={{ bgcolor: deepOrange[500], height: 80, width: 80, margin: '15px' }}
                                alt={formData.name}
                              >
                                {getInitials(formData.name)}
                              </Avatar>
                            </Grid>

                            {/* Form Data */}
                            <Grid item xs={12} sm={9}>
                              <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                  {/* User Details */}
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                      Name
                                    </Typography>
                                    <TextField
                                      variant="outlined"
                                      fullWidth
                                      name="name"
                                      value={formData.name}
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                      Email
                                    </Typography>
                                    <TextField
                                      variant="outlined"
                                      fullWidth
                                      name="email"
                                      value={formData.email}
                                      onChange={handleChange}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                      Phone Number
                                    </Typography>
                                    <TextField
                                      variant="outlined"
                                      fullWidth
                                      name="phone"
                                      value={formData.phone}
                                      onChange={handleChange}
                                      InputProps={{
                                        inputProps:{
                                          maxLength : 10
                                        }
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                      Gender
                                    </Typography>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="gender"
                                      fullWidth
                                      label="Gender"
                                      name="gender"
                                      value={formData.gender}
                                      onChange={handleChange}
                                      style={{ textAlign: 'left' }}
                                    >
                                      <MenuItem value={'Male'}>Male</MenuItem>
                                      <MenuItem value={'Female'}>Female</MenuItem>
                                      <MenuItem value={'Other'}>Other</MenuItem>
                                    </Select>
                                  </Grid>

                                  {/* Select Country */}
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                      Country
                                    </Typography>
                                    <Select
                                      labelId="demo-simple-select-label-country"
                                      id="country"
                                      fullWidth
                                      label="Country"
                                      name="country"
                                      value={country1}
                                      onChange={handleCountryChange}
                                      style={{ textAlign: 'left' }}
                                    >
                                      <MenuItem value="">Select a country</MenuItem>
                                      {/* Replace countries with your data source for countries */}
                                      {countries.map((country) => (
                                        <MenuItem key={country} value={country}>
                                          {country}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Grid>

                                  {/* Select State */}
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                      State
                                    </Typography>
                                    <Select
                                      labelId="demo-simple-select-label-state"
                                      id="state"
                                      label="State"
                                      fullWidth
                                      name="state"
                                      value={state1}
                                      onChange={handleStateChange}
                                    >
                                      {!country1 && (
                                        <MenuItem value="">
                                          Select a country first
                                        </MenuItem>
                                      )}
                                      {statesList.map((state) => (
                                        <MenuItem key={state} value={state}>
                                          {state}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Grid>
                                </Grid>
                                <Grid item xs={12} style={{marginTop:'10px'}}>
                                  <Button type="submit" variant="contained" color="primary">
                                    Save
                                  </Button>
                                  <Button type="submit" onClick={handlecancel} variant="contained" color="primary" style={{marginLeft:'10px'}}>
                                    Cancel
                                  </Button>
                                </Grid>
                              </form>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </main>
            </div>
        </div>
      </>
    )
}

export default Profile;