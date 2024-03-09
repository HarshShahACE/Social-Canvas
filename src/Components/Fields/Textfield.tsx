import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  startAdornment?: JSX.Element;
  type?: string;
  maxLength?: number;
}

const TextFieldComponent: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  startAdornment,
  type = 'text',
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const endAdornmentComponent =
    type === 'password' ? (
      <InputAdornment position="end">
        <IconButton onClick={handleTogglePasswordVisibility}>
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    ) : undefined;

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      label={label}
      type={type === 'password' && !showPassword ? 'password' : 'text'}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
        endAdornment: endAdornmentComponent,
      }}
      inputProps={{ maxLength }}
    />
  );
};

export default TextFieldComponent;
