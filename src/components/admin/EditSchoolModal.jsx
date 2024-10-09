// React and third-party libraries
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// Redux Hooks and APIs
import {
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
} from '../../services/userApi';
import { useDispatch } from 'react-redux';

// - School formatted Data and Validator
import { getSchoolData } from '../../utils/formatData';
import { SchoolValidator } from '../../validators/validationSchemas';

// - Ui Slice for snackbar
import { setSnackbar } from '../../store/slices/uiSlice';

// Material UI components
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Modal,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

// - Lucid Icons
import { NotebookPen, Phone } from 'lucide-react';

// - Custom Components
import StyledButton from '../common/StyledMuiButton';
import InputField from '../common/InputField';
import PhoneInputField from '../common/PhoneInputField';

const EditSchoolModal = ({ open, onClose }) => {
  // - State to store user data for the school
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // - Fetch user profile data
  const { data: userProfile, isLoading, isSuccess } = useGetUserProfileQuery();

  // - Mutation hook for updating the profile
  const [
    updateUserProfile,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      isSuccess: isUpdateSuccess,
      error: updateError,
    },
  ] = useUpdateUserProfileMutation();

  // - State to store original form values
  const [originalData, setOriginalData] = useState(null);

  // - Form state management
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(SchoolValidator),
    defaultValues: {
      school_name: '',
      school_address: '',
      school_phone_number: '',
    },
  });

  // - useEffect hook to fetch user profile data and set default values
  useEffect(() => {
    if (isSuccess && userProfile) {
      const formattedData = getSchoolData(userProfile);
      // Dynamically set the form default values
      reset(formattedData);
      // Store the original data for comparison
      setOriginalData(formattedData);
    }
  }, [isSuccess, userProfile, reset]);

  // - Handle form submission
  const onSubmit = async (data) => {
    const currentData = getValues();

    // Compare current data with the original data
    if (JSON.stringify(currentData) === JSON.stringify(originalData)) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'No changes detected',
          severity: 'info',
        }),
      );
      return;
    }

    try {
      await updateUserProfile(data).unwrap();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle UI feedback
  useEffect(() => {
    if (isUpdateError) {
      dispatch(
        setSnackbar({
          open: true,
          message: updateError.data.message,
          severity: 'error',
        }),
      );
    } else if (isUpdateSuccess) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Updated successfully',
          severity: 'success',
        }),
      );
      onClose();
    }
  }, [
    isUpdateLoading,
    isUpdateError,
    isUpdateSuccess,
    updateError,
    dispatch,
    navigate,
  ]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!isSuccess || !userProfile) {
    return <Typography variant="h6">No user data found</Typography>;
  }

  return (
    <Modal open={open} onClose={onClose}>
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
          Edit School
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2 }}>
            <Grid item xs={12} sm={6}>
              {/* SCHOOL NAME INPUT */}
              <InputField
                name="school_name"
                control={control}
                label="School Name"
                placeholder="Enter your school name"
                errors={errors}
                icon={NotebookPen}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {/* SCHOOL CONTACT NUMBER INPUT WITH COUNTRY CODE */}
              <PhoneInputField
                name="school_phone_number"
                control={control}
                label="School Contact"
                errors={errors}
              />
            </Grid>

            <Grid item xs={12}>
              {/* SCHOOL ADDRESS INPUT */}
              <InputField
                name="school_address"
                control={control}
                label="Street Address"
                placeholder="Phnom Penh, Street 210, ..."
                errors={errors}
                multiline
                minRows={5}
                required={false}
              />
            </Grid>

            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              {/* BUTTONS */}
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
        </form>
      </Box>
    </Modal>
  );
};

export default EditSchoolModal;
