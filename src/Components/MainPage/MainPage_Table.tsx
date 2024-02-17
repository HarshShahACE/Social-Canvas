import React from 'react';
import { Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SocialAccount = () => {
  const handleButtonClick = () => {
    // Handle button click
    window.open('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77yge4zxtkihuh&redirect_uri=https://www.aceinfoway.com/&scope=openid+profile+email+w_member_social', '_blank');
    window.location.href = '/Profile';
};

  const handleEditClick = (id : any) => {
    // Handle edit click for a specific row
    console.log(`Edit clicked for ID: ${id}`);
  };

  const handleDeleteClick = (id : any) => {
    // Handle delete click for a specific row
    console.log(`Delete clicked for ID: ${id}`);
  };

  return (
    <Card sx={{ maxWidth:'80%' , margin:'10px' , borderRadius:'20px' , padding:'20px' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Social Media Accounts</h2>
          <Button variant="contained" onClick={handleButtonClick}>Add</Button>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Platform Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Harsh Shah</TableCell>
                <TableCell>Linkedin</TableCell>
                <TableCell>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditClick(1)}>Edit</Button>
                  <Button variant="outlined" style={{marginLeft:'10px'}} startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(1)}>Delete</Button>
                </TableCell>
              </TableRow>
              {/* Add more rows here */}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default SocialAccount;
