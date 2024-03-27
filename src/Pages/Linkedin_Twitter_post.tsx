import { Avatar, Box, Card, CardContent,  Dialog,  DialogContent,  DialogTitle,  Divider,  Grid,  IconButton, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import LinkedInPostLayout from "../Components/Schedule_Post/Linkedin";
import {  AddPhotoAlternateRounded, InsertEmoticonRounded } from "@mui/icons-material";
import TwitterPostLayout from "../Components/Schedule_Post/Twitter";
import FacebookPostLayout from "../Components/Schedule_Post/Facebook";
import { NavigateBefore, NavigateNext } from '@mui/icons-material'; 
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import SchedulePopup from "../Components/Schedule_Post/Schedule_Time";
import axios from "axios";
import Picker from 'emoji-picker-react';
import LoadingScreen from "../Components/Common/Loading";
import { platforms } from "../Components/Common/platefroms";
import ButtonComponent from "../Components/Fields/Buttonfield";

// File Preview Interface
type FilePreview = {
      file: File;
      previewUrl: string;
      type: "image" | "video";
};

export default function Linkedin_Twitter_Post(){
    
    const isMobile = useMediaQuery('(max-width:600px)');
    const [loading, setLoading] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimezone, setSelectedTimezone] = useState<string>('');
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    let scheduleType = '';

    const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
    const [firstSelectedFileType, setFirstSelectedFileType] = useState<string | null>(null);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputContent = e.target.value;
        if (inputContent.length <= 250) { // Check if character count is less than or equal to 200
            setContent(inputContent);
        }
        else{
            alert("Limit Has Been Reached");
        }
    };

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
    
        // If no files are selected, reset post_type to a default value
        if (updatedFiles.length === 0) {
            setFirstSelectedFileType(null);
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
        if (!selectedDate) {
            window.alert("Please select a date first.");
            return;
        }
    
        // Parse the selected time value to extract hours, minutes, and seconds
        const [hours, minutes] = event.target.value.split(':');
        
        // Format the time as HH:MM:SS
        const formattedTime = `${hours}:${minutes}:00`;
    
        const selectedDateTime = new Date(`${selectedDate}T${formattedTime}`);
        const tenMinutesLater = new Date();
        tenMinutesLater.setMinutes(tenMinutesLater.getMinutes() + 10);
    
        // Check if the selected time is at least 10 minutes ahead of the current time
        if (selectedDateTime >= tenMinutesLater) {
            setSelectedTime(formattedTime); // Use formatted time
        } else {
            // Show error message if the selected time is not valid
            window.alert("Selected time must be at least 10 minutes ahead of the current time.");
        }
    };
    
    const handlePostNow = () => {
        console.log("Post Now CLicked");
        scheduleType = 'postnow'
        postData();
        console.log("After PostData Function");
    };

    const handleScheduleClick = () => {
        scheduleType = 'schedule'
        postData();
    };

    const [isOpen, setIsOpen] = useState(false);
    const handleScheduleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };


    const postData = async () => {
        const idString = sessionStorage.getItem('Myid');
        let id;
    
        if (idString !== null) {
            id = parseInt(idString);
        }
    
        try {
            const formData = new FormData();
            // Append platform_name if platforms are selected
            if (selectedPlatforms.length > 0) {
                formData.append('platform_name', selectedPlatforms.join(','));
            } else {
                // Handle case where no platform is selected
                window.alert('Please select at least one platform.');
                window.location.reload();
            }

            // Set post_type to 'content' if no file is selected
            if (selectedFiles.length === 0) {
                formData.append('post_type', 'content');
            } else {
                formData.append('post_type', firstSelectedFileType || 'content');
            }
            formData.append('sch_type', scheduleType);
            formData.append('content', content);
            let Media = selectedFiles.length;
            formData.append('MediaNo',Media.toString());
            
            if(scheduleType === 'schedule'){
                if(selectedDate === "" || selectedTime === "" || selectedTimezone === "" ){
                    window.alert("Select Time For Posting");
                }
                if (selectedDate !== null) {
                    formData.append('time', new Date(`${selectedDate}T${selectedTime}`).toISOString());
                }
                formData.append('timezone', selectedTimezone);
            }
    
            // Append media files if they exist
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file, index) => {
                    formData.append(`media${index + 1}`, file.file);
                });
            }
    
            setLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_Fast_API}/create_schedule_post/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Use multipart/form-data
                    },
                }
            );
    
            console.log('Post created successfully:', response.data);
            if(scheduleType === 'schedule'){
                alert(`Your Content Is For selected Plateform By Given Time is Scheduled Successfully`)
                setLoading(false)
                setIsOpen(false)
                window.location.reload();
            }
            else{
                alert('Your Content Will Posted On Selected Plateform In Some Time.')
                setLoading(false)
                window.location.reload();
            }
            
            // Reset form fields after successful post creation
            setContent('');
            setSelectedPlatforms([]);
            setSelectedFiles([]);
            setSelectedDate('');
            setSelectedTime('');
            setSelectedTimezone('');
        } catch (error) {
            // Handle error
            //console.error('Error creating post:', error.message);
        }
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
        <>
        {loading && <LoadingScreen/>}
            {/* Main content */}
            <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3  }}>
                    {/* Main content */}
                    <Grid container spacing={2}>
                        <Grid md={6}>
                    <Card style={{background: '#FFFFFF' , margin:'20px', borderRadius:'20px' ,  boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.3)' }}>
                        <CardContent>
                            {/* Drop Down For Plateform Selection */}
                            <Box display="flex" alignItems="center" mt={2}>
                                {platforms.map(platform => (
                                    platform.value !== 'youtube' && (
                                        <Avatar key={platform.value} style={{ cursor: 'pointer', marginRight: '10px', backgroundColor: selectedPlatforms.includes(platform.value) ? '#007bff' : '#FFFFFF' }} onClick={() => handlePlatformChange(platform.value)}>
                                            <img src={platform.imageUrl} alt={platform.name} style={{ width: '90%', height: '90%', borderRadius: '50%' }} />
                                        </Avatar>
                                    )
                                ))}
                            </Box>
                            <Typography style={{color:'red' , marginTop:'10px'}}>Twitter Is Currently unavailable For Image And Video Posting.</Typography>
                            <Divider style={{ margin: '10px 0' }} />

                            {/* Content Textarea with Emoji Picker */}
                            <Box position="relative" width="100%" marginBottom={5}>
                            <textarea
                                rows={7}
                                value={content}
                                onChange={handleContentChange}
                                placeholder="Write something..."
                                style={{ width: '100%',
                                resize: 'none',
                                padding: '15px',
                                height: 'auto', // Set height to auto to allow dynamic resizing
                                minHeight: '60px', // Minimum height of the textarea
                                maxHeight: '120px',
                                color:'black',
                                borderRadius:'20px',}} 
                            />
                                <Box
                                    style={{
                                    position: 'absolute',
                                    bottom: '5px',
                                    left: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    }}
                                >
                                    <p style={{ fontSize: '14px', marginLeft:'20px' }}>
                                    {`${content.length}/250`}
                                    </p>
                                    <IconButton onClick={() => setEmojiPickerOpen(!emojiPickerOpen)} >
                                    <InsertEmoticonRounded />
                                    </IconButton>
                                    <Dialog open={emojiPickerOpen} onClose={() => setEmojiPickerOpen(false)} fullWidth maxWidth="xs" PaperProps={{ style: { position: 'absolute', left: '0', bottom: '60px' } }}>
                                    <DialogTitle>Choose an emoji</DialogTitle>
                                    <DialogContent>
                                        <Picker
                                        onEmojiClick={(emojiObject) => {
                                            setContent((prevContent) => prevContent + emojiObject.emoji);
                                            setEmojiPickerOpen(false);
                                        }}
                                        />
                                    </DialogContent>
                                    </Dialog>
                                </Box>
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
                                    disabled={selectedPlatforms.includes('twitter')}
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
                                <ButtonComponent variant="contained" onClick={handlePostNow}>Post Now</ButtonComponent>
                                <ButtonComponent variant="contained" onClick={handleScheduleOpen} style={{marginLeft:'10px'}}>Schedule</ButtonComponent>
                            </Box>
                            </CardContent>  
                        </Card>
                    </Grid>
                    <SchedulePopup
                        value="Select Time For Post"
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
                        <Card style={{ background: '#FFFFFF', margin: '20px', borderRadius: '20px', boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.8)' , width: '70%' }}>
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
            </>
    )
}