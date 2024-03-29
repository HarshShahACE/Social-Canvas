import { Box, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { InsertEmoticonRounded, AddPhotoAlternateRounded } from "@mui/icons-material";
import Picker from 'emoji-picker-react';
import ButtonComponent from "../Fields/Buttonfield";
import SchedulePopup from "./Schedule_Time";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import Youtubepostlayout from "./youtube";
import LoadingScreen from "../Common/Loading";


const categoriesData = [
    { value: "1", label: "Film & Animation" },
    { value: "2", label: "Autos & Vehicles" },
    { value: "10", label: "Music" },
    { value: "15", label: "Pets & Animals" },
    { value: "17", label: "Sports" },
    { value: "18", label: "Short Movies" },
    { value: "19", label: "Travel & Events" },
    { value: "20", label: "Gaming" },
    { value: "21", label: "Videoblogging" },
    { value: "22", label: "People & Blogs" },
    { value: "23", label: "Comedy" },
    { value: "24", label: "Entertainment" },
    { value: "25", label: "News & Politics" },
    { value: "26", label: "Howto & Style" },
    { value: "27", label: "Education" },
    { value: "28", label: "Science & Technology" },
    { value: "29", label: "Nonprofits & Activism" },
    { value: "30", label: "Movies" },
    { value: "31", label: "Anime/Animation" },
    { value: "32", label: "Action/Adventure" },
    { value: "33", label: "Classics" },
    { value: "34", label: "Comedy" },
    { value: "35", label: "Documentary" },
    { value: "36", label: "Drama" },
    { value: "37", label: "Family" },
    { value: "38", label: "Foreign" },
    { value: "39", label: "Horror" },
    { value: "40", label: "Sci-Fi/Fantasy" },
    { value: "41", label: "Thriller" },
    { value: "42", label: "Shorts" },
    { value: "43", label: "Shows" },
    { value: "44", label: "Trailers" }
  ];
  

// File Preview Interface
type FilePreview = {
    file: File;
    previewUrl: string;
    type: "image" | "video";
};

const Youtubepost = () =>{
    // Check for Phone View
  const isMobile = useMediaQuery('(max-width:600px)');

    const [loading, setLoading] = useState(false);
    const [title, settitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimezone, setSelectedTimezone] = useState<string>('');
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedvideotype, setSelectedvideotype] = useState('');
    let scheduleType = '';

    const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);

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

        if(title === ""){
            window.alert("Please Give Title For Video");
            return;
        }
        if(content === ""){
            window.alert("Give Description For Video");
            return;
        }
        if(selectedFiles.length === 0){
            window.alert("Select Video For Upload");
            return;
        }
    
        try {
            const formData = new FormData();

            formData.append('title',title);
            formData.append('description',content);
            formData.append('category',selectedCategory.toString());
            formData.append('privacy_status',selectedvideotype);
            formData.append('sch_type', scheduleType);
            
            if(scheduleType === 'schedule'){
                if(selectedDate === "" || selectedTime === "" || selectedTimezone === "" ){
                    window.alert("Select Time For Posting");
                }
                if (selectedDate !== null) {
                    formData.append('time', new Date(`${selectedDate}T${selectedTime}`).toISOString());
                }
                formData.append('timezone', selectedTimezone);
            }

            selectedFiles.forEach((file, index) => {
                formData.append('video', file.file);
            });
    
            setLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_Fast_API}/create_youtube_schedule_post/${id}`,
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

  return (
    <>
    {loading && <LoadingScreen/>}
      <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3}}>
                    {/* Main content */}
                    <Grid container spacing={2}>
                        <Grid md={6}>
                    <Card style={{background: '#FFFFFF' , margin:'20px', borderRadius:'20px' ,  boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.3)' }}>
                        <CardContent>
                            {/* Content Textarea with Emoji Picker */}
                            <Box position="relative" width="100%" marginBottom={1}>
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
                            <div style={{display:'flex'}}>
                                {/* Video Category */}
                                <select
                                    style={{
                                        padding: '8px 12px',
                                        fontSize: '16px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#f2f2f2',
                                        color: '#333',
                                        height:'50px',
                                        width: '280px',
                                        marginTop:'0px'
                                    }}
                                    value={selectedCategory}
                                    onChange={(event) => setSelectedCategory(event.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    {categoriesData.map((category, index) => (
                                        <option key={index} value={category.value}>{category.label}</option>
                                    ))}
                                    {/* Add other options here */}
                                </select>
                                {/* Video Type */}
                                <select
                                    style={{
                                        padding: '8px 12px',
                                        fontSize: '16px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#f2f2f2',
                                        color: '#333',
                                        height:'50px',
                                        width: '280px',
                                        marginTop:'0px',
                                        marginLeft:'10px'
                                    }}
                                    value={selectedvideotype}
                                    onChange={(event) => setSelectedvideotype(event.target.value)}
                                >
                                    <option value="">Select Video Type</option>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    {/* Add other options here */}
                                </select>
                            </div>
                            {/* Media Upload */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <input
                                    accept="video/*"
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
                                                {file.type === 'video' && (
                                                    <video controls src={file.previewUrl} style={{ maxWidth: '250px', maxHeight: '250px', marginTop: 16 }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Box>

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
        </>
  );
}

export default Youtubepost;