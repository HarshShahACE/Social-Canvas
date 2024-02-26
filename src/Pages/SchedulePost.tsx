import { Avatar, Box, Button, Card, CardContent, CssBaseline,  Divider,  Grid,  IconButton, TextField, useMediaQuery } from "@mui/material";
import SideNav from "../Components/Navbar";
import { useState } from "react";
import LinkedInPostLayout from "../Components/Schedule_Post/Linkedin";
import {  AddPhotoAlternateRounded } from "@mui/icons-material";
import TwitterPostLayout from "../Components/Schedule_Post/Twitter";
import FacebookPostLayout from "../Components/Schedule_Post/Facebook";
import TimezoneSelect, { ITimezone , allTimezones  } from "react-timezone-select";
import SelectComponent from "../Components/Selectfield";
import React from "react";

const platforms = [
    { name: "LinkedIn", value: "linkedin" },
    { name: "Twitter", value: "twitter" },
    { name: "Facebook", value: "facebook" },
    // Add more platforms as needed
];

type MediaType = {
    type: 'image' | 'video';
    data: string;
};

// Function to convert data URL to Blob
const dataURLtoFile = (dataURL: string, filename: string) => {
    const byteString = atob(dataURL.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: dataURL.split(':')[1].split(';')[0] });
    const fileExtension = blob.type.split('/')[1];
    return new File([blob], `${filename}.${fileExtension}`, { type: blob.type });
};

