import React, { useEffect, useState } from 'react';
import SideNav from '../Components/Common/Navbar';
import { Avatar, Box, CssBaseline, Typography, useMediaQuery } from '@mui/material';
import GrowthCard from '../Components/MainPage/MainPage_cards';
import SocialAccount from '../Components/MainPage/MainPage_Table';
import first from '../assets/Photos/1st.png'
import second from '../assets/Photos/2nd.png'
import third from '../assets/Photos/3rd.png'
import fourth from '../assets/Photos/4th.png'
import fifth from '../assets/Photos/5th.png'
import linkedin from '../assets/Photos/Linkedin.png'
import twitter from '../assets/Photos/twitter.jpg'
import facebook from '../assets/Photos/FBLogo.png'
import SelectComponent from '../Components/Fields/Selectfield';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { platforms } from '../Components/Common/platefroms';

// Plateform Selection Options
const options = [
  { value: 'linkedin', label: 'LinkedIn', avatar: linkedin },
  { value: 'facebook', label: 'Facebook', avatar: facebook },
  { value: 'twitter', label: 'Twitter', avatar: twitter },
];

export default function HomePage() {

  // Check for Phone View
  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

  // Selected Paterforms
  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [loading,setLoading]  = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (urlParamsString: string, publicurl: string) => {
      try {
        const idString = sessionStorage.getItem('Myid');
        if (idString !== null) {
          const id = parseInt(idString);
          console.log(urlParamsString, publicurl, id);
          const response = await axios.post(`${process.env.REACT_APP_Fast_API}/generate_linkedin_access_token`, {
            authorization_code: urlParamsString,
            publiclink: publicurl,
            userid: id
          }, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
  
          if (response.status === 200) {
            // Handle success, e.g., redirect to a success page or show a success message
            setLoading(false);
            window.alert('Account Added Successfully');
            navigate("/Dashboard");
          } else {
            console.log(response.data);
            if (response.data) {
              if (response.status === 500) {
                setLoading(false);
                window.alert(response.data.detail);
                navigate("/Dashboard");
              }
            }
          }
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };
  
    // Check if Lpublicurl is present in session storage
    
    const publicurl = sessionStorage.getItem("Lpublicurl");
    if (publicurl !== null) {
      // If Lpublicurl is present, convert URLSearchParams to string and call fetchData
      setLoading(true);
      const urlParams = window.location.href;
      fetchData(urlParams, publicurl);
    } else {
      console.log('Lpublicurl is not present in session storage. Skipping fetchData.');
    }
  }, []); // Empty dependency array to run once on component mount

  // Chnage On Selected Plaeform
  const handlePlatformChange = (event : string) => {
    setSelectedPlatform(event);
  };

  return (
    <div style={{ display: 'flex' ,backgroundColor:'#020202' ,backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain', width:'100%',
    backgroundRepeat:'no-repeat',
    backgroundPosition:'bottom right'  , height:'100vh' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <CssBaseline />
      {/* Sidebar */}
      <SideNav/>
      {/* Main content */}
      <div style={{ flex: 1  }}>
            <main style={{ flexGrow: 1, padding: 3, marginTop: '70px' , marginLeft: isMobile? '20px' : '240px'  }}>
            {/* Main content */}
              <div style={{marginLeft: "20px", justifyContent: "flex-start"}}>
                {/* Dropdown for selecting platform */}
                <Box display="flex" alignItems="center" mt={2}>
                  {platforms.map(platform => (
                    <Box key={platform.value} style={{ display: 'flex', alignItems: 'center',  backgroundColor: selectedPlatform === platform.value ? '#FFFFFF' : '#283141', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(67, 131, 197, 0.9)', marginRight: '20px' , padding:'5px' }}>
                      <Avatar style={{ cursor: 'pointer' }} onClick={() => handlePlatformChange(platform.value)}>
                        <img src={platform.imageUrl} alt={platform.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </Avatar>
                      <Typography variant="subtitle1" style={{ marginLeft: '5px', marginRight: '30px', fontSize: '18px', color: selectedPlatform === platform.value ? '#000000' : '#FFFFFF' }}>{platform.name}</Typography>
                    </Box>
                  ))}
                </Box>
                {/* Growth Cards */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "",
                    alignItems: "flex-start",
                    width:'80%'
                  }}
                >
                  {/* Conditional rendering of GrowthCard components based on selected platform */}
                  {selectedPlatform && (
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                      <GrowthCard platform={selectedPlatform} />
                    </div>
                  )}
                </div>
              </div>

              {/* Social Account Component */}
              <div style={{ margin: "20px 10px", justifyContent: "flex-start" }}>
                <SocialAccount />
              </div>
            </main>  
        </div>
    </div>
  );
}
