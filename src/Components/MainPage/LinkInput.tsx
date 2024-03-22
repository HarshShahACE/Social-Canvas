import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Box, Typography, IconButton } from '@mui/material';
import LinkedInguide from '../../assets/Photos/Linkedin_Guide.png';
import ButtonComponent from '../Fields/Buttonfield';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Common/Loading';
import { Close } from '@mui/icons-material';


interface LinkInputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: string) => void;
}

const LinkInputPopup: React.FC<LinkInputPopupProps> = ({ isOpen, onClose }) => {
  const [authlink , setauthlink] = useState('');
  const [Publiclink, setPublicLink] = useState('');
  const [loading,setLoading]  = useState(false);
  const navigate = useNavigate();

  const handlePublicLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicLink(e.target.value);
  };

  const handleauthlinkchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setauthlink(e.target.value);
  };

  // API Call For Checking User Data and Adding User Account
  const handleSubmit = async() => {
    if (authlink.trim() === '' || Publiclink.trim() === '') {
      // Handle validation error, fields are empty
      window.alert('Please fill in all required fields');
      return;
    }
    try {
      const idString = sessionStorage.getItem('Myid');
      if (idString !== null) {
        setLoading(true);
        const id = parseInt(idString);
        const response = await axios.post(`${process.env.REACT_APP_Fast_API}/generate_linkedin_access_token`, {
          authorization_code: authlink,
          publiclink: Publiclink,
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
      window.alert("Account Add Failed , Please try After Some Time");
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
      {loading?? <LoadingScreen/>}
        <div style={{display:'flex' , justifyContent:'space-between'}}>
          <h2>Enter Link</h2>
          <IconButton onClick={onClose} style={{marginLeft:'20px'}}> 
            <Close />
          </IconButton>
        </div>
        <Box marginBottom={2}>
        <TextField
            fullWidth
            label="Authentication Url"
            value={authlink}
            onChange={handleauthlinkchange}
            variant="outlined"
            required
          />
          <Typography style={{marginTop:'10px'}}>Copy Url After Successful Login in Linkedin</Typography>
          <TextField
            fullWidth
            label="Public Url"
            value={Publiclink}
            onChange={handlePublicLinkChange}
            variant="outlined"
            style={{marginTop:'20px'}}
            required
          />
          <Typography style={{marginTop:'10px'}}>Go To Your Profile And Copy Link Shown in below Image Copy That link and Paste in above Field.</Typography>
          <img src={LinkedInguide} alt='Linkedin' style={{marginTop:'10px'}}></img>
        </Box>
        <ButtonComponent variant="contained" onClick={handleSubmit} fullWidth>Submit</ButtonComponent>
      </DialogContent>
    </Dialog>
  );
}

export default LinkInputPopup;
