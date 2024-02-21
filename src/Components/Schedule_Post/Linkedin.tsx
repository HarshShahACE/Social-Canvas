import React from 'react';
import { Card, CardHeader, CardContent, Avatar, Typography, CardActions, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import LinkedinLogo from '../../Photos/Linkedin.png'
import SendIcon from '@mui/icons-material/Send';
import RepeatIcon from '@mui/icons-material/Repeat'

type MediaType = {
  type: 'image' | 'video';
  data: string;
};

interface LinkedInPostProps {
    username: string;
    content: string;
    media?: MediaType;
  }
  

const LinkedInPost:React.FC<LinkedInPostProps> = ({ username, content, media }) => {

  const Image = 'https://media.licdn.com/dms/image/D4D03AQFaAYtlJw689Q/profile-displayphoto-shrink_100_100/0/1688900557185?e=1714003200&v=beta&t=iDvDDCakIq8ZI1Adqr1nXLzozGT3aLkYwogdwM04zwg'

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' , margin:'10px' }}>
        <img src={LinkedinLogo} alt={username} style={{ width: '30px', height: '30px' }}/>
        <Typography variant="body1" color="textPrimary" style={{ marginLeft:'5px'}}>
          Linkedin
        </Typography>
      </div>
      <Card style={{ maxWidth: 400, margin:'20px',  }}>
        <CardHeader
          avatar={
            <Avatar aria-label="user" src = {Image} style={{}}> 
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
                <img src={media.data} alt="Post" style={{ maxWidth: '100%', marginTop: 16 }} />
            )}
            {media && media.type === 'video' && (
                <video controls src={media.data} style={{maxWidth:'500px' ,maxHeight:'500px'}} />
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
