import { useMediaQuery } from "@mui/material";
import { CssBaseline, TextField, Button } from "@mui/material";
import SideNav from "../Components/Navbar";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from "axios";

const localizer = momentLocalizer(moment);

interface Event extends CalendarEvent {
    id: number; // Include id property
    Details: string;
    color: string;
    sch_user_time: string; // Add sch_user_time property
    platform_name: string; // Add platform_name property
    content: string; // Add content property
}

const ManagePost = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [events, setEvents] = useState<Event[]>([]); // Store events received from API

    const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
    if (idString !== null) {
        var id = parseInt(idString);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/scheduled_posts/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const jsonData = response.data;

                    // Map the response data to event objects
                    const formattedEvents: Event[] = jsonData.map((item: any) => ({
                        ...item,
                        id: item.id, // Assign the id
                        title: item.platform_name, // Assign platform_name to title
                        start: new Date(item.sch_user_time),
                        end: new Date(item.sch_user_time),
                        Details: item.content, // Assign content to Details
                        color: getRandomColor(), // Assign random color
                    }));

                    setEvents(formattedEvents);
                } else {
                    console.log('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the fetchData function

    }, []); // Add id as dependency to useEffect

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Function to generate random color
    const getRandomColor = () => {
        const colors = [
            'rgba(54, 162, 235, 0.8)', // Dark blue
            'rgba(255, 99, 132, 0.8)', // Dark red
            'rgba(255, 206, 86, 0.8)', // Dark yellow
            // Add more colors as needed
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div style={{
            display: 'flex', backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom right', height: '100vh'
        }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <CssBaseline />
            {/* Sidebar */}
            <SideNav />
            {/* Main content */}
            <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px', marginLeft: isMobile ? '20px' : '240px' }}>
                    <div style={{ height: '80vh', width: '80vw', padding: '20px' }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ background: 'rgba(255,255,255,0.8)' }}
                            onSelectSlot={(slotInfo) => console.log(slotInfo)}
                            selectable
                            onSelectEvent={handleEventClick}
                            defaultView="month"
                            views={['month','day' ,'agenda']}
                        />
                    </div>
                </main>
            </div>
            {/* Event details dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} style={{ borderRadius: '30px' }}>
                <DialogTitle align="center" style={{ marginTop: '10px', marginBottom: '0' }}>{selectedEvent?.title}</DialogTitle>
                <DialogContent style={{ marginTop: '0', marginBottom: '0' }}>
                    <TextField
                        style={{ margin: '10px 0' }}
                        label="Details"
                        fullWidth
                        multiline
                        value={selectedEvent?.Details || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        style={{ margin: '10px 0' }}
                        label="Start"
                        value={selectedEvent?.start ? selectedEvent.start.toLocaleString() : ''}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        style={{ margin: '10px 10px' }}
                        label="End"
                        value={selectedEvent?.end ? selectedEvent.end.toLocaleString() : ''}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </DialogContent>
                <DialogActions style={{ margin: '0 auto', paddingBottom: '30px' }}>
                    <Button variant="contained" onClick={handleCloseDialog}>Update</Button>
                    <Button variant="contained" onClick={handleCloseDialog}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ManagePost;
