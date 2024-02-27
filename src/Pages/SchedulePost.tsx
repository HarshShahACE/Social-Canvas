import { Avatar, Box, Button, Card, CardContent, CssBaseline,  Divider,  Grid,  IconButton, TextField, useMediaQuery } from "@mui/material";
import SideNav from "../Components/Navbar";
import { useState } from "react";
import LinkedInPostLayout from "../Components/Schedule_Post/Linkedin";
import {  AddPhotoAlternateRounded } from "@mui/icons-material";
import TwitterPostLayout from "../Components/Schedule_Post/Twitter";
import FacebookPostLayout from "../Components/Schedule_Post/Facebook";
import TimezoneSelect, { ITimezone , allTimezones  } from "react-timezone-select";
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import linkedin from '../assets/Photos/Linkedin.png'
import twitter from '../assets/Photos/twitter.jpg'
import facebook from '../assets/Photos/FBLogo.png'
import React from "react";

const platforms = [
    { name: "LinkedIn", value: "linkedin" , imageUrl:linkedin },
    { name: "Twitter", value: "twitter" , imageUrl: twitter },
    { name: "Facebook", value: "facebook" , imageUrl: facebook},
    // Add more platforms as needed
];

type FilePreview = {
      file: File;
      previewUrl: string;
      type: "image" | "video";
};

