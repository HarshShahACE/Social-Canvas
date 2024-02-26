import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogContent, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SocialMediaPopup from './SocialMediaPopup';
import LinkInputPopup from './LinkInput';
import axios from 'axios';
import LoadingScreen from '../Loading';

interface SocialAccountData { 
  username: string;
  profile_pic_url: string;
  platform: string;
}


const SocialAccount = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string[]>([]);
  const [userPic, setUserPic] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const idString = sessionStorage.getItem('Myid');
      if (idString !== null) {
        const id = parseInt(idString);
        try {
          const timeoutId = setTimeout(() => {
            setLoading(false);
          }, 2000);

          const response = await axios.post(`${process.env.REACT_APP_Fast_API}/s_account_list?user_id=`+id, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          clearTimeout(timeoutId);
          if (response.status === 200) {
            const jsonData = response.data;
            if (Array.isArray(jsonData)) {
              setUsername(jsonData.map((item: SocialAccountData) => item.username));
              setUserPic(jsonData.map((item: SocialAccountData) => item.profile_pic_url));
              setPlatform(jsonData.map((item: SocialAccountData) => item.platform));
            } else {
              setUsername([jsonData.username]);
              setUserPic([jsonData.profile_pic_url]);
              setPlatform([jsonData.platform]);
            setLoading(false);
          }
        } else {
            console.log('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (index: number) => {
    // Handle delete click for a specific row
    console.log(`Delete clicked for index: ${index}`);
  };

  const [socialMediaPopupOpen, setSocialMediaPopupOpen] = useState(false);
  const [linkInputPopupOpen, setLinkInputPopupOpen] = useState(false);

  const handleSocialMediaPopupOpen = () => {
    setSocialMediaPopupOpen(true);
  };

  const handleCloseAllPopups = () => {
    setSocialMediaPopupOpen(false);
    setLinkInputPopupOpen(false);
  };

  const handleLinkSubmit = (link : any) => {
    console.log('Submitted link:', link);
    window.alert("Account Added Successfully");
    setSocialMediaPopupOpen(false);
    setLinkInputPopupOpen(false);
  };

  const handlePlatformSelectAndOpen = (platform : any) => {
    if (platform === '') {
      window.alert("Please select a Social Media Platform");
    } else {
      switch (platform) {
        case 'linkedin':
          window.open(`${process.env.REACT_APP_LINKEDIN_API}`, '_blank');
          break;
        case 'facebook':
          window.open('https://www.facebook.com', '_blank');
          break;
        case 'twitter':
          window.open('https://www.twitter.com', '_blank');
          break;
        default:
          break;
      }
      setSocialMediaPopupOpen(false);
      setLinkInputPopupOpen(true);
    }
  }

  console.log(username,userPic,platform)

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
      {loading && <LoadingScreen />}
      <Card sx={{ maxWidth:'80%' , margin:'10px' , borderRadius:'20px' , padding:'20px' , background: 'rgba(255, 255, 255 , 0.8)' }}>
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
                {username.length > 0 ? (
                  username.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell><Avatar alt="User" src={userPic[index]} /></TableCell>
                      <TableCell>{user}</TableCell>
                      <TableCell>{platform[index]}</TableCell>
                      <TableCell>
                        <Button variant="contained" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(index)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center', color: 'red' }}>No data found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default SocialAccount;
