import { useMediaQuery } from "@mui/material";
import { CssBaseline, TextField, Button } from "@mui/material";
import SideNav from "../Components/Navbar";
import { useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const localizer = momentLocalizer(moment);

interface Event {
    title: string;
    start: Date;
    end: Date;
    Details: string;
    color: string;
}

const ManagePost = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const defaultEvents: Event[] = [
        {
            title: 'Meeting',
            start: new Date(2024, 1, 28, 10, 0),
            end: new Date(2024, 1, 28, 12, 0),
            Details: "Meeting with the team",
            color: 'blue'
        },
        {
            title: 'Lunch',
            start: new Date(2024, 1, 28, 12, 0),
            end: new Date(2024, 1, 28, 13, 0),
            Details: "Lunch with clients",
            color: 'green'
        },
    ];

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div style={{ display: 'flex', backgroundImage: `url(${defaultImagePath})`, backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom right', height: '100vh' }}>
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
                            events={defaultEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ background: 'rgba(255,255,255,0.8)' }}
                            onSelectSlot={(slotInfo) => console.log(slotInfo)}
                            selectable
                            onSelectEvent={handleEventClick}
                            defaultView="month"
                            views={['month', 'agenda']}
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
                        value={selectedEvent?.Details}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        style={{ margin: '10px 0' }}
                        label="Start"
                        value={selectedEvent?.start.toLocaleString()}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        style={{ margin: '10px 10px' }}
                        label="End"
                        value={selectedEvent?.end.toLocaleString()}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </DialogContent>
                <DialogActions style={{ margin: '0 auto' , paddingBottom:'30px' }}>
                    <Button variant="contained" onClick={handleCloseDialog}>Update</Button>
                    <Button variant="contained" onClick={handleCloseDialog}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ManagePost;
