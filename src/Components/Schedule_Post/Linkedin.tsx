import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Avatar, Typography, CardActions, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import LinkedinLogo from '../../assets/Photos/Linkedin.png'
import SendIcon from '@mui/icons-material/Send';
import RepeatIcon from '@mui/icons-material/Repeat'
import axios from 'axios';

type FilePreview = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

interface LinkedInPostProps {
    content: string;
    media?: FilePreview;
  }
  
const LinkedInPost:React.FC<LinkedInPostProps> = ({ content, media }) => {

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
              const linkedinData = jsonData.filter(item => item.platform === "LinkedIn");
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
      <div style={{ display: 'flex', alignItems: 'center' , margin:'10px' }}>
        <img src={LinkedinLogo} style={{ width: '30px', height: '30px' }}/>
        <Typography variant="body1" color="textPrimary" style={{ marginLeft:'5px'}}>
          Linkedin
        </Typography>
      </div>
      <Card style={{ maxWidth: 400, margin:'20px',border: '1px solid rgba(255, 255, 255, 0.7)' }}>
        <CardHeader
          avatar={
            <Avatar alt="User" src={userPic[0]} />
          }
          title={username}
          subheader="3h Ago"
        />
        <CardContent>
          <Typography variant="body1" color="textPrimary" component="p">
            {content}
          </Typography>
          {media && media.type === 'image' && (
                <img src={media.previewUrl} alt="Post" style={{ maxWidth: '100%', marginTop: 16 }} />
            )}
            {media && media.type === 'video' && (
                <video controls src={media.previewUrl} style={{maxWidth:'500px' ,maxHeight:'500px'}} />
            )}
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="like">
            <ThumbUpIcon />
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: 8 }}>
              Like
            </Typography>
          </IconButton>
          <IconButton aria-label="comment">
            <CommentIcon />
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: 8 }}>
              Comment
            </Typography>
          </IconButton>
          <IconButton aria-label="comment">
            <RepeatIcon />
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: 8 }}>
              Repost
            </Typography>
          </IconButton>
          <IconButton aria-label="share">
            <SendIcon />
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: 8 }}>
              Share
            </Typography>
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
};

export default LinkedInPost;
