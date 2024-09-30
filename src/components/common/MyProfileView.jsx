import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import RandomAvatar from '../common/RandomAvatar';
import EditAccountModal from '../admin/EditAccountModal';

import {
  PencilLine as EditIcon,
  Mail as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  User2 as PersonIcon,
  Cake as CakeIcon,
  School as SchoolIcon,
  IdCard as IdCardIcon,
} from 'lucide-react';

const MyProfileView = ({
  title,
  adminProfileData,
  schoolProfileData,
  handleEditSchool,
  handleEditUser,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: adminProfileData.first_name,
    lastName: adminProfileData.last_name,
    userPhoto: adminProfileData.userPhoto,
  });

  const handleSave = (newData) => {
    setUserData(newData);
    // Here you would typically also send this data to your backend
    console.log('Saving user data:', newData);
    // You might want to call handleEditUser here if it's meant to update the backend
    if (handleEditUser) {
      handleEditUser(newData);
    }
  };

  const {
    userName,
    userEmail,
    userPhoto,
    userPhoneNumber,
    userAddress,
    userGender,
    userId,
    userDOB,
  } = adminProfileData;
  const { schoolName, schoolAddress, schoolPhoneNumber, schoolId } =
    schoolProfileData;

  return (
    <Box sx={{ margin: 'auto', p: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              textAlign: 'center',
            }}
          >
            {/* <RandomAvatar
              key={user.username}
              username={user.username}
              gender={user.gender}
              size={80}
            /> */}
            <Avatar
              src={userPhoto}
              sx={{ width: 120, height: 120, margin: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {userName}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {userEmail}
            </Typography>
            <Chip
              label={`ID: ${userId}`}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon size={20} />}
                onClick={() => setIsEditModalOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                Edit
              </Button>

              <EditAccountModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={adminProfileData}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <InfoItem
                icon={<PhoneIcon />}
                label="Phone"
                value={userPhoneNumber}
              />
              <InfoItem
                icon={<HomeIcon />}
                label="Address"
                value={userAddress}
              />
              <InfoItem
                icon={<PersonIcon />}
                label="Gender"
                value={userGender}
              />
              <InfoItem
                icon={<CakeIcon />}
                label="Date of Birth"
                value={userDOB}
              />
            </Grid>
          </Box>
        </Grid>

        {/* School Information */}

        <Grid item xs={12}>
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" gutterBottom>
                School Information
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon size={20} />}
                onClick={handleEditSchool}
                sx={{ textTransform: 'none' }}
              >
                Edit
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <InfoItem
                icon={<SchoolIcon />}
                label="School Name"
                value={schoolName}
              />
              <InfoItem
                icon={<HomeIcon />}
                label="School Address"
                value={schoolAddress}
              />
              <InfoItem
                icon={<PhoneIcon />}
                label="School Phone"
                value={schoolPhoneNumber}
              />
              <InfoItem
                icon={<IdCardIcon />}
                label="School ID"
                value={schoolId}
              />
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'primary.main',
          borderRadius: 2,
          color: 'white',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  </Grid>
);

export default MyProfileView;