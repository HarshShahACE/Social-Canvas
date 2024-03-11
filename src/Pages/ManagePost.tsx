import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import SideNav from "../Components/Common/Navbar";
import PostDetails from "../Components/Manage_Post/Post_Details";
import LoadingScreen from "../Components/Common/Loading";
import NoDataPopup from "../Components/Common/NoDatapop";

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
    const [loading,setloading] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [events, setEvents] = useState<Event[]>([]); // Store events received from API
    const [showPopup, setShowPopup] = useState(false);

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
    const id = idString ? parseInt(idString) : undefined;

    useEffect(() => {
        setloading(true);
        const fetchData = async () => {
            const timeoutId = setTimeout(() => {
                setloading(false);
                setShowPopup(true);
                }, 2000);
            try {
                if (id !== undefined) {
                    const response = await axios.get(`${process.env.REACT_APP_Fast_API}/scheduled_posts/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    clearTimeout(timeoutId);
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
                                title: `${item.content}\n${item.platform_name}`,
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
                        setloading(false);
                    } else {
                        console.log('Error:', response.statusText);
                        window.alert("No Data Found");
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the fetchData function

    }, [id]); // Add id as dependency to useEffect

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
            <NoDataPopup isOpen={showPopup} onClose={handlePopupClose} />
            {loading && <LoadingScreen />}
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
            <PostDetails eventId={selectedEvent?.id ?? null} open={openDialog} onClose={handleCloseDialog} />
        </div>
    );
};

export default ManagePost;
