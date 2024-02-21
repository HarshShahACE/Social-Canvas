import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, IconButton, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import FBLogo from '../../Photos/FBLogo.png';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import ReplyIcon from '@mui/icons-material/Reply';
import PeopleIcon from '@mui/icons-material/People';

type MediaType = {
  type: 'image' | 'video';
  data: string;
};


interface FacebookProps {
    username: string;
    content: string;
    media?: MediaType;
}

const FacebookPostLayout: React.FC<FacebookProps> = ({ username, content, media }) => {

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
        <img src={FBLogo} alt={username} style={{ width: '30px', height: '30px' }} />
        <Typography variant="body1" color="textPrimary">
          FaceBook
        </Typography>
      </div>
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1877f2', padding: '8px' }}>
        <IconButton aria-label="camera" color="inherit">
          <PhotoCameraIcon />
        </IconButton>
        <IconButton aria-label="search" color="inherit">
          <SearchIcon />
        </IconButton>
        <Typography>____________________________</Typography>
        <IconButton aria-label="message" color="inherit" style={{marginLeft:'10px'}}>
          <MessageIcon />
        </IconButton>
      </div>

      {/* Profile section */}
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="user"> 
            </Avatar>
          }
          title={username}
          subheader={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">3 hours ago</Typography>
                <PeopleIcon style={{marginLeft:'5px'}}/>
            </div>
          }
        />

        {/* Post Content */}
        <CardContent>
          <Typography>{content}</Typography>
          {media && media.type === 'image' && (
                <img src={media.data} alt="Post" style={{ maxWidth: '100%', marginTop: 16 }} />
            )}
            {media && media.type === 'video' && (
                <video controls src={media.data} style={{maxWidth:'500px' ,maxHeight:'500px'}} />
            )}
        </CardContent>

        {/* Post Actions */}
        <Divider />
        <CardActions disableSpacing style={{justifyContent:'space-between', alignItems:'center' , marginLeft:'20px' , marginRight:'20px'}}>
          <IconButton aria-label="like">
            <ThumbUpIcon />
            <Typography variant="body2" style={{ marginLeft: 8 , marginRight:'10px' }}>Like</Typography>
          </IconButton>
          <IconButton aria-label="comment">
            <CommentIcon />
            <Typography variant="body2" style={{ marginLeft: 8 }}>Comment</Typography>
          </IconButton>
          <IconButton aria-label="comment" >
            <ReplyIcon />
            <Typography variant="body2" style={{marginLeft: 8}}>Share</Typography>
          </IconButton>
        </CardActions>
        <Divider style={{ marginBottom: '10px' }} />
      </Card>
    </>
  );
};

export default FacebookPostLayout;
