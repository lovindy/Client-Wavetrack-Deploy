import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Stack, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { fieldContainer } from '../../../styles/authStyle';
import CardComponent from '../../../components/common/CardComponent';
import FormComponent from '../../../components/common/FormComponent';
import ButtonContainer from '../../../components/common/ButtonContainer';
import { useCreateSubjectMutation } from '../../../services/subjectApi';
import { SubjectValidator } from '../../../validators/validationSchemas';
import { setSnackbar } from '../../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SubjectCreatePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SubjectValidator),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const [
    createSubject,
    {
      isLoading: isCreating,
      isError: isUpdateError,
      isSuccess: isCreateSuccess,
      error: updateError,
    },
  ] = useCreateSubjectMutation();

  useEffect(() => {
    if (isCreating) {
      dispatch(
        setSnackbar({ open: true, message: 'Creating...', severity: 'info' }),
      );
    } else if (isUpdateError) {
      dispatch(
        setSnackbar({
          open: true,
          message: updateError.data.message,
          severity: 'error',
        }),
      );
    } else if (isCreateSuccess) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Subject created successfully',
          severity: 'success',
        }),
      );
      navigate('/admin/subjects');
    }
  }, [dispatch, isUpdateError, isCreating, isCreateSuccess]);

  const onSubmit = async () => {
    try {
      const { name, description } = getValues();
      const formData = { name, description };
      await createSubject(formData).unwrap();
      console.log(formData);
    } catch (err) {
      console.log('error message :', err);
    }
  };

  return (
    <>
      <FormComponent
        title={'Add Subject'}
        subTitle={'Please Fill Subject information'}
      >
        <CardComponent title={'Subject Information'}>
          {/* subject name input container */}
          <Stack sx={fieldContainer}>
            <Typography variant="body1">Subject's Name</Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  placeholder="subject's name"
                  {...field}
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ''}
                />
              )}
            />
          </Stack>
          {/* description input container */}
          <Stack sx={fieldContainer}>
            <Typography variant="body1">Description</Typography>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  multiline
                  minRows={5}
                  placeholder="description"
                  {...field}
                />
              )}
            />
          </Stack>
          {/* Button Container  */}
          <ButtonContainer
            rightBtn={handleSubmit(onSubmit)}
            leftBtnTitle={'Cancel'}
            rightBtnTitle={'Add Subject'}
          />
        </CardComponent>
      </FormComponent>
    </>
  );
}

export default SubjectCreatePage;
