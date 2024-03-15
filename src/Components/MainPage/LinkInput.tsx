import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Box, Typography } from '@mui/material';
import LinkedInguide from '../../assets/Photos/Linkedin_Guide.png';
import ButtonComponent from '../Fields/Buttonfield';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Common/Loading';


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
    try {
      const idString = sessionStorage.getItem('Myid');
      if (idString !== null) {
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
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      {loading?? <LoadingScreen/>}
      <DialogContent>
        <h2>Enter Link</h2>
        <Box marginBottom={2}>
        <TextField
            fullWidth
            label="Public Url"
            value={authlink}
            onChange={handleauthlinkchange}
            variant="outlined"
          />
          <Typography style={{marginTop:'10px'}}>Copy Url After Successful Login in Linkedin</Typography>
          <TextField
            fullWidth
            label="Public Url"
            value={Publiclink}
            onChange={handlePublicLinkChange}
            variant="outlined"
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
