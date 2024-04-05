import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import axios from "axios";
import SideNav from "../Components/Common/Navbar";
import PostDetails from "../Components/Manage_Post/Post_Details";
import LoadingScreen from "../Components/Common/Loading";
import PopUpModel from "../Components/Common/PopupModel";
import { useMediaQuery } from "@mui/material";

// Define interface for event
interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    platform_name: string;
}

// Define functional component ManagePost
const ManagePost: React.FC = () => {

    // Check for mobile screen
    const isMobile = useMediaQuery('(max-width:600px)');

    // Default image path
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE || '';

    // Loading state
    const [loading, setLoading] = useState(false);

    // State for selected event and dialog
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    // State for events, popup and selected view
    const [events, setEvents] = useState<Event[]>([]); // Store events received from API
    const [showPopup, setShowPopup] = useState(false);

    // Retrieve id from session storage
    const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
    const id = idString ? parseInt(idString) : undefined;

    // Fetch data from API
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/scheduled_posts/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const jsonData = response.data;
                    const formattedEvents: Event[] = jsonData.map((item: any) => ({
                        id: String(item.id),
                        title: `${item.content}\n${item.platform_name}`,
                        start: new Date(item.sch_user_time),
                        end: new Date(item.sch_user_time),
                        platform_name: item.platform_name,
                    }));
                    setEvents(formattedEvents);
                    console.log(events);
                    setLoading(false);
                } else {
                    console.log('Error:', response.statusText);
                    setShowPopup(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setShowPopup(true);
                setLoading(false);
                
            }
        };
        fetchData(); // Call the fetchData function
    }, []);

    // Event click handler
    const handleEventClick = (info: any) => {
        const clickedEvent: Event = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            platform_name: info.event.extendedProps.platform_name, // Access platform_name from extendedProps
        };
        setSelectedEvent(clickedEvent);
        setOpenDialog(true);
    };

    // Close dialog handler
    const handleCloseDialog = () => {
        window.location.reload();
        setOpenDialog(false);
    };

    // Close popup handler
    const handlePopupClose = () => {
        setShowPopup(false);
    };

    const eventid = selectedEvent ? parseInt(selectedEvent.id, 10) : null;
    console.log(selectedEvent?.platform_name);

    return (
        <div style={{ display: 'flex', backgroundColor:'#FFFFFF', backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom right', height: '100vh' }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            {/* Sidebar */}
            <SideNav />
            <PopUpModel
                isOpen={showPopup}
                onClose={handlePopupClose}
                content="No Data Found"
                success={false}
            />
            {loading && <LoadingScreen />}
            {/* Main content */}
            <div style={{ flex: 1 }}>
                <main style={{height:'80vh' , width:'80vw', marginTop: '100px', marginLeft: isMobile ? '20px' : '240px', border:'2px solid black' , background:'rgba(240,240,240,0.7)' , padding:'15px' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]} // Include list plugin
                        initialView="dayGridMonth" // Set initial view to timeGridWeek
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,listWeek', // Add listWeek and listDay to the toolbar
                        }}
                        selectable={true}
                        events={events}
                        eventClick={handleEventClick}
                        height="100%" // Adjust the height as needed
                    />
                </main>
            </div>
            {/* Event details dialog */}
            <PostDetails eventId={eventid} plateform={selectedEvent?.platform_name || null} open={openDialog} onClose={handleCloseDialog} />
        </div>
    );
};

export default ManagePost;
