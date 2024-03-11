import React from 'react';
import { Button } from '@mui/material';

interface ButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  onClick?: () => void; 
  children :  React.ReactNode;
  style? : React.CSSProperties;
  href? : string;
  type? : 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  startIcon?: React.ReactNode; 
}

const ButtonComponent: React.FC<ButtonProps> = ({
  variant,onClick,children,style,href,type,fullWidth,startIcon
}) => {

    const validvariant = variant? variant : 'contained';

  return (
    <Button variant={validvariant} 
        onClick={onClick} 
        style={style} 
        href={href} 
        type={type} 
        color='primary' 
        fullWidth={fullWidth}
        startIcon={startIcon}>
      {children}
    </Button>
  );
};

export default ButtonComponent;
