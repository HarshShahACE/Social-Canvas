import React from 'react';
import { Card, CardContent, CardHeader ,CardActions, Avatar, Typography, IconButton, Divider } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import TwitterLogo from '../../Photos/twitter.jpg';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import UploadIcon from '@mui/icons-material/Upload';

interface TwitterProps {
    username: string;
    handle: string;
    content: string;
    imageUrl?: string;
}

const TwitterPostLayout: React.FC<TwitterProps> = ({ username, handle, content, imageUrl }) => {

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' , margin:'10px' }}>
        <img src={TwitterLogo} alt={username} style={{ width: '30px', height: '30px' }}/>
        <Typography variant="body1" color="textPrimary" style={{marginLeft:'5px' }}>
          Twitter
        </Typography>
      </div>
      <Card style={{ maxWidth: 400, margin:'20px',  }}>
        <CardHeader
          avatar={
            <Avatar aria-label="user" style={{}}> 
            </Avatar>
          }
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">{username}</Typography>
                <VerifiedIcon style={{ marginLeft: '5px', color: '#1FA0F3'}}/>
              <Typography variant="body2" color="textSecondary" style={{ marginLeft: '10px' }}>19-Feb-2024</Typography>
            </div>
          }
          subheader={handle}
        />
        <CardContent>
          <Typography variant="body1" color="textPrimary" component="p">
            {content}
          </Typography>
          {imageUrl && (
            <img src={imageUrl} alt="Post" style={{ maxWidth: '100%', marginTop: 16 }} />
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
