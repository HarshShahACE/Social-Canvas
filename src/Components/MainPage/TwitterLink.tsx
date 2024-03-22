import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Box, Typography, IconButton } from '@mui/material';
import axios from 'axios';
import ButtonComponent from '../Fields/Buttonfield';
import { Close } from '@mui/icons-material';
import LoadingScreen from '../Common/Loading';


interface LinkInputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: string) => void;
}

const TwitterLink: React.FC<LinkInputPopupProps> = ({ isOpen, onClose }) => {
  const [Publiclink, setPublicLink] = useState('');
  const [loading,setloading] = useState(false);

  const handlePublicLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicLink(e.target.value);
  };

  // API Call For Checking User Data and Adding User Account
  const handleSubmit = () => {
    if (Publiclink.trim() === '') {
      // Handle validation error, fields are empty
      window.alert('Please fill in all required fields');
      return;
    }
      const url = sessionStorage.getItem("Twitter");
      setloading(true);
      const idString = sessionStorage.getItem("Myid");
        if(idString !== null){
            var id = parseInt(idString);
        }
      const fetchData = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_Fast_API}/generate_twitter_access_token`, {
                callback_url: url,
                redirect_url: Publiclink,
                userid: id,
              }, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });
          if (response.status === 200) {
            window.alert("Account Added Successfully");
            setloading(false);
            window.location.reload()
          } else {
            console.log('Error:', response.statusText);
            setloading(false);
            window.location.reload()
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setloading(false);
          window.alert("Account Add Failed, Try After Some Time");
          window.location.reload()
        }
      };
  
      fetchData();
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
            label="Public Url"
            value={Publiclink}
            onChange={handlePublicLinkChange}
            variant="outlined"
            required
          />
          <Typography style={{marginTop:'10px'}}>Copy the Link After Authorization And Paste In Above Field.</Typography>
        </Box>
        <ButtonComponent variant="contained" onClick={handleSubmit} fullWidth>Submit</ButtonComponent>
      </DialogContent>
    </Dialog>
  );
}

export default TwitterLink;
