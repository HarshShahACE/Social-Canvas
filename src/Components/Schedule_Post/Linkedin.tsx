import React from 'react';
import { Card, CardHeader, CardContent, Avatar, Typography, CardActions, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import LinkedinLogo from '../../assets/Photos/Linkedin.png'
import SendIcon from '@mui/icons-material/Send';
import RepeatIcon from '@mui/icons-material/Repeat'

type FilePreview = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};

interface LinkedInPostProps {
    username: string;
    content: string;
    media?: FilePreview;
    image? : string
  }
  

const LinkedInPost:React.FC<LinkedInPostProps> = ({ username, content, media , image }) => {

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' , margin:'10px' }}>
        <img src={LinkedinLogo} alt={username} style={{ width: '30px', height: '30px' }}/>
        <Typography variant="body1" color="textPrimary" style={{ marginLeft:'5px'}}>
          Linkedin
        </Typography>
      </div>
      <Card style={{ maxWidth: 400, margin:'20px', boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.5)' }}>
        <CardHeader
          avatar={
            <Avatar aria-label="user" src = {image} style={{}}> 
            </Avatar>
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
