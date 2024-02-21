import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface LinkInputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: string) => void;
}

const LinkInputPopup: React.FC<LinkInputPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [link, setLink] = useState('');
  const [Publiclink, setPublicLink] = useState('');
  const navigate = useNavigate()

  // Takeing User  Input for the URL
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handlePublicLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicLink(e.target.value);
  };

  // API Call For Checking User Data and Adding User Account
  const handleSubmit = async() => {
    try {

      const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
      if (idString !== null) {
        var id = parseInt(idString);
        console.log(link, Publiclink , id);

      const response = await axios.post(`${process.env.REACT_APP_Fast_API}/generate_access_token`, {
        authorization_code : link,
        publiclink : Publiclink,
        userid : id 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
    
      if (response.status === 200) {
        // Handle success, e.g., redirect to a success page or show a success message
        window.alert('Account Added Successfully');
        navigate("/Dashboard")
      } else {
        console.log(response.data);
        if (response.data) {
          if (response.status === 500) {
            window.alert(response.data.detail);
            navigate("/Dashboard")
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
      <DialogContent>
        <h2>Enter Link</h2>
        <Box marginBottom={2}>
          <TextField
            fullWidth
            label="Link"
            value={link}
            onChange={handleLinkChange}
            variant="outlined"
          />
        </Box>
        <Box marginBottom={2}>
          <TextField
            fullWidth
            label="Public Url"
            value={Publiclink}
            onChange={handlePublicLinkChange}
            variant="outlined"
          />
        </Box>
        <Button variant="contained" onClick={handleSubmit} fullWidth>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}

export default LinkInputPopup;
