import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import CSS file for calendar styling
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import SideNav from "../Components/Common/Navbar";
import PostDetails from "../Components/Manage_Post/Post_Details";
import LoadingScreen from "../Components/Common/Loading";
import NoDataPopup from "../Components/Common/NoDatapop";

const localizer = momentLocalizer(moment);

// Define interface for calendar events
interface Event extends CalendarEvent {
    id: number; // Include id property
    Details: string;
    sch_user_time: string; // Add sch_user_time property
    platform_name: string; // Add platform_name property
    content: string; // Add content property
}

// Define functional component ManagePost
const ManagePost = () => {
    // Check for mobile screen
    const isMobile = useMediaQuery('(max-width:600px)');
    // Default image path
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;
    // Loading state
    const [loading,setloading] = useState(false);

    // State for selected event and dialog
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    // State for events, popup and selected view
    const [events, setEvents] = useState<Event[]>([]); // Store events received from API
    const [showPopup, setShowPopup] = useState(false);
    const [selectedView, setSelectedView] = useState<'month' | 'agenda'>('month');

    // Close popup handler
    const handlePopupClose = () => {
        setShowPopup(false);
    };

    // Retrieve id from session storage
    const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
    const id = idString ? parseInt(idString) : undefined;

    // Fetch data from API
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

    // Event click handler
    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setOpenDialog(true);
    };

    // Close dialog handler
    const handleCloseDialog = () => {
        window.location.reload();
        setOpenDialog(false);
    };

    // Custom toolbar component
    const CustomToolbar = (toolbar : any) => {
        const goToToday = () => {
            toolbar.onNavigate('TODAY');
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };

        const goToBack = () => {
            toolbar.onNavigate('PREV');
        };

        const handleViewChange = (view: 'month' | 'agenda') => {
            toolbar.onView(view);
            setSelectedView(view);
        };

        return (
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" onClick={goToToday}>Today</button>
                    <button type="button" onClick={goToBack}>{"<"}</button>
                    <button type="button" onClick={goToNext}>{">"}</button>
                </span>
                <span className="rbc-toolbar-label">{toolbar.label}</span>
                <span className="rbc-btn-group">
                <button className={selectedView === 'month' ? 'rbc-active' : ''} type="button" onClick={() => handleViewChange('month')}>Month</button>
                <button className={selectedView === 'agenda' ? 'rbc-active' : ''} type="button" onClick={() => handleViewChange('agenda')}>Agenda</button>
            </span>
            </div>
        );
    };

    // Return JSX
    return (
        <div style={{ display: 'flex', backgroundColor:'#FFFFFF' , backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom right', height: '100vh' }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
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
                            style={{ background: 'rgba(250,250,250,0.7)' , padding:'20px' , boxShadow: '0px 4px 8px rgba(67, 131, 197, 0.9)' }}
                            onSelectSlot={(slotInfo) => console.log(slotInfo)}
                            selectable
                            onSelectEvent={handleEventClick}
                            defaultView="month"
                            views={['month', 'agenda']}
                            components={{
                                toolbar: CustomToolbar,
                            }}
                            // Render multiple events for the same time slot
                            eventPropGetter={(event, start, end, isSelected) => {
                                const backgroundColor = '#';
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
            <PostDetails eventId={selectedEvent?.id ?? null} plateform={selectedEvent?.platform_name??null} open={openDialog} onClose={handleCloseDialog} />
        </div>
    );
};

export default ManagePost;
