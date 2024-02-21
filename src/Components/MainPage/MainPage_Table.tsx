import React, { useState } from 'react';
import { Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogContent, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SocialMediaPopup from './SocialMediaPopup';
import LinkInputPopup from './LinkInput';

const SocialAccount = () => {

  // Handle For  Deleting An Account
  const handleDeleteClick = (id : any) => {
    // Handle delete click for a specific row
    console.log(`Delete clicked for ID: ${id}`);
  };

  // To Open POPUPS
  const [socialMediaPopupOpen, setSocialMediaPopupOpen] = useState(false);
  const [linkInputPopupOpen, setLinkInputPopupOpen] = useState(false);

  // Handle Select Plateform Popup open
  const handleSocialMediaPopupOpen = () => {
    setSocialMediaPopupOpen(true);
  };

  // Handle  Close Plateform Popup
  const handleCloseAllPopups = () => {
    setSocialMediaPopupOpen(false);
    setLinkInputPopupOpen(false);
  };

  // Handle Entering URL After Giving Access Of Linkedin
  const handleLinkSubmit = (link : any) => {
    // Call API with the submitted link
    console.log('Submitted link:', link);
    window.alert("Account Added Successfully")
    setSocialMediaPopupOpen(false);
    setLinkInputPopupOpen(false);
  };

  // Check For Selected Palteform And Redirect Particular Plateform  Page and Redirect In Site For Entering URL
  const handlePlatformSelectAndOpen = (platform : any) => {
    // Open link based on selected platform
    if(platform === ''){
      window.alert( "Please select a Social Media Platform" );
    } 
    else {
      switch (platform) {
        case 'linkedin':
          window.open(`${process.env.REACT_APP_LINKEDIN_API}`, '_blank');
          break
        case 'facebook':
          window.open('https://www.facebook.com', '_blank');
          break;
        case 'twitter':
          window.open('https://www.twitter.com', '_blank');
          break;
        // Add more cases for other platforms as needed
        default:
          break;
      }
      // Open the second popup after opening the link in a new tab
      setSocialMediaPopupOpen(false); // Close the first popup
      setLinkInputPopupOpen(true); // Open the second popup
      };
  }

  return (
    <>
    <Dialog open={socialMediaPopupOpen} onClose={handleCloseAllPopups}>
        <DialogContent>
          <SocialMediaPopup isOpen={socialMediaPopupOpen} onClose={handleCloseAllPopups} onSelect={handlePlatformSelectAndOpen} />
        </DialogContent>
      </Dialog>
      <Dialog open={linkInputPopupOpen} onClose={handleCloseAllPopups}>
        <DialogContent>
          <LinkInputPopup isOpen={linkInputPopupOpen} onClose={handleCloseAllPopups} onSubmit={handleLinkSubmit} />
        </DialogContent>
      </Dialog>
    <Card sx={{ maxWidth:'80%' , margin:'10px' , borderRadius:'20px' , padding:'20px' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Social Media Accounts</h2>
          <Button variant="contained" onClick={handleSocialMediaPopupOpen}>Add</Button>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell></TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Platform Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell><Avatar alt="User" src='test.jpg' /></TableCell>
                <TableCell>Harsh Shah</TableCell>
                <TableCell>Linkedin</TableCell>
                <TableCell>
                  <Button variant="contained" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(1)}>Delete</Button>
                </TableCell>
              </TableRow>
              {/* Add more rows here */}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
    </>
  );
};

export default SocialAccount;
