import { Box, Card, CardContent,  Dialog,  DialogContent,  DialogTitle,  Divider,  Grid,  IconButton, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { InsertEmoticonRounded } from "@mui/icons-material";
import TwitterPostLayout from "./Twitter";
import React from "react";
import SchedulePopup from "./Schedule_Time";
import axios from "axios";
import Picker from 'emoji-picker-react';
import LoadingScreen from "../Common/Loading";
import ButtonComponent from "../Fields/Buttonfield";

// File Preview Interface
type FilePreview = {
      file: File;
      previewUrl: string;
      type: "image" | "video";
};

export default function Twitter_Post(){
    
    const isMobile = useMediaQuery('(max-width:600px)');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimezone, setSelectedTimezone] = useState<string>('');
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    let scheduleType = '';

    const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputContent = e.target.value;
        if (inputContent.length <= 250) { // Check if character count is less than or equal to 250
            setContent(inputContent);
        } else {
            // Truncate the inputContent to 250 characters
            const truncatedContent = inputContent.substring(0, 250);
            // Update the content with truncatedContent
            setContent(truncatedContent);
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
            formData.append('platform_name', 'twitter');
            formData.append('post_type', 'content');
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
            setSelectedFiles([]);
            setSelectedDate('');
            setSelectedTime('');
            setSelectedTimezone('');
        } catch (error) {
            // Handle error
            //console.error('Error creating post:', error.message);
        }
    };

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
                            <Typography style={{color:'red' }}>Twitter Is Currently unavailable For Image And Video Posting.</Typography>
                            <Divider style={{ margin: '10px 0' }} />

                            {/* Content Textarea with Emoji Picker */}
                            <Box position="relative" width="100%">
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
                        <Card style={{ background: '#FFFFFF', margin: '20px', borderRadius: '20px', boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.8)' , width: '70%' }}>
                            <CardContent>
                                <TwitterPostLayout
                                    username="Harsh"
                                    handle="@Harsh-shah"
                                    content={content}
                                    media={selectedFiles.length > 0 ? selectedFiles[0] : undefined}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                </main>
            </div>
            </>
    )
}