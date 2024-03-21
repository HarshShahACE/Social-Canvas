import React from 'react';
import { Modal, Box, TextField, useMediaQuery, IconButton } from '@mui/material';
import timezonedata from '../../assets/timezones.json';
import ButtonComponent from '../Fields/Buttonfield';
import { Close } from '@mui/icons-material';

interface SchedulePopupProps {
    value : string;
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string;
    handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedTime: string;
    handleTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedTimezone: string;
    setSelectedTimezone: (timezone: string) => void;
    handleScheduleClick: () => void;
}

const SchedulePopup: React.FC<SchedulePopupProps> = ({ value, isOpen, onClose, selectedDate, handleDateChange, selectedTime, handleTimeChange, selectedTimezone, setSelectedTimezone, handleScheduleClick }) => {

    const currentDate = new Date().toISOString().split('T')[0];

    // Calculate one month from today
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const oneMonthFromNowString = oneMonthFromNow.toISOString().split('T')[0];

    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: '#F2F2F2', p: 4, width: 'fit-content', borderRadius: '20px'}}>
                <Box sx={{ marginBottom: '10px' }}>
                    <div style={{display:'flex' , justifyContent:'space-between' , alignItems:'center'}}>
                        <h2 style={{marginBottom:'20px' , fontSize:'20px' , textAlign:'center' , color:'#000000'}}>{value}</h2>
                        <IconButton onClick={onClose} style={{marginLeft:'20px'}}> 
                            <Close />
                        </IconButton>
                    </div>
                    <TextField
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        style={{ marginRight: '10px', width: '150px' }}
                        inputProps={{
                            min: currentDate, // Set the min attribute to the current date
                            max :  oneMonthFromNowString // Set the max attribute
                        }}
                    />
                    <TextField
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        style={{ marginRight: '10px', width: '150px' , marginTop: isMobile? '10px' : '0px' }}
                        
                    />
                </Box>
                    <select
                        id="timezone"
                        value={selectedTimezone}
                        onChange={(e) => setSelectedTimezone(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            backgroundColor: '#f2f2f2',
                            color: '#333',
                            height:'50px',
                            width: '310px',
                            marginTop: '10px',
                        }}
                    >
                        <option value="">Select a timezone</option>
                        {timezonedata.map((timezone, index) => (
                            <option key={index} value={timezone.value}>{timezone.label}</option>
                        ))}
                    </select>
                
                <ButtonComponent variant="contained" style={{ margin: '20px auto', display: 'block'}} onClick={handleScheduleClick}>
                    Submit
                </ButtonComponent>
            </Box>
        </Modal>
    );
};

export default SchedulePopup;
