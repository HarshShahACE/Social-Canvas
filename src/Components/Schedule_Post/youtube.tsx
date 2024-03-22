import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, IconButton, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArchiveIcon from '@mui/icons-material/Archive';
import youtubelogo from '../../assets/Photos/Youtube.png';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import { ThumbDown } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';

type FilePreview = {
  file: File;
  previewUrl: string;
  type: "image" | "video";
};


interface youtubeprops {
    username?: string;
    title?: string;
    content?: string;
    media?: FilePreview;
}

const Youtubepostlayout: React.FC<youtubeprops> = ({ username, title ,content, media }) => {

    return (
        <>
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
            <img src={youtubelogo} alt={username} style={{ width: '30px', height: '30px' }} />
            <Typography variant="body1" color="textPrimary">
              Youtube
            </Typography>
          </div>
          {/* Header section */}
          <div style={{ boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.3)'}}>
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
                <Avatar aria-label="user" />
                  <div style={{marginLeft:'5px'}}>
                    {username}
                    <Typography style={{fontSize:'14px'}}>500 Subscribers</Typography>
                  </div>
                  <div style={{display:'flex' , marginLeft:'50px'}}>
                    <Typography style={{fontSize:'20px'}}>SUBSCRIBED</Typography>
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
