import React, { useEffect, useState } from 'react';
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogContent, Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoadingScreen from '../Common/Loading';
import axios from 'axios';
import SocialMediaPopup from './SocialMediaPopup';
import LinkInputPopup from './LinkInput';
import TwitterLink from './TwitterLink';
import ButtonComponent from '../Fields/Buttonfield';

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
              setLoading(false);
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

  const handleDeleteClick = async () => {
    // Handle delete click for a specific row
    const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
    if (idString !== null) {
      const id = parseInt(idString);
      // Display confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete your account?');
      if (confirmed) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_Fast_API}/s_account_remove?user_id=${id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 200) {
            // Handle success, e.g., redirect to a success page or show a success message
            setLoading(false);
            window.alert('Account Deleted Successfully');
            window.location.reload();
          } else {
            console.log(response.data);
          }
        } catch (error: any) { // Explicitly cast error to 'any'
          console.error('Error occurred:', error);
          if (error.response && error.response.status === 400) {
            const responseData = error.response.data;
            if (responseData.detail === "Email already exists") {
              window.alert('Email Already Registered. Please Enter Another Email Address');
            } else if (responseData.detail === "Phone number already exists") {
              window.alert('Phone Number Already Registered. Please Enter Another Phone Number');
            } else {
              // Handle other 400 status cases if needed
            }
          } else {
            // Handle other errors
            window.alert('An error occurred while Deleting the profile. Please try again later.');
          }
        }
      } else {
        // If not confirmed, do nothing or show a message
        console.log('Deletion cancelled.');
      }
    }
  };

  const [socialMediaPopupOpen, setSocialMediaPopupOpen] = useState(false);
  const [linkInputPopupOpen, setLinkInputPopupOpen] = useState(false);
  const [tlinkInputPopupOpen, settLinkInputPopupOpen] = useState(false);

  const handleSocialMediaPopupOpen = () => {
    setSocialMediaPopupOpen(true);
  };

  const handleCloseAllPopups = () => {
    setSocialMediaPopupOpen(false);
    setLinkInputPopupOpen(false);
  };

  const handleLinkSubmit = (link: any) => {
    console.log('Submitted link:', link);
    window.alert("Account Added Successfully");
    setSocialMediaPopupOpen(false);
    setLinkInputPopupOpen(false);
  };

  const handlePlatformSelectAndOpen = (platform: any) => {
    if (platform === '') {
      window.alert("Please select a Social Media Platform");
    } else {
      switch (platform) {
        case 'linkedin':
          setLinkInputPopupOpen(true);
          break;
        case 'twitter':
          const fetchData = async () => {
            setLoading(true);
            try {
              const response = await axios.get(`${process.env.REACT_APP_Fast_API}/twitter_authorization_url`, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (response.status === 200) {
                const jsonData = response.data;
                console.log(jsonData);
                const url = jsonData;
                sessionStorage.setItem("Twitter",url);
                window.open(url, '_Blank');
                settLinkInputPopupOpen(true);
                setLoading(false);
              } else {
                console.log('Error:', response.statusText);
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
          break;
        default:
          break;
      }
      setSocialMediaPopupOpen(false);
      
    }
  };

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
      <Dialog open={tlinkInputPopupOpen} onClose={handleCloseAllPopups}>
        <DialogContent>
          <TwitterLink isOpen={tlinkInputPopupOpen} onClose={handleCloseAllPopups} onSubmit={handleLinkSubmit} />
        </DialogContent>
      </Dialog>
      {loading && <LoadingScreen />}
      <Card sx={{ maxWidth:'75%' , margin:'10px' , borderRadius:'20px' , padding:'20px' , backgroundColor:'rgba(25, 28, 36, 0.8)' , boxShadow: '6px 6px 6px rgba(255, 255, 255, 0.5)' }}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' , color:'white' }}>
            <h2>Social Media Accounts</h2>
            <ButtonComponent variant="contained" onClick={handleSocialMediaPopupOpen} startIcon={<AddCircleIcon/>}>Add</ButtonComponent>
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontSize:'20px' , color:'white'}}>ID</TableCell>
                  <TableCell style={{fontSize:'20px', color:'white'}}></TableCell>
                  <TableCell style={{fontSize:'20px', color:'white'}}>Username</TableCell>
                  <TableCell style={{fontSize:'20px', color:'white'}}>Platform Name</TableCell>
                  <TableCell style={{fontSize:'20px', color:'white'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {username.length > 0 ? (
                  username.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell style={{fontSize:'16px', color:'white'}}>{index + 1}</TableCell>
                      <TableCell style={{fontSize:'16px', color:'white'}}><Avatar alt="User" src={userPic[index]} /></TableCell>
                      <TableCell style={{fontSize:'16px', color:'white'}}>{user}</TableCell>
                      <TableCell style={{fontSize:'16px', color:'white'}}>{platform[index]}</TableCell>
                      <TableCell>
                        <IconButton style={{backgroundColor:'#1565C0' ,borderRadius:'5px' , color:'white' }} onClick={() => handleDeleteClick()}>
                          <DeleteIcon />
                        </IconButton>
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
