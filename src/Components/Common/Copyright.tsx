import { Link, Typography } from "@mui/material";

export default function Copyright(props: any) {
  // CopyRight Declaration
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="">
          Social Canvas
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }