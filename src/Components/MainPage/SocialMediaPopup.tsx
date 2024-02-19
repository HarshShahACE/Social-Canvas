import React, { useState } from 'react';
import { Select, MenuItem, Button, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface SocialMediaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (platform: string) => void;
}

const SocialMediaPopup: React.FC<SocialMediaPopupProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');

  // Set The Selected Plateform
  const handlePlatformSelect = (e: SelectChangeEvent<string>) => {
    setSelectedPlatform(e.target.value);
  };

  // give Selected Plateform To  Parent Component
  const handleLinkOpen = () => {
    onSelect(selectedPlatform);
  };

  return (
    <div className={isOpen ? 'popup' : 'popup hidden'}>
      <div className="popup-inner">
        <h2>Select Social Media Platform</h2>
        <Box marginBottom={2}>
          <Select
            fullWidth
            value={selectedPlatform}
            onChange={handlePlatformSelect}
            variant="outlined"
          >
            <MenuItem value="">Select Platform</MenuItem>
            <MenuItem value="linkedin">Linkedin</MenuItem>
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
            {/* Add more options for other platforms as needed */}
          </Select>
        </Box>
        <Button variant="contained" onClick={handleLinkOpen}>Open Link</Button>
        <Button variant="contained" style={{margin:'10px'}} onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

export default SocialMediaPopup;
