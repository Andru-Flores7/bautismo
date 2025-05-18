export interface Student {
  id: string;
  name: string;
  qrCode: string;
  attended: boolean;
  registrationDate: string;
  attendanceDate?: string;
}

// Initialize localStorage with empty students if not exists
const initializeStorage = (): void => {
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify([]));
  }
};

// Get all students
export const getStudents = (): Student[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('students') || '[]');
};

// Add a new student
export const addStudent = (name: string): Student => {
  const students = getStudents();
  
  // Create a unique ID
  const id = Date.now().toString();
  
  // QR code ahora contiene id y nombre
  const qrCode = `${id}:${name}`;
  
  const newStudent: Student = {
    id,
    name,
    qrCode,
    attended: false,
    registrationDate: new Date().toISOString(),
  };
  
  students.push(newStudent);
  localStorage.setItem('students', JSON.stringify(students));
  
  return newStudent;
};

// Find student by QR code
export const findStudentByQR = (qrCode: string): Student | undefined => {
  // Si el QR contiene ':', extraer solo el id
  const id = qrCode.includes(':') ? qrCode.split(':')[0] : qrCode;
  const students = getStudents();
  return students.find(student => student.id === id);
};

// Mark student as attended
export const markAttendance = (qrCode: string): Student | null => {
  const students = getStudents();
  const studentIndex = students.findIndex(student => student.qrCode === qrCode);
  
  if (studentIndex === -1) {
    return null;
  }
  
  // Only mark attendance if not already attended
  if (!students[studentIndex].attended) {
    students[studentIndex].attended = true;
    students[studentIndex].attendanceDate = new Date().toISOString();
    localStorage.setItem('students', JSON.stringify(students));
  }
  
  return students[studentIndex];
};

// Delete a student by ID
export const deleteStudent = (id: string): boolean => {
  const students = getStudents();
  const newStudents = students.filter(student => student.id !== id);
  
  if (newStudents.length === students.length) {
    return false; // No student was deleted
  }
  
  localStorage.setItem('students', JSON.stringify(newStudents));
  return true;
};

// Get attendance stats
export const getStats = () => {
  const students = getStudents();
  
  return {
    total: students.length,
    attended: students.filter(student => student.attended).length,
    notAttended: students.filter(student => !student.attended).length,
  };
};
