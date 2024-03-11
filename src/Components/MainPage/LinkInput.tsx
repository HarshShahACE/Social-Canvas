import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Box, Typography } from '@mui/material';
import LinkedInguide from '../../assets/Photos/Linkedin_Guide.png';
import ButtonComponent from '../Fields/Buttonfield';


interface LinkInputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: string) => void;
}

const LinkInputPopup: React.FC<LinkInputPopupProps> = ({ isOpen, onClose }) => {
  const [Publiclink, setPublicLink] = useState('');

  const handlePublicLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicLink(e.target.value);
  };

  // API Call For Checking User Data and Adding User Account
  const handleSubmit = () => {
      sessionStorage.setItem("Lpublicurl", Publiclink);
      window.open(`${process.env.REACT_APP_LINKEDIN_API}`, '_self');
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
          <Typography style={{marginTop:'10px'}}>Go To Your Profile And Copy Link Shown in below Image Copy That link and Paste in above Field.</Typography>
          <img src={LinkedInguide} alt='Linkedin' style={{marginTop:'10px'}}></img>
        </Box>
        <ButtonComponent variant="contained" onClick={handleSubmit} fullWidth>Submit</ButtonComponent>
      </DialogContent>
    </Dialog>
  );
}

export default LinkInputPopup;
