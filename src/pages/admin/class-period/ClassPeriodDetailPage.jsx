import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import FormComponent from '../../../components/common/FormComponent';
import CardComponent from '../../../components/common/CardComponent';
import CardInformation from '../../../components/common/CardInformation';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import CircularIndeterminate from '../../../components/loading/LoadingCircle';
import { useGetClassPeriodByIdQuery, useDeleteClassPeriodMutation } from '../../../services/classPeriodApi';
import { calculatePeriod, formatTimeTo12Hour } from '../../../utils/formatData';
import { setModal, setSnackbar } from '../../../store/slices/uiSlice';

function ClassPeriodDetailPage() {

  const [rows, setRows] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, isSuccess } = useGetClassPeriodByIdQuery(id);
  const [classPeriodToDelete, setClassPeriodToDelete] = useState(null);
  const [deleteClassPeriod, { isLoading: isDeleting, isSuccess: isDeleteSuccess, isError: isDeleteError }] =
    useDeleteClassPeriodMutation(id);
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => state.ui);

  useEffect(() => {
    if (data && isSuccess) {
      setRows(periodDetail);
    }
  }, [data, isSuccess, isDeleteSuccess]);

  useEffect(() => {
    if (isDeleting) {
      dispatch(
        setSnackbar({ open: true, message: 'Deleting...', severity: 'info' }),
      );
    } else if (isDeleteError) {
      dispatch(setSnackbar({ open: true, message: error.data.message, severity: 'error' }));
    } else if (isDeleteSuccess) {
      dispatch(
        setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' }),
      );
      navigate('/admin/class-periods');
    }
  }, [dispatch, isDeleteError, isDeleteSuccess, isDeleting]);

  // Handle loading state
  if (isLoading) {
    return <CircularIndeterminate />;
  }

  // Handle error state
  if (error) {
    return <div>Error loading class periods: {error.message}</div>;
  }

  // Handle EDIT action
  const clickEdit = () => {
    navigate(`/admin/class-periods/update/${id}`);
  };

  const { period_id, start_time, end_time } = data.data;

  // Handle DELETE action
  const clickDetele = () => {
    setClassPeriodToDelete(data.data);
    dispatch(setModal({ open: true }));
  };

  const confirmDelete = async () => {
    dispatch(setModal({ open: false }));
    await deleteClassPeriod(classPeriodToDelete.period_id).unwrap();
  };

  // Define formatted data to display
  const periodDetail = {
    'Class Period ID': period_id,
    'Start Time': formatTimeTo12Hour(start_time),
    'End Time': formatTimeTo12Hour(end_time),
    Period: calculatePeriod(start_time, end_time),
  };

  return (
    <FormComponent
      title={'Class Period Detail'}
      subTitle={'These are Class Period’s information'}
    >
      <CardComponent
        title={'Class Period Information'}
        handleEdit={clickEdit}
        handleDelete={clickDetele}
      >
        <CardInformation data={rows} />
      </CardComponent>
      <DeleteConfirmationModal
        open={modal.open}
        onClose={() => dispatch(setModal({ open: false }))}
        onConfirm={confirmDelete}
        itemName="Class Period"
      />

    </FormComponent>
  );
}

export default ClassPeriodDetailPage;
