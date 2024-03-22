import { Avatar, Box, Card, CardContent, CssBaseline, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import SideNav from "../Components/Common/Navbar";
import { InsertEmoticonRounded, AddPhotoAlternateRounded } from "@mui/icons-material";
import Picker from 'emoji-picker-react';
import { platforms } from "../Components/Common/platefroms";
import ButtonComponent from "../Components/Fields/Buttonfield";
import SchedulePopup from "../Components/Schedule_Post/Schedule_Time";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import TextFieldComponent from "../Components/Fields/Textfield";
import youtubepostlayout from "../Components/Schedule_Post/youtube";
import Youtubepostlayout from "../Components/Schedule_Post/youtube";

// File Preview Interface
type FilePreview = {
    file: File;
    previewUrl: string;
    type: "image" | "video";
};

const Youtubepost = () =>{
    // Check for Phone View
  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    const [loading, setLoading] = useState(false);
    const [title, settitle] = useState('');
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
        if (inputContent.length <= 2000) { // Check if character count is less than or equal to 200
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
            // Check if the total number of selected files exceeds the allowed limit
            const maxFilesAllowed = 1; // Only allow 1 video file
            if (files.length > maxFilesAllowed) {
                alert(`You can only upload a maximum of ${maxFilesAllowed} file.`);
                event.target.value = ''; // Clear the file input value
                return;
            }
    
            const updatedSelectedFiles: FilePreview[] = Array.from(files).map(
                (file) => ({
                    file,
                    previewUrl: URL.createObjectURL(file),
                    type: "video",
                })
            );
    
            if (selectedFiles.length === maxFilesAllowed) {
                if (window.confirm(`You have already selected ${maxFilesAllowed} file. Do you want to replace it?`)) {
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

  return (
    <div style={{ display: 'flex' ,backgroundColor:'#FFFFFF' ,backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain', width:'100%',
    backgroundRepeat:'no-repeat',
    backgroundPosition:'bottom right'  , height:'100vh' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <CssBaseline />
      {/* Sidebar */}
      <SideNav/>
      {/* Main content */}
      <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '80px' , marginLeft: isMobile? '20px' : '240px'  }}>
                    {/* Main content */}
                    <Grid container spacing={2}>
                        <Grid md={6}>
                    <Card style={{background: '#FFFFFF' , margin:'20px', borderRadius:'20px' ,  boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.3)' }}>
                        <CardContent>
                            {/* Content Textarea with Emoji Picker */}
                            <Box position="relative" width="100%" marginBottom={5}>
                            <TextField
                             label="Title"
                             value={title}
                             onChange={(e)=>settitle(e.target.value)}
                             fullWidth
                             required
                            />
                            <textarea
                                rows={7}
                                value={content}
                                onChange={handleContentChange}
                                placeholder="Description"
                                style={{ width: '100%',
                                resize: 'none',
                                padding: '15px',
                                height: 'auto', // Set height to auto to allow dynamic resizing
                                minHeight: '60px', // Minimum height of the textarea
                                maxHeight: '120px',
                                color:'black',
                                borderRadius:'20px', marginTop:'10px'}} 
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
                                    {`${content.length}/2000`}
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
                                    accept="video/*"
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
                        <Card style={{ background: '#FFFFFF', margin: '20px', borderRadius: '20px', boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.8)' , width: '70%' }}>
                            <CardContent>
                                <Youtubepostlayout
                                    username="Harsh Shah"
                                    title={title}
                                    content={content}
                                    media={selectedFiles[0] || ''}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                </main>
            </div>
    </div>
  );
}

export default Youtubepost;