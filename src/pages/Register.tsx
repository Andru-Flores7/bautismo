
import React, { useState } from 'react';
import Header from '@/components/Header';
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import QRGenerator from '@/components/QRGenerator';
import { Student, getStudents } from '@/utils/storage';

const Register: React.FC = () => {
  const [lastAddedStudent, setLastAddedStudent] = useState<Student | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleStudentAdded = () => {
    // Get the most recently added student
    const students = getStudents();
    if (students.length > 0) {
      // Get the last added student (assuming it's the last in the array)
      setLastAddedStudent(students[students.length - 1]);
    }
    
    // Trigger refresh of student list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Registro de Alumnos</h1>
          
          <div className="mb-8">
            <StudentForm onStudentAdded={handleStudentAdded} />
          </div>
          
          {lastAddedStudent && (
            <QRGenerator student={lastAddedStudent} />
          )}
          
          <div>
            <StudentList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
