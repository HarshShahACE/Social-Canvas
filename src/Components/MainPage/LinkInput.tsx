import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, Button, Box } from '@mui/material';

interface LinkInputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: string) => void;
}

const LinkInputPopup: React.FC<LinkInputPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [link, setLink] = useState('');

  // Takeing User  Input for the URL
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  // API Call For Checking User Data and Adding User Account
  const handleSubmit = () => {
    onSubmit(link);
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
        <Button variant="contained" onClick={handleSubmit} fullWidth>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}

export default LinkInputPopup;