export default function Schedule_Post(){
    
    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>([]);

    const [content, setContent] = useState('');
    const [media, setMedia] = useState<MediaType | null>(null);

    const handleMediaUpload = (event : React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setMedia({ type: file.type.startsWith('image/') ? 'image' : 'video', data: reader.result.toString() });
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const handlePlatformChange = (value: string) => {
    if (selectedPlatforms.includes(value)) {
        // If the platform is already selected, remove it from the selectedPlatforms array
        setSelectedPlatforms(selectedPlatforms.filter(platform => platform !== value));
    } else {
        // If the platform is not selected, add it to the selectedPlatforms array
        setSelectedPlatforms([...selectedPlatforms, value]);
    }
};

    // Schedule Post
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    )
    console.log(selectedTimezone);

    const handleDateChange = (event : any) => {
        setSelectedDate(event.target.value);
    };

    const handleTimeChange = (event : any) => {
        setSelectedTime(event.target.value);
    };

    const handlePostNow = () => {
        // Handle post now action
        const postData = async () => {
            // Create form data
            const formData = new FormData();
            formData.append('content', content);
            //formData.append('platform', selectedPlatforms);
            if (media) {
                const file = dataURLtoFile(media.data, 'Myfile');
                console.log(file);
                formData.append('Media', file);
            }
            try {
                const response = await fetch('127.0.0.1:8000/API', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Failed to create post');
                }
                const data = await response.json();
                console.log('Post created successfully:', data);
                // Reset form fields after successful post creation
                setContent('');
                setSelectedPlatforms([]);
                setMedia(null);
            } catch (error : any) {
                console.error('Error creating post:', error.message);
            }
        };
        postData();
    };

    const handleSchedule = () => {
        // Handle schedule action
    };
  

    return(
        <div style={{ display: 'flex' , backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'bottom right'  , height:'100vh' }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <CssBaseline />
            {/* Sidebar */}
            <SideNav/>
            {/* Main content */}
            <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px' , marginLeft: isMobile? '20px' : '240px'  }}>
                    {/* Main content */}
                    <Grid container spacing={2}>
                        <Grid md={6}>
                    <Card style={{background: 'rgba(255, 255, 255, 0.7)' , margin:'20px', borderRadius:'20px'}}>
                        <CardContent>
                            {/* Drop Down For Plateform Selection */}
                            <Box display="flex" alignItems="center" mt={2}>
                                {platforms.map(platform => (
                                    <Avatar key={platform.value} style={{ cursor: 'pointer', marginRight: '10px', backgroundColor: selectedPlatforms.includes(platform.value) ? '#007bff' : '#FFBBFF' }} onClick={() => handlePlatformChange(platform.value)}>{platform.name.charAt(0)}</Avatar>
                                ))}
                            </Box>
                            <Divider style={{ margin: '10px 0' }} />

                            {/* Content Textarea with Emoji Picker */}
                            <Box display="flex" flexDirection="column" alignItems="flex-start" position="relative" width="100%" marginBottom={5}>
                                <textarea
                                    rows={10} // Increased the number of rows to make the textarea taller
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write something..."
                                    style={{ width: '100%' ,resize: 'none' , padding:'10px' }} // Full width textarea with margin at the bottom
                                />
                            </Box>

                            {/* Media Upload */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <input
                                    accept="image/*,video/*"
                                    style={{ display: 'none' }}
                                    id="media-upload"
                                    type="file"
                                    onChange={handleMediaUpload}
                                    multiple={false} // Allow only single file selection
                                />
                                <label htmlFor="media-upload">
                                    <IconButton component="span">
                                        <AddPhotoAlternateRounded />
                                    </IconButton>
                                </label>
                                {media && (
                                <>
                                {media.type === 'image' && (
                                    <Avatar
                                        alt="Uploaded Media"
                                        src={media.data}
                                        sx={{ width: 100, height: 100, borderRadius: '0' }}
                                    />
                                )}
                                {media.type === 'video' && (
                                    <video controls src={media.data} style={{ maxWidth: '250px', maxHeight:'250px',  marginTop: 16 }} />
                                )}
                                </>
                                )}
                            </Box>
                            <Divider style={{marginTop:'10px'}}/>

                            {/* Time And Date Selection */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <TextField
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    InputProps={{
                                        style: { borderRadius: '4px'},
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#757575' },
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderColor: '#9e9e9e' } }}
                                />
                                <TextField
                                    type="time"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                    InputProps={{
                                        style: { borderRadius: '4px' , marginLeft:'10px'},
                                    }}
                                    InputLabelProps={{
                                        style: { color: '#757575' },
                                    }}
                                    inputProps={{
                                        step: 300,
                                        twelveHour : false 
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderColor: '#9e9e9e' } }}
                                />
                            </Box>

                            {/* Time Zone Selection */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <TimezoneSelect
                                    value={selectedTimezone}
                                    onChange={setSelectedTimezone}
                                    timezones={{
                                        ...allTimezones,
                                        'America/Lima': 'Pittsburgh',
                                        'Europe/Berlin': 'Frankfurt',
                                    }}
                                    styles={{
                                        control: (provided) => ({ ...provided, position: 'relative' }),
                                        menu: (provided) => ({ ...provided, top: 'unset', bottom: 'calc(100% + 4px)', position: 'absolute' })
                                    }}
                                />    
                            </Box>

                            {/* Buttons */}
                            <Box display="flex" mt={4} mb={0}>
                                <Button variant="contained" onClick={handlePostNow}>Post Now</Button>
                                <Button variant="contained" onClick={handleSchedule} style={{marginLeft:'10px'}}>Schedule for Later</Button>
                            </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid md={6} style={{ marginTop: isMobile? '20px' : '0px' }}>
                    {selectedPlatforms.map((platform, index) => (
                        <Card key={index} style={{ background: 'rgba(255, 255, 255, 0.9)', margin: '20px', borderRadius: '20px', width: '70%' }}>
                            <CardContent>
                                {/* Render preview based on platform */}
                                {platform === 'linkedin' && (
                                    <LinkedInPo tLayout username="Harsh" content={content} media={media || undefined} />
                                )}
                                {platform === 'facebook' && (
                                    <FacebookPostLayout username="Harsh" content={content} media={media || undefined} />
                                )}
                                {platform === 'twitter' && (
                                    <TwitterPostLayout username="Harsh" handle="@Harsh-shah" content={content} media={media || undefined} />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    </Grid>
                </Grid>
                </main>
            </div>
        </div>
    )
}