import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import StyledButton from './StyledMuiButton';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CreateModal = ({
  open,
  onClose,
  title,
  description,
  fields,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({}); // Reset form after submission
      onClose();
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <TextField
            select
            fullWidth
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            variant="outlined"
          >
            {field.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'time':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              fullWidth
              value={
                formData[field.name]
                  ? dayjs(formData[field.name], 'HH:mm')
                  : null
              }
              onChange={(newValue) => {
                handleChange({
                  target: {
                    name: field.name,
                    value: newValue ? newValue.format('HH:mm') : '',
                  },
                });
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  error: !!errors[field.name],
                  helperText: errors[field.name],
                },
              }}
            />
          </LocalizationProvider>
        );
      default:
        return (
          <TextField
            variant="outlined"
            fullWidth
            type={field.type || 'text'}
            placeholder={field.placeholder || field.label}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            multiline={field.multiline}
            rows={field.multiline ? 4 : 1}
            slotProps={{
              input: {
                startAdornment: field.icon && (
                  <InputAdornment position="start">{field.icon}</InputAdornment>
                ),
              },
            }}
          />
        );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={'bold'} pb={2}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        )}
      </Box>
      <DialogContent>
        <Stack spacing={2} mt={2}>
          {fields.map((field) => (
            <Box
              key={field.name}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              <Typography variant="body2" fontWeight="bold">
                {field.label}{' '}
                {field.required && (
                  <span style={{ color: 'red', marginLeft: 1 }}>*</span>
                )}
              </Typography>
              {renderField(field)}
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ py: 3, px: 3 }}>
        <StyledButton onClick={onClose} size="large">
          Cancel
        </StyledButton>
        <StyledButton
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 4 }}
        >
          Create
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateModal;
