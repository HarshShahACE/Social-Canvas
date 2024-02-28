import React from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import TimezoneSelect, { ITimezone , allTimezones  } from "react-timezone-select";

interface SchedulePopupProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string;
    handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedTime: string;
    handleTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedTimezone: ITimezone;
    setSelectedTimezone: (timezone: ITimezone) => void;
    handleScheduleClick: () => void;
}

const SchedulePopup: React.FC<SchedulePopupProps> = ({ isOpen, onClose, selectedDate, handleDateChange, selectedTime, handleTimeChange, selectedTimezone, setSelectedTimezone, handleScheduleClick }) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, width: 'fit-content', borderRadius: '20px'}}>
                <Box sx={{ marginBottom: '10px' }}>
                    <h2 style={{marginBottom:'20px' , fontSize:'20px' , textAlign:'center'}}>Select Time For Post</h2>
                    <TextField
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        style={{ marginRight: '10px', width: '150px' }}
                    />
                    <TextField
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        style={{ marginRight: '10px', width: '150px' }}
                    />
                    <TimezoneSelect
                        value={selectedTimezone}
                        onChange={setSelectedTimezone}
                        timezones={{
                            ...allTimezones,
                            'America/Lima': 'Pittsburgh',
                            'Europe/Berlin': 'Frankfurt',
                        }}
                        styles={{
                            control: (provided) => ({ ...provided, position: 'relative', width: '310px' , marginTop:'20px' }),
                            menu: (provided) => ({ ...provided, top: 'unset', bottom: 'calc(100% + 4px)', position: 'absolute' })
                        }}
                    />
                </Box>
                <Button variant="contained" style={{ margin: '20px auto', display: 'block'}} onClick={handleScheduleClick}>
                    Submit
                </Button>
            </Box>
        </Modal>
    );
};

export default SchedulePopup;
