import React, { useEffect, useState } from 'react';
import { CardContent, CardActions, Avatar, Typography, IconButton, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArchiveIcon from '@mui/icons-material/Archive';
import youtubelogo from '../../assets/Photos/Youtube.png';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import { ThumbDown } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

type FilePreview = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};


interface youtubeprops {
    title?: string;
    content?: string;
    media?: FilePreview;
}

const Youtubepostlayout: React.FC<youtubeprops> = ({ title ,content, media }) => {

  const [username, setUsername] = useState<string[]>([]);
  const [userPic, setUserPic] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const idString = sessionStorage.getItem('Myid');
      if (idString !== null) {
        const id = parseInt(idString);
        try {
          const response = await axios.post(`${process.env.REACT_APP_Fast_API}/s_account_list?user_id=`+id, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status === 200) {
            const jsonData = response.data;
            if (Array.isArray(jsonData)) {
              const linkedinData = jsonData.filter(item => item.platform === "YouTube");
              setUsername(linkedinData.map(item => item.username));
              setUserPic(linkedinData.map(item => item.profile_pic_url));
            } else {
              setUsername([jsonData.username]);
              setUserPic([jsonData.profile_pic_url]);
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

    return (
        <>
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
            <img src={youtubelogo} alt='Youtube' style={{ width: '30px', height: '30px' }} />
            <Typography variant="body1" color="textPrimary" style={{marginLeft:'5px'}}>
              Youtube
            </Typography>
          </div>

          {/* Header section */}
          <div style={{ boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.3)' , maxWidth:400}}>
            {/* Media */}
            {media && media.type === 'video' && (
              <CardContent>
                <video controls src={media.previewUrl} style={{ width:'380px', height:'250px' }} />
              </CardContent>
            )}
            <Divider></Divider>
            {/* Post Content */}
            <div style={{marginTop:'10px' , marginLeft:'10px'}}>
              <Typography style={{fontSize:'18px'}}>{title}</Typography>
              <div style={{display:'flex'}}>
                <Typography style={{fontSize:'14px'}}>1000 views</Typography>
                <Typography style={{marginLeft:'10px' , fontSize:'14px'}}>3 hours ago</Typography>
              </div>
            </div>
      

            {/* Post Actions */}
            <CardActions disableSpacing style={{ justifyContent:'space-between', alignItems:'center', marginLeft:'20px', marginRight:'20px' }}>
            
              <IconButton aria-label="like">
                <div>
                <ThumbUpIcon />
                <Typography variant="body2" style={{ marginLeft: 8 , marginRight:'10px' }}>19</Typography>
                </div>
              </IconButton>
              <IconButton aria-label="dislike">
                <div>
                <ThumbDown />
                <Typography variant="body2" style={{ marginLeft: 8 , marginRight:'10px' }}>5</Typography>
                </div>
              </IconButton>
              <IconButton aria-label="like">
                <div>
                <ShareIcon />
                <Typography variant="body2" style={{ marginLeft: 8 , marginRight:'10px' }}>Share</Typography>
                </div>
              </IconButton>
              <IconButton aria-label="like">
                <div>
                <DownloadIcon />
                <Typography variant="body2" style={{ marginLeft: 8 , marginRight:'10px' }}>Download</Typography>
                </div>
              </IconButton>
              <IconButton aria-label="like">
                <div>
                <ArchiveIcon />
                <Typography variant="body2" style={{ marginLeft: 8 , marginRight:'10px' }}>Save</Typography>
                </div>
              </IconButton>
            </CardActions>
            <Divider></Divider>
            {/* Profile section */}
            <div style={{marginLeft:'10px' , marginBottom:'10px' , marginTop:'10px'}}>
              <div style={{display:'flex'}}>
                <Avatar aria-label="user" src={userPic[0]}/>
                  <div style={{marginLeft:'5px'}}>
                    {username}
                    <Typography style={{fontSize:'14px'}}>500 Subscribers</Typography>
                  </div>
                  <div style={{display:'flex' , marginLeft:'50px'}}>
                    <Typography style={{fontSize:'18px'}}>SUBSCRIBED</Typography>
                    <NotificationsIcon style={{marginLeft:'10px'}}/> 
                  </div>
              </div>
            </div>
            <div style={{marginTop:'10px'}}>
                <Divider></Divider>
            </div>
          </div>
        </>
      );      
};

export default Youtubepostlayout;
