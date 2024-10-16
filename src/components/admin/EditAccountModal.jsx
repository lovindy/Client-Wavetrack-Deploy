import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';

// MUI Components
import {
  Modal,
  Box,
  TextField,
  Avatar,
  Typography,
  InputAdornment,
  Grid,
  MenuItem,
  Divider,
} from '@mui/material';

// - Custom Components
import StyledButton from '../common/StyledMuiButton';
import InputField from '../common/InputField';
import PhoneInputField from '../common/PhoneInputField';
import GenderSelect from '../common/GenderSelect';
import DOBPicker from '../common/DOBPicker';

// Redux Hooks and APIs
import {
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
} from '../../services/userApi';

// Formatted Data
import { getUserProfileUpdateData } from '../../utils/formatData';

//  User Profile Validator
import { UserProfileValidator } from '../../validators/validationSchemas';

// UI Slice for snackbar
import { setSnackbar } from '../../store/slices/uiSlice';
import {
  Calendar,
  ImagePlus,
  MapPin,
  Phone,
  Trash2,
  UserRoundPen,
  Users,
} from 'lucide-react';
import RandomAvatar from '../common/RandomAvatar';

const EditAccountModal = ({
  open,
  onClose,
  profilePhoto,
  userName,
  userGender,
}) => {
  // - Initialize dispatch and navigate hooks
  const dispatch = useDispatch();

  // - Redux hooks update user api
  const [updateUserProfile, { isLoading: isUpdateLoading, isError, error }] =
    useUpdateUserProfileMutation();

  // - Redux hooks get user api
  const { data: userProfile, isLoading, isSuccess } = useGetUserProfileQuery();

  // - State to store original form values
  const [originalData, setOriginalData] = useState(null);

  const [dob, setDob] = useState(null);

  console.log(originalData);

  // - State to store selected image file
  const [selectedFile, setSelectedFile] = useState(null);

  // - State to store the preview URL of the selected image
  const [previewUrl, setPreviewUrl] = useState(null);

  // Add a new state to track if the profile photo should be removed
  const [removePhoto, setRemovePhoto] = useState(false);

  // - Form state management
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(UserProfileValidator),
    defaultValues: {
      photo: '',
      first_name: '',
      last_name: '',
      gender: '',
      dob: '',
      phone_number: '',
      address: '',
    },
  });

  // Fetching and setting up the original user profile data
  useEffect(() => {
    if (isSuccess && userProfile) {
      const formattedData = getUserProfileUpdateData(userProfile);
      // Dynamically set the form default values
      reset(formattedData);
      // Store the original data for comparison
      setOriginalData(formattedData);
    }
  }, [isSuccess, userProfile, reset]);

  // Function to generate DiceBear URL
  const generateAvatarUrl = (username, gender) => {
    return `https://api.dicebear.com/6.x/big-smile/svg?seed=${encodeURIComponent(username)}&gender=${encodeURIComponent(gender)}`;
  };

  // - Handle image file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith('image/') &&
      file.size <= 5 * 1024 * 1024
    ) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Invalid image file',
          severity: 'error',
        }),
      );
    }
  };

  // - Handle form submission
  const onSubmit = async (data) => {
    const currentData = getValues();
    const isDataChanged =
      JSON.stringify(currentData) !== JSON.stringify(originalData);
    const isImageUploaded = selectedFile !== null;
    const isPhotoRemoved = removePhoto;

    if (!isDataChanged && !isImageUploaded && !isPhotoRemoved) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'No changes detected',
          severity: 'info',
        }),
      );
      return;
    }

    // Create a new FormData object for multipart/form-data
    const formData = new FormData();

    // Handle photo upload or removal
    if (selectedFile) {
      formData.append('photo', selectedFile);
    } else if (isPhotoRemoved) {
      formData.append('remove_photo', 'true');
    }

    // Append the other fields, excluding the old photo URL if it's part of the `data`
    Object.keys(data).forEach((key) => {
      if (key !== 'photo') {
        // Exclude old photo URL
        formData.append(key, data[key]);
      }
    });

    try {
      await updateUserProfile(formData).unwrap();
      dispatch(
        setSnackbar({
          open: true,
          message: 'Updated successfully',
          severity: 'success',
        }),
      );
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch(
        setSnackbar({
          open: true,
          message: error?.data?.message || 'Update failed',
          severity: 'error',
        }),
      );
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!isSuccess || !userProfile) {
    return <Typography variant="h6">No user data found</Typography>;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-account-modal-title"
      aria-describedby="edit-account-modal-description"
      sx={{ m: 2 }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          maxWidth: '800px',
          width: '100%',
          transform: 'translate(-50%, -50%)',
          maxHeight: { xs: '100%', sm: '100%' },
          overflowY: 'auto',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* HEADER */}
        <Typography
          variant="h5"
          component="h2"
          fontWeight={'bold'}
          gutterBottom
          mb={4}
        >
          Edit Account
        </Typography>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {/* PROFILE CONTAINER */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* PROFILE IMAGE */}
              {!removePhoto && (previewUrl || profilePhoto) ? (
                <Avatar
                  src={previewUrl || profilePhoto}
                  alt="Profile"
                  sx={{ width: 140, height: 140 }}
                />
              ) : (
                <RandomAvatar
                  username={userName}
                  gender={userGender}
                  size={140}
                />
              )}

              {/* UPLOAD PROFILE IMAGE */}
              <input
                accept="image/*"
                type="file"
                id="photo-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* PROFILE BUTTONS */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <label htmlFor="photo-upload">
                  <StyledButton
                    variant="contained"
                    component="span"
                    size="small"
                    fullWidth
                    startIcon={<ImagePlus size={20} />}
                  >
                    Change
                  </StyledButton>
                </label>
                <StyledButton
                  variant="outlined"
                  fullWidth
                  size="small"
                  color="error"
                  startIcon={<Trash2 size={20} />}
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setRemovePhoto(true);
                  }}
                >
                  Remove
                </StyledButton>
              </Box>
            </Box>

            <Divider />

            {/* INPUTS CONTAINER */}
            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={12} sm={6}>
                {/* FIRST NAME INPUT */}
                <InputField
                  name="first_name"
                  control={control}
                  label="First Name"
                  placeholder="First Name"
                  errors={errors}
                  icon={UserRoundPen}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* LAST NAME INPUT */}
                <InputField
                  name="last_name"
                  control={control}
                  label="Last Name"
                  placeholder="Last Name"
                  errors={errors}
                  icon={UserRoundPen}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* CONTACT NUMBER INPUT WITH COUNTRY CODE */}
                <PhoneInputField
                  name="phone_number"
                  control={control}
                  label="Contact Number"
                  errors={errors}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* STREET ADDRESS INPUT */}
                <InputField
                  name="address"
                  control={control}
                  label="Street Address"
                  placeholder="Phnom Penh, Street 210, ..."
                  errors={errors}
                  icon={MapPin}
                  required={false}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* GENDER INPUT */}
                <GenderSelect
                  control={control}
                  errors={errors}
                  name="gender"
                  label="Gender"
                  defaultValue={originalData?.gender}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* DOB INPUT */}
                <DOBPicker
                  control={control}
                  errors={errors}
                  name="dob"
                  dob={dob}
                  setDob={setDob}
                  defaultValue={
                    originalData?.dob ? dayjs(originalData.dob) : null
                  }
                />
              </Grid>

              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <Box
                  component={'div'}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  {/* CANCEL BUTTON */}
                  <StyledButton variant="outlined" fullWidth onClick={onClose}>
                    Cancel
                  </StyledButton>
                  {/* SAVE CHANGES BUTTON */}
                  <StyledButton type="submit" variant="contained" fullWidth>
                    {isUpdateLoading ? 'Saving...' : 'Save Changes'}
                  </StyledButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditAccountModal;
