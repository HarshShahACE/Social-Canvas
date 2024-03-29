import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Close } from "@mui/icons-material";
import TextFieldComponent from "../Fields/Textfield";
import ButtonComponent from "../Fields/Buttonfield";
import SchedulePopup from "../Schedule_Post/Schedule_Time";

interface Media {
  id: number;
  type: string; // 'image' or 'video'
  url: string;
}

interface Props {
  eventId: number | null;
  plateform : string | null;
  open: boolean;
  onClose: () => void;
}

const capitalizeFirstLetter = (str : string) => {
  // Check if str is defined and not null
  if (str && typeof str === 'string') {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  } else {
    return ''; // Return an empty string if str is undefined or null
  }
};

const EventDetailsDialog: React.FC<Props> = ({ eventId, plateform , open, onClose }) => {
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');

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

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (eventId !== null) {
          const response = await axios.get(`${process.env.REACT_APP_Fast_API}/scheduled_details/${plateform}/${eventId}`);
          if (response.status === 200) {
            setEventDetails(response.data);
            const eventData = response.data;
            const mediaItems: Media[] = [];
            for (let i = 1; i <= 3; i++) {
              const mediaKey = `media${i}`;
              if (eventData[mediaKey] && eventData[mediaKey] !== "MA==") {
                mediaItems.push({
                  id: i,
                  type: eventData.post_type === "video" ? "video" : "image",
                  url: eventData[mediaKey],
                });
              }
            }
            setMedia(mediaItems);
          } else {
            console.error('Error:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const [date, time] = eventDetails?.sch_user_time ? eventDetails.sch_user_time.split('T') : ['', ''];


  const [isOpen, setIsOpen] = useState(false);

  const handlepostupdatepopup = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleScheduleClick = async() => {
    try{

      const formattedTime = new Date(`${selectedDate}T${selectedTime}`).toISOString()

      if (eventId !== null) {
        const response = await axios.put(`${process.env.REACT_APP_Fast_API}/update_schedule_post/${eventDetails.platform_name}/${eventId}?time=${formattedTime}&timezone=${selectedTimezone}`,{
            headers: {
              'Content-Type': 'application/json',
            }
          });
        if (response.status === 200) {
          window.alert("Post Updated Successfully");
          window.location.reload();
        } else {
          console.error('Error:', response.statusText);
          window.alert("Error in Removing Post");
        }
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };


  const handlePostDelete = async () => {
    try {
      if (eventId !== null) {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (confirmed) {
          const response = await axios.post(`${process.env.REACT_APP_Fast_API}/remove_schedule_post/${eventDetails.platform_name}/${eventId}`);
          if (response.status === 200) {
            window.alert("Post Removed Successfully");
            window.location.reload();
          } else {
            console.error('Error:', response.statusText);
            window.alert("Error in Removing Post");
          }
        }
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const isDateTimePassed = (dateTimeString: string | number | Date) => {
    const scheduledDateTime = new Date(dateTimeString);
    const currentDateTime = new Date();
    return currentDateTime > scheduledDateTime;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        align="center"
        style={{ marginTop: '10px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        Post_Details
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
        <DialogContent style={{ marginTop: '0', marginBottom: '0' }}>
        {eventDetails && (
          <>
            <TextFieldComponent
              style={{ marginBottom: 20 , marginTop:10 }}
              label="Content"
              value={eventDetails.content}
              InputProps={{
                    readOnly: true,
                }}
            />
            {plateform === 'YouTube' &&
              <TextFieldComponent
              style={{ marginBottom: 20 , marginTop:10 }}
              label="Description"
              value={eventDetails.description}
              InputProps={{
                    readOnly: true,
                }}
            />
            }
            <TextFieldComponent
              style={{ marginBottom: 20 }}
              label="Platform"
              value={capitalizeFirstLetter(eventDetails.platform_name)}
              InputProps={{
                    readOnly: true,
                }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextFieldComponent
                style={{ flex: 1, marginBottom: 20 }}
                label="Post Type"
                InputProps={{
                    readOnly: true,
                }}
                value={capitalizeFirstLetter(eventDetails.post_type)}
                />
                <TextFieldComponent
                style={{flex: 1, marginBottom: 20, marginLeft: 10}}
                label="Schedule Type"
                InputProps={{
                  readOnly: true,
                }}
                value={capitalizeFirstLetter(eventDetails.sch_type) }
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextFieldComponent
                style={{ flex: 1 }}
                label="Date"
                value={date}
                InputProps={{
                    readOnly: true,
                }}
                />
                <TextFieldComponent
                style={{ flex: 1, marginLeft: 10 }}
                label="Time"
                value={time}
                InputProps={{
                    readOnly: true,
                }}
                
                />
            </div>
            {media.map(item => (
              item.type === "image" ? (
                <img key={item.id} src={`data:image/jpeg;base64,${item.url}`} alt={`${item.id}`} style={{ width: '60%', height: '60%'}} />
              ) : (
                <video key={item.id} controls style={{ width: '500px', height: '500px' }}>
                <source src={`data:video/mp4;base64,${item.url}`} type="video/mp4" />
                Your browser does not support the video tag.
                </video>
              )
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions style={{ margin: '0 auto', paddingBottom: '30px' }}>
        {eventDetails && eventDetails.sch_type === "schedule" && !isDateTimePassed(eventDetails.sch_user_time) && (
            <>
            <ButtonComponent variant="contained" onClick={handlepostupdatepopup}>Update</ButtonComponent>
            <ButtonComponent variant="contained" onClick={handlePostDelete}>Delete</ButtonComponent>
            </>
        )}
        </DialogActions>
        <SchedulePopup
            value="Update Time For Post"
            isOpen={isOpen}
            onClose={handleClose}
            selectedDate={selectedDate}
            handleDateChange={e => setSelectedDate(e.target.value)}
            selectedTime={selectedTime}
            handleTimeChange={handleTimeChange}
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
            handleScheduleClick={handleScheduleClick}
        />
    </Dialog>
  );
};

export default EventDetailsDialog;

