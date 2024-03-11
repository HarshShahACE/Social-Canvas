import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';
import ButtonComponent from '../Fields/Buttonfield';


interface LinkInputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: string) => void;
}

const TwitterLink: React.FC<LinkInputPopupProps> = ({ isOpen, onClose }) => {
  const [Publiclink, setPublicLink] = useState('');

  const handlePublicLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicLink(e.target.value);
  };

  // API Call For Checking User Data and Adding User Account
  const handleSubmit = () => {
      const url = sessionStorage.getItem("Twitter");
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
            const jsonData = response.data;
            console.log(jsonData);
            window.alert("Account Added Successfully");
          } else {
            console.log('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <h2>Enter Link</h2>
        <Box marginBottom={2}>
          <TextField
            fullWidth
            label="Public Url"
            value={Publiclink}
            onChange={handlePublicLinkChange}
            variant="outlined"
          />
          <Typography style={{marginTop:'10px'}}>Copy the Link After Authorization And Paste In Above Field.</Typography>
        </Box>
        <ButtonComponent variant="contained" onClick={handleSubmit} fullWidth>Submit</ButtonComponent>
      </DialogContent>
    </Dialog>
  );
}

export default TwitterLink;
