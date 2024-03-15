import React from 'react';
import { Box, IconButton } from '@mui/material';
import { LinkedIn, Twitter, Close } from '@mui/icons-material';
import ButtonComponent from '../Fields/Buttonfield';

interface SocialMediaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (platform: string) => void;
}

const SocialMediaPopup: React.FC<SocialMediaPopupProps> = ({ isOpen, onClose, onSelect }) => {

  // Give Selected Platform To Parent Component
  const handleLinkOpen = (platform: string) => {
    if (platform !== '') {
      onSelect(platform);
    }
  };

  const handlePopupClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <div className={isOpen ? 'popup' : 'popup hidden'} onClick={handlePopupClick}>
      <div className="popup-inner">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h2>Select Social Media Platform</h2>
          <IconButton onClick={onClose} style={{marginLeft:'20px'}}> 
          <Close />
        </IconButton>
        </Box>
        <Box marginBottom={2} display="flex">
          <ButtonComponent onClick={() => handleLinkOpen('linkedin')}>
            <LinkedIn />
          </ButtonComponent>
          <ButtonComponent onClick={() => handleLinkOpen('twitter')} style={{marginLeft:'10px'}}>
            <Twitter />
          </ButtonComponent>
          {/* Add more icon buttons for other platforms as needed */}
        </Box>
      </div>
    </div>
  );
}

export default SocialMediaPopup;
