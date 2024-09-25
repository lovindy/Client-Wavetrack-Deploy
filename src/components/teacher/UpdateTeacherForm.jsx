import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useGetTeacherQuery, useUpdateTeacherMutation } from '../../services/teacherApi';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { setSnackbar } from "../../store/slices/uiSlice"
import SubHeader from './SubHeader';
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Avatar,
  Typography,
  Stack,
  FormControl,
  Select,
} from '@mui/material';
import { useDispatch } from 'react-redux';

const validationSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  phone_number: yup.string().required('Phone number is required'),
  gender: yup.string().required('Gender is required'),
  dob: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .typeError('Invalid date format'),
  address: yup.string().required('Address is required'),
});
const TeacherInfo = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // - useGetTeacherQuery : fetch the teacher data with the id
  // - useUpdateTeacherMutation : a hook that returns a function to update the teacher data
  const { data: teacherData, isLoading, isError, isSuccess } = useGetTeacherQuery(id);
  const [updateTeacher, { isLoading: isUpdating, isError : isUpdateError, isSuccess: isUpdateSuccess, error : updateError }] = useUpdateTeacherMutation();
  
  // dob : data date of birth
  const [dob, setDob] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      gender: '',
      dob: '',
      address: '',
    },
  });

  // - when the teacherData records are fetched successfully,and set the form state
  useEffect(() => {
    if (teacherData && isSuccess) {
      console.log('this data in useEffect : ', teacherData);
      const formattedDate = dayjs(teacherData.data.Info.dob);
      reset({
        ...teacherData.data.Info,
        dob: formattedDate,
      });
      setDob(formattedDate);
      console.log('this dob :', formattedDate);
    }
  }, [teacherData, isSuccess]);

  // when update is in progress, show a snackbar with a message "updating.."
  // when update is failed, show a snackbar with an error message
  // when update is successful, show a snackbar with a success message and navigate to the teacher list page
  useEffect(() => {
    if (isUpdating) {
      dispatch(setSnackbar({ open: true, message: 'Updating...', severity: 'info' }));
    } else if (isUpdateError) {
      dispatch(setSnackbar({ open: true, message: updateError.data.message, severity: 'error' }));
    } else if (isUpdateSuccess) {
      dispatch(setSnackbar({ open: true, message: 'Updated successfully', severity: 'success' }));
      navigate('/admin/teachers');
    }
  }, [isUpdating, isUpdateError, isUpdateSuccess, dispatch, navigate]);

// handle cancel
  const handleCancel = () => {
    navigate(`/admin/teachers`);
  };
  // handle onSubmit
  const onSubmit = async (data) => {
   console.log('this submit!!!!! : ', data);
   console.log(' this is id :', id);
   await updateTeacher(id , data);
  };
  const testing =async () =>{
    await updateTeacher(6 , {});
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form>
        <Box sx={profileBox}>
          <Box sx={valueBoxOne}>
            <Avatar sx={imgStyle} alt="profile picture" src="r" />
          </Box>
          <SubHeader title={'Teacher Information'} />
          <Box display={'flex'} flexDirection={'row'} sx={boxContainer}>
            {/* First Name */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <Box sx={textFieldGap}>
                <Typography>First Name</Typography>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="First Name"
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>
            {/* Last Name */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <Box sx={textFieldGap}>
                <Typography>Last Name</Typography>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="Last Name"
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
          {/* Phone Number */}
          <Box sx={{ ...textFieldGap, width: '100%' }}>
            <Typography>Phone Number</Typography>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Phone Number"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  fullWidth
                />
              )}
            />
          </Box>
          {/* Gender */}
          <Box sx={{ ...textFieldGap, width: '100%' }}>
            <Typography>Gender</Typography>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.gender}>
                  <Select
                    {...field}
                    displayEmpty
                    error={!!errors.gender}
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Box sx={{ color: '#B5B5B5' }}>Select Gender</Box>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  <Typography variant="caption" color="error">
                    {errors.gender?.message}
                  </Typography>
                </FormControl>
              )}
            />
          </Box>
          {/* Date of Birth */}
          <Box sx={{ ...textFieldGap, width: '100%' }}>
            <Typography>Date of Birth</Typography>
            <Controller
              name="dob"
              control={control}
              rules={{
                required: 'Date of birth is required',
                validate: (value) => {
                  if (!value) {
                    return 'Date of birth is required';
                  }
                  if (dayjs(value).isAfter(dayjs())) {
                    return 'Date of birth cannot be in the future';
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <DesktopDatePicker
                  inputFormat="MM/DD/YYYY"
                  value={dob}
                  onChange={(newValue) => {
                    setDob(newValue);
                    field.onChange(newValue);
                  }}
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      error: !!error,
                      helperText: error ? error.message : '',
                      fullWidth: true,
                    },
                  }}
                />
              )}
            />
          </Box>
          {/* Address */}
          <Box sx={{ ...textFieldGap, width: '100%' }}>
            <Typography>Address</Typography>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Address"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  fullWidth
                />
              )}
            />
          </Box>
          {/* Buttons */}
          <Stack
            direction={'row'}
            alignSelf={'flex-end'}
            justifyContent={'flex-end'}
            width={{ xs: '100%', sm: '340px' }}
            gap={{ xs: 1, sm: 2 }}
          >
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button fullWidth type="submit" variant="contained" color="primary" onClick={testing}>
              Update
            </Button>
          </Stack>
        </Box>
      </form>
    </LocalizationProvider>
  );
};

export default TeacherInfo;

// Styles
const boxContainer = {
  width: '100%',
  marginTop: '16px',
  gap: {
    xs: '12px',
    sm: 3,
  },
};
const profileBox = {
  border: '1px solid',
  borderColor: '#E0E0E0',
  borderRadius: '8px',
  bgcolor: '#ffffff',
  marginTop: '32px',
  padding: {
    xs: 2,
    sm: 3,
  },
  gap: {
    xs: '12px',
    sm: 3,
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative',
};
const valueBoxOne = {
  width: 100,
  height: 100,
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mb: 2,
  position: 'relative',
};

const textFieldGap = {
  display: 'flex',
  gap: 0.5,
  flexDirection: 'column',
};

const imgStyle = {
  width: {
    xs: 120,
    sm: 160,
  },
  height: {
    xs: 120,
    sm: 160,
  },
};
