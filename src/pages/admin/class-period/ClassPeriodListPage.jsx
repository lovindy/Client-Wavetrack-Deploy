import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import { PlusIcon } from 'lucide-react';
import DataTable from '../../../components/common/DataTable';
import FormComponent from '../../../components/common/FormComponent';
import CircularIndeterminate from '../../../components/loading/LoadingCircle';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import { useGetClassPeriodQuery, useDeleteClassPeriodMutation } from '../../../services/classPeriodApi';
import { calculatePeriod, formatTimeTo12Hour } from '../../../utils/formatHelper';
import { setModal, setSnackbar } from '../../../store/slices/uiSlice';

// Define table columns title
const tableTitles = [
  { id: 'period_id', label: 'ID' },
  { id: 'start_time', label: 'Start Time' },
  { id: 'end_time', label: 'End Time' },
  { id: 'period', label: 'Period' },
];

function ClassPeriodListPage() {
  // useState: "data to be displayed" and "data to be deleted"
  const [rows, setRows] = useState([]);
  const [classPeriodToDelete, setClassPeriodToDelete] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modal } = useSelector((state) => state.ui);

  // useGetClassPeriodQuery : return a function to fetch all subject records
  const { data, isError, isLoading, isSuccess } = useGetClassPeriodQuery();

  // useDeleteClassPeriodMutation : returns a function to delete a subject
  const [ deleteClassPeriod, {
      isLoading: isDeleting,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error }
  ] = useDeleteClassPeriodMutation();

  useEffect(() => {
    // set the rows state when subject records are fetched successfully
    if (data && isSuccess) {
      setRows(periodData);
    }

    // Show a snackbar with messages during delete (progress, failure, success)
    if (isDeleting) {
      dispatch( setSnackbar({
        open: true,
        message: 'Deleting...',
        severity: 'info'
      }));
    } else if (isDeleteError) {
      dispatch( setSnackbar({
        open: true,
        message: error.data.message,
        severity: 'error'
      }));
    } else if (isDeleteSuccess) {
      dispatch( setSnackbar({
        open: true,
        message: 'Deleted successfully',
        severity: 'success'
      }));
      navigate('/admin/class-periods');
    }
  }, [  data, dispatch, isSuccess, isDeleting, isDeleteSuccess, isDeleteError ]);

  // Handle loading state
  if (isLoading) {
    return <CircularIndeterminate />;
  }

  // Handle error state
  if (isError) {
    console.log('error message :', error.data.message);
  }

  // Handle DELETE action
  const handleDelete = (rows) => {
    setClassPeriodToDelete(rows);
    dispatch(setModal({ open: true }));
  };

  const confirmDelete = async () => {
    dispatch(setModal({ open: false }));
    await deleteClassPeriod(classPeriodToDelete.period_id).unwrap();
  };

  

  // Handle DELETE ALL action
  const handleSelectedDelete = () => {
    console.log('Delete all');
  };

  // Handle DETAIL action
  const handleView = (row) => {
    navigate(`/admin/class-periods/${row.period_id}`);
  };

  // Handle EDIT action
  const handleEdit = (row) => {
    navigate(`/admin/class-periods/update/${row.period_id}`);
  };

  // Define formatted data to display
  const periodData = data.data.map((item) => {
    const { period_id, start_time, end_time } = item;
    return {
      period_id: period_id,
      start_time: formatTimeTo12Hour(start_time),
      end_time: formatTimeTo12Hour(end_time),
      period: calculatePeriod(start_time, end_time),
    };
  });

  return (
    <FormComponent
      title={'Class Period List'}
      subTitle={`There are total ${rows.length} Class Periods`}
    >
      {/* Button to add a new class period */}
      <Stack direction="row" justifyContent="flex-end">
        <Link to="/admin/class-periods/create">
          <Button
            size="large"
            variant="contained"
            color="primary"
            startIcon={<PlusIcon size={20} />}
          >
            ADD PERIOD
          </Button>
        </Link>
      </Stack>
      <DeleteConfirmationModal
        open={modal.open}
        onClose={() => dispatch(setModal({ open: false }))}
        onConfirm={confirmDelete}
        itemName="Class Period"
      />

      {/* Data table to display class periods */}
      <DataTable
        rows={rows}
        columns={tableTitles}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelectedDelete={handleSelectedDelete}
        hideColumns={'period_id'}
        emptyTitle="No Class Periods"
        emptySubTitle="No class periods available"
      />
    </FormComponent>
  );
}

export default ClassPeriodListPage;
