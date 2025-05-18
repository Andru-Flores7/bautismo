import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export interface Student {
  id: string;
  name: string;
  qrCode: string;
  attended: boolean;
  registrationDate: string;
  attendanceDate?: string;
}

const STUDENTS_COLLECTION = "students";

// Agregar alumno a Firestore
export const addStudent = async (name: string): Promise<Student> => {
  const id = Date.now().toString();
  const qrCode = id;
  const newStudent: Student = {
    id,
    name,
    qrCode,
    attended: false,
    registrationDate: new Date().toISOString(),
  };
  await addDoc(collection(db, STUDENTS_COLLECTION), newStudent);
  return newStudent;
};

// Obtener todos los alumnos
export const getStudents = async (): Promise<Student[]> => {
  const snapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
  return snapshot.docs.map((doc) => doc.data() as Student);
};

// Buscar alumno por QR
export const findStudentByQR = async (qrCode: string): Promise<Student | undefined> => {
  const q = query(collection(db, STUDENTS_COLLECTION), where("qrCode", "==", qrCode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return undefined;
  return snapshot.docs[0].data() as Student;
};

// Marcar asistencia
export const markAttendance = async (qrCode: string): Promise<Student | null> => {
  const q = query(collection(db, STUDENTS_COLLECTION), where("qrCode", "==", qrCode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const studentDoc = snapshot.docs[0];
  const student = studentDoc.data() as Student;
  if (!student.attended) {
    await updateDoc(doc(db, STUDENTS_COLLECTION, studentDoc.id), {
      attended: true,
      attendanceDate: new Date().toISOString(),
    });
    return { ...student, attended: true, attendanceDate: new Date().toISOString() };
  }
  return student;
};
