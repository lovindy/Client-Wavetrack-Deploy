// React and third-party libraries
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Custom components
import FormComponent from '../../../components/common/FormComponent';
import CardComponent from '../../../components/common/CardComponent';
import CardInformation from '../../../components/common/CardInformation';
import LoadingCircle from '../../../components/loading/LoadingCircle';

// Redux API and slice
import {
  useGetTeacherQuery,
  useDeleteTeacherMutation,
} from '../../../services/teacherApi';
import { setSnackbar } from '../../../store/slices/uiSlice';

// Format data
import { formatTeacherDetail } from '../../../utils/formatData';
// Update Modal
import UpdateTeacherForm from '../../../components/teacher/UpdateTeacherForm';
// Delete Modal
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';

function TeacherDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formattedTeacher, setFormattedTeacher] = useState([]);

  // Get teacher information through API
  const { data: teacherData, isLoading, fetchError } = useGetTeacherQuery(id);
  // Delete teacher information through API
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  // Format teacher data and set it in the state
  useEffect(() => {
    if (teacherData) {
      setFormattedTeacher(formatTeacherDetail(teacherData));
    }
  }, [teacherData]);

  // Handle for edit modal
  const handleEdit = () => {
    setSelectedTeacherId(id);
    setIsUpdateOpen(true);
  };

  // Open delete confirmation modal when user clicks on delete button
  const handleDelete = () => {
    setItemToDelete(id);
    setIsOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      setIsOpen(false);
      await deleteTeacher(itemToDelete).unwrap();
      dispatch(
        setSnackbar({
          open: true,
          message: 'Teacher deleted successfully',
          severity: 'success',
        }),
      );
      navigate('/admin/teachers');
    } catch (error) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Failed to delete teacher',
          severity: 'error',
        }),
      );
    }
  };

  // loading and error states
  if (isLoading || isDeleting) return <LoadingCircle />;
  if (fetchError) return <div>Error loading teacher details</div>;

  return (
    <>
      {/* Header */}
      <FormComponent
        title="Teacher Detail"
        subTitle="These are the teacher's detailed information"
      >
        {/* Card Component */}
        <CardComponent
          title="Teacher Information"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          data={teacherData.data}
          imgUrl={teacherData.data.Info.photo}
        >
          {/* Card Data */}
          <CardInformation data={formattedTeacher} />
        </CardComponent>
      </FormComponent>
      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={confirmDelete}
        itemName="Teacher"
      />
      {/* Update teacher form */}
      <UpdateTeacherForm
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        teacherId={selectedTeacherId}
      />
    </>
  );
}

export default TeacherDetailPage;
