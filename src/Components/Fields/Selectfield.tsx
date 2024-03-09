import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  ListItemAvatar,
  Avatar,
  SelectChangeEvent,
} from '@mui/material';

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  startAdornment?: JSX.Element;
  options: { value: string; label: string; avatar?: string }[]; // Make avatar property optional
}

const SelectComponent: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  startAdornment,
  options,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">
        {label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        label = {label}
        value={value}
        onChange={handleChange}
        startAdornment={
          <InputAdornment position="start">
            {startAdornment}
          </InputAdornment>
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {option.avatar && (
                <ListItemAvatar>
                  <Avatar src={option.avatar} alt={option.label} />
                </ListItemAvatar>
              )}
              <span>{option.label}</span>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
