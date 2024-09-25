import FormComponent from '../../../components/common/FormComponent';
import UpdateTeacherForm from '../../../components/teacher/UpdateTeacherForm';

function TeacherUpdatePage() {
  return (
    <>
      {/* Header */}
      <FormComponent
        title="UPDATE TEACHER"
        subTitle="Please Update Teacher Information"
      >
        {/* Form edit */}
        <UpdateTeacherForm/>
      </FormComponent>
    </>
  );
}

export default TeacherUpdatePage;
