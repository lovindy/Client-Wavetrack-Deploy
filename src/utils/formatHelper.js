// Utility: Capitalize the first letter of each word
export const capitalize = (name) =>
  name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

// Utility: Format Date to a more readable format ("DD/MM/YYYY")
export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// Utility: Ensure phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{3,6})$/);
  return match
    ? `(+${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
    : phoneNumber;
};

// Utility: Get user age
export const getAge = (dob) => {
  const birthDate = new Date(dob);
  return new Date().getFullYear() - birthDate.getFullYear();
};

// Utility: Calculation to get period of hour
export const calculatePeriod = (startTime, endTime) => {
  const diff = Math.abs(
    new Date(`1970-01-01T${endTime}Z`) - new Date(`1970-01-01T${startTime}Z`),
  );
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

// Utility: Format into standard hour AM or PM
export const formatTimeTo12Hour = (timeString) => {
  let [hours, minutes] = timeString.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
};

// Utility: Get Full Name from API response
export const getFullName = (info) =>
  info ? `${info.first_name} ${info.last_name}` : 'N/A';

// Helper function to determine profile key
export const getProfileKey = (role) =>
  role === 'admin' ? 'adminProfile' : 'teacherProfile';

// This is the function for formatting the time
export const formatStartEndTime = (classData) => {
  const time = `${formatTimeTo12Hour(classData.start_time)} - ${formatTimeTo12Hour(classData.end_time)}`;
  return time;
};

// Utility: Format time to HH:MM
export const formatTimeToHHMM = (time) => {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};
