import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Close } from "@mui/icons-material";
import TextFieldComponent from "../Fields/Textfield";
import ButtonComponent from "../Fields/Buttonfield";

interface Media {
  id: number;
  type: string; // 'image' or 'video'
  url: string;
}

interface Props {
  eventId: number | null;
  open: boolean;
  onClose: () => void;
}

const capitalizeFirstLetter = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const EventDetailsDialog: React.FC<Props> = ({ eventId, open, onClose }) => {
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (eventId !== null) {
          const response = await axios.get(`${process.env.REACT_APP_Fast_API}/scheduled_details/${eventId}`);
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

  const handleCloseDialog = () => {
    // Handle close dialog logic here
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
            />
            <TextFieldComponent
              style={{ marginBottom: 20 }}
              label="Platform"
              value={capitalizeFirstLetter(eventDetails.platform_name)}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextFieldComponent
                style={{ flex: 1, marginBottom: 20 }}
                label="Post Type"
                value={capitalizeFirstLetter(eventDetails.post_type)}
                />
                <TextFieldComponent
                style={{flex: 1, marginBottom: 20, marginLeft: 10}}
                label="Schedule Type"
                value={capitalizeFirstLetter(eventDetails.sch_type) }
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextFieldComponent
                style={{ flex: 1, marginBottom: 20 }}
                label="Date"
                value={date}
                InputProps={{
                    readOnly: true,
                }}
                />
                <TextFieldComponent
                style={{ flex: 1, marginBottom: 20, marginLeft: 10 }}
                label="Time"
                value={time}
                InputProps={{
                    readOnly: true,
                }}
                />
            </div>
            {media.map(item => (
              item.type === "image" ? (
                <img key={item.id} src={`data:image/jpeg;base64,${item.url}`} alt={`Image ${item.id}`} style={{ width: '60%', height: '60%', margin: 5 }} />
              ) : (
                <video key={item.id} controls style={{ width: '60%', height: '60%', margin: 5 }}>
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
            <ButtonComponent variant="contained" onClick={handleCloseDialog}>Update</ButtonComponent>
            <ButtonComponent variant="contained" onClick={handleCloseDialog}>Delete</ButtonComponent>
            </>
        )}
        </DialogActions>
    </Dialog>
  );
};

export default EventDetailsDialog;

