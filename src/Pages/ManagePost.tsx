import { useMediaQuery } from "@mui/material";
import {CssBaseline} from "@mui/material";
import SideNav from "../Components/Navbar";
import { useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);



const ManagePost = () => {

    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    const [events, setEvents] = useState([]);

    // Example events
    const defaultEvents = [
        {
        title: 'Meeting',
        start: new Date(2024, 2, 28, 10, 0),
        end: new Date(2024, 2, 28, 12, 0),
        color : 'blue'
        },
        {
        title: 'Lunch',
        start: new Date(2024, 2, 28, 12, 0),
        end: new Date(2024, 2, 28, 13, 0),
        color : 'green'
        },
    ];

    return (
        <div style={{ display: 'flex' , backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain',
        backgroundRepeat:'no-repeat',
        backgroundPosition:'bottom right'  , height:'100vh' }}>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <CssBaseline />
          {/* Sidebar */}
          <SideNav/>
          {/* Main content */}
            <div style={{ flex: 1  }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px' , marginLeft: isMobile? '20px' : '240px'  }}>
                <div style={{ height: '100vh', padding: '20px' }}>
                    <Calendar
                        localizer={localizer}
                        events={events.length ? events : defaultEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{background:'rgba(255,255,255,0.8)'}}
                        onSelectSlot={(slotInfo) => console.log(slotInfo)}
                        selectable
                        onSelectEvent={(event) => console.log(event)}
                        defaultView="month"
                        views={['month', 'agenda']}
                    />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ManagePost;