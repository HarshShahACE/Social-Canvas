import { TextField, useMediaQuery } from "@mui/material";
import {  Button } from "@mui/material";
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
                
                    // Group events by start time
                    const groupedEvents: { [key: string]: Event[] } = {};
                    jsonData.forEach((item: any) => {
                        const startTime = new Date(item.sch_user_time).toISOString();
                        if (!groupedEvents[startTime]) {
                            groupedEvents[startTime] = [];
                        }
                        groupedEvents[startTime].push({
                            ...item,
                            id: item.id,
                            title : `${item.content}\n${item.platform_name}`,
                            platform_name: item.platform_name,
                            content: item.content,
                            start: new Date(item.sch_user_time),
                            end: new Date(item.sch_user_time),
                        });
                    });
                
                    // Flatten the grouped events
                    const formattedEvents: Event[] = [];
                    Object.keys(groupedEvents).forEach((key) => {
                        formattedEvents.push(...groupedEvents[key]);
                    });
                
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

    return (
        <div style={{ display: 'flex', backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom right', height: '100vh' }}>
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
                        views={['month', 'day', 'agenda']}
                        // Render multiple events for the same time slot
                        eventPropGetter={(event, start, end, isSelected) => {
                            const backgroundColor = event.color;
                            return { style: { backgroundColor } };
                        }}
                        // Show all events in day cells
                        dayPropGetter={(date: Date) => {
                            const dayEvents = events.filter((event) => {
                                const eventStart = event.start;
                                if (eventStart) {
                                    const eventStartDate = new Date(eventStart);
                                    return eventStartDate.getDate() === date.getDate() && eventStartDate.getMonth() === date.getMonth() && eventStartDate.getFullYear() === date.getFullYear();
                                }
                                return false;
                            });
                            return { style: {}, className: '', events: dayEvents };
                        }}

                        />
                    </div>
                </main>
            </div>
            {/* Event details dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} style={{  }}>
                <DialogTitle align="center" style={{ marginTop: '10px', marginBottom: '0' }}>{selectedEvent?.content}</DialogTitle>
                <DialogContent style={{ marginTop: '0', marginBottom: '0' }}>
                    <TextField
                        style={{ margin: '10px 0' }}
                        label="Content"
                        fullWidth
                        multiline
                        value={selectedEvent?.content || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        style={{ margin: '10px 0' }}
                        label="Plateform"
                        fullWidth
                        multiline
                        value={selectedEvent?.platform_name || ''}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        style={{ margin: '10px 0' }}
                        label="Date & Time"
                        value={selectedEvent?.start ? selectedEvent.start.toLocaleString() : ''}
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
    );
};

export default ManagePost;
