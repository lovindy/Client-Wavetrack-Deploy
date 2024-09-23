import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stack, Box, Button, Snackbar, Alert } from '@mui/material';
import { PlusIcon } from 'lucide-react';
import FormComponent from '../../../components/common/FormComponent';
import DataTable from '../../../components/common/DataTable';
import SearchComponent from '../../../components/common/SearchComponent';
import {
  useGetAllTeachersQuery,
  useDeleteTeacherMutation,
} from '../../../services/teacherApi';
import LoadingCircle from '../../../components/loading/LoadingCircle';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { teacherData } from '../../../utils/formatData';

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Phone Number' },
];

const TeacherListPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Get all teachers
  const {
    data: allTeachersData,
    isLoading,
    isSuccess,
  } = useGetAllTeachersQuery({
    search: searchTerm,
  });
  // Delete teacher
  const [deleteTeacher, { isLoading: isDeleting, isSuccess: isDeleteSuccess }] =
    useDeleteTeacherMutation();
  // Format data with conditions
  useEffect(() => {
    if (isSuccess && allTeachersData) {
      const formattedData = teacherData(allTeachersData.data);
      setRows(formattedData);
    }
  }, [allTeachersData, isSuccess, isDeleteSuccess]);
  // search function
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // handle edit
  const handleEdit = (row) => {
    navigate(`/admin/teachers/update/${row.id}`);
  };
  // handle delete by row
  const handleDelete = (row) => {
    setItemToDelete(row.id);
    setIsOpen(true);
  };
  // handle view
  const handleView = (row) => {
    navigate(`/admin/teachers/${row.id}`);
  };
  // confirm delete
  const confirmDelete = async () => {
    try {
      setIsOpen(false);
      setSnackbarMessage('Deleting teacher');
      setSnackbarOpen(true);
      await deleteTeacher(itemToDelete).unwrap();
      setSnackbarMessage('Teacher deleted successfully');
    } catch (error) {
      setSnackbarMessage('Failed to delete teacher');
    } finally {
      setSnackbarOpen(true);
    }
  };

  // loading state
  if (isLoading) {
    return <LoadingCircle />;
  }

  return (
    // header
    <FormComponent
      title="Teacher List"
      subTitle={`There are ${rows.length} Teachers`}
    >
      <Stack direction="row" justifyContent="flex-end">
        {/* add student button */}
        <Link to="/admin/teachers/create">
          <Button
            size="large"
            variant="contained"
            color="primary"
            startIcon={<PlusIcon size={20} />}
          >
            ADD TEACHER
          </Button>
        </Link>
      </Stack>
      {/* search by name */}
      <Box>
        <Stack
          direction="row"
          justifyContent={'flex-end'}  
          width={'100%'}
          gap={2}
        >
         <SearchComponent
          sx={{ width: '100%', maxWidth: '300px' }}
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          onClickIcon={() => console.log('search icon clicked')}
        />
        </Stack>
      </Box>
      {/* data table */}
      <DataTable
        rows={rows}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        hideColumns={['phoneNumber', 'email']}
        emptyTitle="No Teachers"
        emptySubTitle="No Teachers Available"
      />
      {/* delete confirmation modal */}
      <DeleteConfirmationModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={confirmDelete}
        itemName="Teacher"
      />
      {/* snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            isDeleting
              ? 'info'
              : snackbarMessage.includes('Failed')
                ? 'error'
                : 'success'
          }
          sx={{ width: '100%' }}
        >
          {isDeleting ? 'Deleting...' : snackbarMessage}
        </Alert>
      </Snackbar>
    </FormComponent>
  );
};

export default TeacherListPage;
