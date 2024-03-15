import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader ,CardActions, Avatar, Typography, IconButton, Divider } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import TwitterLogo from '../../assets/Photos/twitter.jpg';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';

type FilePreview = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

interface TwitterProps {
    username: string;
    handle: string;
    content: string;
    media?: FilePreview;
}

const TwitterPostLayout: React.FC<TwitterProps> = ({ content, media }) => {

  const [username, setUsername] = useState<string[]>([]);
  const [handle, setHandle] = useState<string[]>([]);
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
              const linkedinData = jsonData.filter(item => item.platform === "Twitter");
              setUsername(linkedinData.map(item => item.username));
              setHandle(linkedinData.map(item=> item.handle));
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
      <div style={{ display: 'flex', alignItems: 'center' , margin:'10px' }}>
        <img src={TwitterLogo} style={{ width: '30px', height: '30px' }}/>
        <Typography variant="body1" color="textPrimary" style={{marginLeft:'5px' }}>
          Twitter
        </Typography>
      </div>
      <Card style={{ maxWidth: 400, margin:'20px', border: '1px solid rgba(0, 0, 0, 0.7)' }}>
        <CardHeader
          avatar={
            <Avatar alt="User" src={userPic[0]} />
          }
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">{username}</Typography>
                <VerifiedIcon style={{ marginLeft: '5px', color: '#1FA0F3'}}/>
              <Typography variant="body2" color="textSecondary" style={{ marginLeft: '10px' }}>19-Feb-2024</Typography>
            </div>
          }
          subheader={"@"+handle}
        />
        <CardContent>
          <Typography variant="body1" color="textPrimary" component="p">
            {content}
          </Typography>
          {/* {imageUrl && (
            <img src={imageUrl} alt="Post" style={{ maxWidth: '100%', marginTop: 16 }} />
          )} */}
          {media && media.type === 'image' && (
                <img src={media.previewUrl} alt="Post" style={{ maxWidth: '100%', marginTop: 16 }} />
            )}
            {media && media.type === 'video' && (
                <video controls src={media.previewUrl} style={{maxWidth:'500px' ,maxHeight:'500px'}} />
            )}
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="like">
            <CommentIcon />   
            <Typography variant="body2" style={{marginLeft:'5px'}}>10</Typography>
          </IconButton>
          <IconButton aria-label="comment" style={{marginLeft:'8px'}}>
            <RepeatIcon/>
            <Typography variant="body2" style={{marginLeft:'5px'}}>20</Typography>
          </IconButton>
          <IconButton aria-label="share" style={{marginLeft:'8px'}}>
            <FavoriteBorderIcon />
            <Typography variant="body2" style={{marginLeft:'5px'}}>50</Typography>
          </IconButton>
          <IconButton aria-label="share" style={{marginLeft:'8px'}}>
            <UploadIcon />
          </IconButton>
        </CardActions>
        {/* Divider */}
        <Divider />
      </Card>
    </>
  );
};

export default TwitterPostLayout;
