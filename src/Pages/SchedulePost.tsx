import { Avatar, Box, Button, Card, CardContent, CssBaseline,  Divider,  Grid,  IconButton, useMediaQuery } from "@mui/material";
import SideNav from "../Components/Navbar";
import { useState } from "react";
import LinkedInPostLayout from "../Components/Schedule_Post/Linkedin";
import {  AddPhotoAlternateRounded } from "@mui/icons-material";
import TwitterPostLayout from "../Components/Schedule_Post/Twitter";
import FacebookPostLayout from "../Components/Schedule_Post/Facebook";
import { ITimezone  } from "react-timezone-select";
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import linkedin from '../assets/Photos/Linkedin.png'
import twitter from '../assets/Photos/twitter.jpg'
import facebook from '../assets/Photos/FBLogo.png'
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import SchedulePopup from "../Components/Schedule_Post/Schedule_Time";
import axios from "axios";

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
    const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>({
        value: 'America/New_York', // Set the default timezone here
        label: 'Eastern Time (ET)'
    });
    const [scheduleType, setScheduleType] = useState<'postnow' | 'schedule'>('postnow'); // Default to 'Post Now'

    const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
    const [firstSelectedFileType, setFirstSelectedFileType] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        // Check if files and files.length are not null or undefined
        if (files && files.length > 0) {
            // If firstSelectedFileType is null, set it to the type of the first file
            if (firstSelectedFileType === null) {
                const firstFileType = files[0].type.startsWith("image/") ? "image" : "video";
                setFirstSelectedFileType(firstFileType);
            }
    
            // Check if the total number of selected files exceeds the allowed limit
            const maxFilesAllowed = firstSelectedFileType === "image" ? 3 : 1;
            if (files.length > maxFilesAllowed) {
                alert(`You can only upload a maximum of ${maxFilesAllowed} files.`);
                event.target.value = ''; // Clear the file input value
                return;
            }
    
            const updatedSelectedFiles: FilePreview[] = Array.from(files).map(
                (file) => ({
                    file,
                    previewUrl: URL.createObjectURL(file),
                    type: file.type.startsWith("image/") ? "image" : "video",
                })
            );
    
            // If all selected files match the type of the first selected file
            if (firstSelectedFileType !== null) {
                const allFilesMatchType = updatedSelectedFiles.every(
                    (file) => (file.type === "image" && firstSelectedFileType === "image") ||
                            (file.type === "video" && firstSelectedFileType === "video")
                );
    
                if (!allFilesMatchType) {
                    alert("Please upload files of the same type as the first selected file.");
                    event.target.value = ''; // Clear the file input value
                    return;
                }
            }
    
            if (selectedFiles.length === maxFilesAllowed) {
                if (window.confirm(`You have already selected ${maxFilesAllowed} files. Do you want to replace them?`)) {
                    setSelectedFiles(updatedSelectedFiles);
                }
            } else {
                setSelectedFiles([...selectedFiles, ...updatedSelectedFiles]);
            }
        }
    };
    
    const handleDeleteFile = (index: number) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    
        // Manually clear the file input value
        const fileInput = document.getElementById("media-upload") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
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

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputTime = new Date(`2000-01-01T${event.target.value}`).getTime();
        const currentTime = new Date().getTime();
    
        const tenMinutesLater = currentTime + 10 * 60 * 1000; // 10 minutes ahead in milliseconds
    
        if (inputTime >= tenMinutesLater) {
            setSelectedTime(event.target.value);
        } else {
            // Show error or handle invalid time
            window.alert("Selected time must be at least 10 minutes ahead of the current time.");
        }
    }
    

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
        formData.append('schedule_post', JSON.stringify({
            platform_name: selectedPlatforms,
            post_type: firstSelectedFileType || "",
            sch_type: scheduleType,
            content: content,
            sch_user_time: selectedDate ? new Date(`${selectedDate}T${selectedTime}`).toISOString() : null,
            sch_utc_time: null, // This will be populated during processing on the server
            timezone: selectedTimezone.valueOf
        }));
    
        selectedFiles.forEach((file, index) => {
            formData.append(`file${index + 1}`, file.file);
        });
    
        const idString = sessionStorage.getItem('Myid');
        let id;
    
        if (idString !== null) {
            id = parseInt(idString);
        }
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_Fast_API}/create-schedule-post/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Use multipart/form-data
                    },
                }
            );
    
            console.log('Post created successfully:', response.data);
            // Reset form fields after successful post creation
            setContent('');
            setSelectedPlatforms([]);
            setSelectedFiles([]);
            setSelectedDate('');
            setSelectedTime('');
            setSelectedTimezone({
                value: 'America/New_York',
                label: 'Eastern Time (ET)'
            });
        } catch (error) {
            // Handle error
           //console.error('Error creating post:', error.message);
        }
    };

    const [isOpen, setIsOpen] = useState(false);
    const handleScheduleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const [previewPageIndex, setPreviewPageIndex] = useState(0);

    const handleNextPreviewPage = () => {
        setPreviewPageIndex((prevIndex) => Math.min(prevIndex + 1, selectedPlatforms.length - 1));
    };

    const handlePrevPreviewPage = () => {
        setPreviewPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const reversedPlatforms = selectedPlatforms.slice().reverse();
  

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
                    <Card style={{background: 'rgba(255, 255, 255, 0.7)' , margin:'20px', borderRadius:'20px' ,  boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.3)' }}>
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
                                    <div key={index} style={{ marginRight: '20px' }}> {/* Added margin right */}
                                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                                            <IconButton 
                                                onClick={() => handleDeleteFile(index)} 
                                                style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                {file.type === 'image' && (
                                                    <Avatar alt="Uploaded Media" src={file.previewUrl} sx={{ width: 100, height: 100, borderRadius: '0' }} />
                                                )}
                                                {file.type === 'video' && (
                                                    <video controls src={file.previewUrl} style={{ maxWidth: '250px', maxHeight: '250px', marginTop: 16 }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Box>
                            <Divider style={{ marginTop: '10px' }} />

                            {/* Buttons */}
                            <Box display="flex" mt={4} mb={0}>
                                <Button variant="contained" onClick={handlePostNow}>Post Now</Button>
                                <Button variant="contained" onClick={handleScheduleOpen} style={{marginLeft:'10px'}}>Schedule</Button>
                            </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <SchedulePopup
                        isOpen={isOpen}
                        onClose={handleClose}
                        selectedDate={selectedDate}
                        handleDateChange={handleDateChange}
                        selectedTime={selectedTime}
                        handleTimeChange={handleTimeChange}
                        selectedTimezone={selectedTimezone}
                        setSelectedTimezone={setSelectedTimezone}
                        handleScheduleClick={handleScheduleClick}
                    />
                    <Grid md={6} style={{ marginTop: isMobile ? '20px' : '0px' }}>
                    {selectedPlatforms.length > 0 && (
                        <Card style={{ background: 'rgba(255, 255, 255, 0.9)', margin: '20px', borderRadius: '20px', boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.8)' , width: '70%' }}>
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
                                        {reversedPlatforms[previewPageIndex] === 'linkedin' && (
                                            <LinkedInPostLayout
                                                username="Harsh"
                                                content={content}
                                                media={selectedFiles.length > 0 ? selectedFiles[0] : undefined}
                                            />
                                        )}
                                        {reversedPlatforms[previewPageIndex] === 'facebook' && (
                                            <FacebookPostLayout
                                                username="Harsh"
                                                content={content}
                                                media={selectedFiles.length > 0 ? selectedFiles[0] : undefined}
                                            />
                                        )}
                                        {reversedPlatforms[previewPageIndex] === 'twitter' && (
                                            <TwitterPostLayout
                                                username="Harsh"
                                                handle="@Harsh-shah"
                                                content={content}
                                                media={selectedFiles.length > 0 ? selectedFiles[0] : undefined}
                                            />
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