export default function Schedule_Post(){
    
    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>({ value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: '' });
    const [scheduleType, setScheduleType] = useState<'postnow' | 'schedule'>('postnow'); // Default to 'Post Now'

    const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
          const updatedSelectedFiles: FilePreview[] = Array.from(files).map(
            (file) => ({
              file,
              previewUrl: URL.createObjectURL(file),
              type: file.type.startsWith("image/") ? "image" : "video",
            })
          );
          setSelectedFiles(updatedSelectedFiles);
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


    const handleDateChange = (event : any) => {
        setSelectedDate(event.target.value);
    };

    const handleTimeChange = (event : any) => {
        setSelectedTime(event.target.value);
    };

    const handlePostNow = () => {
        setScheduleType('postnow');
        postData();
    };

    const handleScheduleClick = () => {
        setScheduleType('schedule');
        postData();
    };


    const postData = async () => {
        const formData = new FormData();
        selectedPlatforms.forEach((platform) => {
            formData.append("Plateform", platform);
        });
        formData.append('content', content);
        selectedFiles.forEach((filePreview) => {
            formData.append("media", filePreview.file);
            console.log("Media",  filePreview.file);
        });
    
        // Append date, time, and timezone
        formData.append('date', selectedDate);
        formData.append('time', selectedTime);
        formData.append('timezone', JSON.stringify(selectedTimezone));
    
        // Append schedule type
        formData.append('scheduleType', scheduleType);
    
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
            setSelectedDate('');
            setSelectedTime('');
            setSelectedTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        } catch (error: any) {
            console.error('Error creating post:', error.message);
        }
    };
    
    const [isScheduled, setIsScheduled] = useState(false);

    const handleScheduleopen = () => {
        setIsScheduled(!isScheduled);
    };

    const [previewPageIndex, setPreviewPageIndex] = useState(0);

    const handleNextPreviewPage = () => {
        setPreviewPageIndex((prevIndex) => Math.min(prevIndex + 1, selectedPlatforms.length - 1));
    };

    const handlePrevPreviewPage = () => {
        setPreviewPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
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
                                    <Avatar key={platform.value} style={{ cursor: 'pointer', marginRight: '10px', backgroundColor: selectedPlatforms.includes(platform.value) ? '#007bff' : '#FFFFFF' }} onClick={() => handlePlatformChange(platform.value)}>
                                        <img src={platform.imageUrl} alt={platform.name} style={{ width: '90%', height: '90%', borderRadius: '50%' }} />
                                    </Avatar>
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
                                    onChange={handleFileChange}
                                    multiple // Allow multiple file selection
                                />
                                <label htmlFor="media-upload">
                                    <IconButton component="span">
                                        <AddPhotoAlternateRounded />
                                    </IconButton>
                                </label>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} style={{ marginLeft: '10px' }}>
                                        {file.type === 'image' && (
                                            <Avatar alt="Uploaded Media" src={file.previewUrl} sx={{ width: 100, height: 100, borderRadius: '0' }} />
                                        )}
                                        {file.type === 'video' && (
                                            <video controls src={file.previewUrl} style={{ maxWidth: '250px', maxHeight: '250px', marginTop: 16 }} />
                                        )}
                                    </div>
                                ))}
                            </Box>
                            <Divider style={{ marginTop: '10px' }} />

                            {/* Buttons */}
                            <Box display="flex" mt={4} mb={0}>
                                <Button variant="contained" onClick={handlePostNow}>Post Now</Button>
                                <Button variant="contained" onClick={handleScheduleopen} style={{marginLeft:'10px'}}>Schedule</Button>
                            </Box>

                            {isScheduled && (
                                <>
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

                                    <Box mt={2}>
                                        <Button variant="contained" onClick={handleScheduleClick}>Submit</Button>
                                    </Box>
                                </>
                            )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid md={6} style={{ marginTop: isMobile ? '20px' : '0px' }}>
                    {selectedPlatforms.length > 0 && (
                        <Card style={{ background: 'rgba(255, 255, 255, 0.9)', margin: '20px', borderRadius: '20px', width: '70%' }}>
                            <CardContent>
                                <div style={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                            <IconButton onClick={handlePrevPreviewPage}>
                                <NavigateBefore />
                            </IconButton>
                            <IconButton onClick={handleNextPreviewPage}>
                                <NavigateNext />
                            </IconButton>
                        </div>
                                {/* Render preview based on platform */}
                                {selectedPlatforms.length > 0 && (
                                    <>
                                        {selectedPlatforms[previewPageIndex] === 'linkedin' && (
                                            <LinkedInPostLayout username="Harsh" content={content} media={selectedFiles.length > 0 ? selectedFiles[0] : undefined} />
                                        )}
                                        {selectedPlatforms[previewPageIndex] === 'facebook' && (
                                            <FacebookPostLayout username="Harsh" content={content} media={selectedFiles.length > 0 ? selectedFiles[0] : undefined} />
                                        )}
                                        {selectedPlatforms[previewPageIndex] === 'twitter' && (
                                            <TwitterPostLayout username="Harsh" handle="@Harsh-shah" content={content} media={selectedFiles.length > 0 ? selectedFiles[0] : undefined} />
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                    </Grid>
                </Grid>
                </main>
            </div>
        </div>
    )
}

// import React, { useState } from "react";

// // Define a type for the file preview
// type FilePreview = {
//   file: File;
//   previewUrl: string;
// };

// const FileUploadWithPreview: React.FC = () => {
//   const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const updatedSelectedFiles = Array.from(files).map((file) => ({
//         file,
//         previewUrl: URL.createObjectURL(file),
//       }));
//       setSelectedFiles(updatedSelectedFiles);
//     }
//   };

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     selectedFiles.forEach((filePreview) => {
//       formData.append("media", filePreview.file);
//     });

//     try {
        
//       const response = await fetch("YOUR_API_ENDPOINT", {
//         method: "POST",
//         body: formData,
//       });
//       if (response.ok) {
//         console.log("Files uploaded successfully");
//         // Optionally, clear the selected files after successful upload
//         setSelectedFiles([]);
//       } else {
//         console.error("Failed to upload files");
//       }
//     } catch (error) {
//       console.error("Error uploading files:", error);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept="image/*,video/*"
//         multiple
//         onChange={handleFileChange}
//       />
//       <div>
//         {selectedFiles.map((file, index) => (
//           <div key={index}>
//             <img
//               src={file.previewUrl}
//               alt={`Preview ${index}`}
//               style={{ width: 100, height: 100, objectFit: "cover" }}
//             />
//           </div>
//         ))}
//       </div>
//       <button onClick={handleSubmit}>Upload Files</button>
//     </div>
//   );
// };

// export default FileUploadWithPreview;
