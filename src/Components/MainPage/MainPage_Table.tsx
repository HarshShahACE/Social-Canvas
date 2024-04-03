import React, { useEffect, useState } from 'react';
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogContent, Avatar } from '@mui/material';
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

  const handleDeleteClick = async (platform: string) => {
    const idString = sessionStorage.getItem('Myid'); // Retrieve the value from sessionStorage
    if (idString !== null) {
      const id = parseInt(idString);
      // Display confirmation dialog
      const confirmed = window.confirm('Are you sure you want to delete your account?');
      if (confirmed) {
        try {
          // Make the API call
          const response = await axios.post( `${process.env.REACT_APP_Fast_API}/remove_social_account/${platform}?user_id=${id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 200) {
            // Handle success, e.g., reload data or show a success message
            window.alert('Account Deleted Successfully');
            window.location.reload(); // Reload the page to reflect changes
          } else {
            console.log(response.data);
          }
        } catch (error: any) { // Explicitly cast error to 'any'
          console.error('Error occurred:', error);
          // Handle errors if needed
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
    window.alert("Account Added Successfully");
    setSocialMediaPopupOpen(false);
    setLinkInputPopupOpen(false);
  };

  const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
    if (idString !== null) {
      var id = parseInt(idString);
  }

  const handlePlatformSelectAndOpen = (platform: any) => {
    if (platform === '') {
      window.alert("Please select a Social Media Platform");
    } else {
      switch (platform) {
        case 'linkedin':
          window.open(`${process.env.REACT_APP_LINKEDIN_API}`, '_Blank');
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
        case 'youtube':
          const fetchYData = async () => {
            setLoading(true);
            try {
              const response = await axios.post(`${process.env.REACT_APP_Fast_API}/generate_youtube_access_token`, {
                userid: id,
              }, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });
              if (response.status === 200) {
                const JsonData = response.data;
                console.log(JsonData);
                window.alert("Account Added Successfully")
                window.location.reload();
              } else {
                console.log('Error:', response.statusText);
                setLoading(false);
                window.alert("Error In Adding Account , Try After Some Time");
              }
            } catch (error) {
              console.error('Error fetching data:', error);
              setLoading(false);
                window.alert("Error In Adding Account , Try After Some Time");
            }
          };
      
          fetchYData();
          break;
        default:
          break;
      }
      setSocialMediaPopupOpen(false);
      
    }
  };

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
      <Card sx={{ maxWidth:'75%' , margin:'10px' , borderRadius:'20px' , padding:'10px' , backgroundColor:'rgba(255, 255, 255, 0.8)' , boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.5)' }}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'0px'  }}>
            <h2>Social Media Accounts</h2>
            <ButtonComponent variant="contained" onClick={handleSocialMediaPopupOpen} startIcon={<AddCircleIcon/>}>Add</ButtonComponent>
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontSize:'20px'}}>ID</TableCell>
                  <TableCell style={{fontSize:'20px',  }}></TableCell>
                  <TableCell style={{fontSize:'20px',  }}>Username</TableCell>
                  <TableCell style={{fontSize:'20px',  }}>Platform Name</TableCell>
                  <TableCell style={{fontSize:'20px',  }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {username.length > 0 ? (
                  username.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell style={{fontSize:'16px',  }}>{index + 1}</TableCell>
                      <TableCell style={{fontSize:'16px',  }}><Avatar alt="User" src={userPic[index]} /></TableCell>
                      <TableCell style={{fontSize:'16px',  }}>{user}</TableCell>
                      <TableCell style={{fontSize:'16px',  }}>{platform[index]}</TableCell>
                      <TableCell>
                        <ButtonComponent variant='contained' onClick={() => handleDeleteClick(platform[index])}>
                          <DeleteIcon style={{padding:'0'}}/>
                        </ButtonComponent>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center', color: 'red' , fontSize:'20px' }}>Please Add Social Media Account</TableCell>
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
