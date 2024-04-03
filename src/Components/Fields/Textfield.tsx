import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface TextFieldProps {
  label?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onFocus?: (e: any) => void;
  suggestion?: string;
  startAdornment?: JSX.Element;
  type?: string;
  maxLength?: number;
  style?: React.CSSProperties;
  InputProps?:any;
  disabled? : boolean;
}

const TextFieldComponent: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  suggestion,
  startAdornment,
  type = 'text',
  maxLength,
  style,
  disabled
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
      helperText={suggestion}
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
        endAdornment: endAdornmentComponent,
      }}
      inputProps={{ maxLength }}
      style={style}
      disabled= {disabled || false}
      autoComplete='false'
    />
  );
};

export default TextFieldComponent;
