import React, { useState, useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getStudents as getStudentsFirestore, Student } from '@/utils/firestoreStudents';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check } from 'lucide-react';

interface StudentListProps {
  refreshTrigger?: number; // To trigger refresh from parent
}

const StudentList: React.FC<StudentListProps> = ({ refreshTrigger }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Suscripción en tiempo real a la colección de alumnos
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      const students = snapshot.docs.map((doc) => doc.data() as Student);
      setStudents(students);
      setLoading(false);
    }, (error) => {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los alumnos',
        variant: 'destructive',
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>No hay alumnos registrados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alumnos Registrados ({students.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Registro</TableHead>
                <TableHead>Asistencia</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(student.registrationDate)}</TableCell>
                  <TableCell>
                    {student.attended ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" /> {formatDate(student.attendanceDate)}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Pendiente
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentList;
