import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent, Student } from '@/utils/storage';
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
    const students = getStudents();
    setStudents(students);
    setLoading(false);
  }, [refreshTrigger]);

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
                      <Button 
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-xs rounded-full"
                        onClick={() => {
                          import('@/utils/storage').then(({ markAttendance, getStudents }) => {
                            markAttendance(student.qrCode);
                            setStudents(getStudents());
                            toast({ title: 'Asistencia registrada', description: `Se marcó asistencia para ${student.name}` });
                          });
                        }}
                      >
                        Marcar presente
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-orange-500 text-orange-500 hover:bg-orange-100"
                        onClick={() => {
                          const qrWindow = window.open('', '_blank', 'width=400,height=500');
                          if (qrWindow) {
                            qrWindow.document.write(`<!DOCTYPE html><html><head><title>QR de ${student.name}</title></head><body style='display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;'><div id='qr-root'></div><div style='margin-top:16px;font-family:sans-serif;font-size:18px;color:#f97316;font-weight:bold;text-align:center'>${student.name}</div><script src='https://cdn.jsdelivr.net/npm/qrcode.react@1.0.0/umd/qrcode.react.min.js'></script><script>window.onload=function(){QRCodeReact.QRCodeSVG({value:'${student.qrCode}',size:320,level:'H',includeMargin:true,bgColor:'#fff',fgColor:'#000'}).render(document.getElementById('qr-root'))}</script></body></html>`);
                            qrWindow.document.close();
                          }
                        }}
                      >
                        Ver QR
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (deleteStudent(student.id)) {
                            setStudents(getStudents());
                            toast({ title: 'Eliminado', description: 'Alumno eliminado correctamente.' });
                          } else {
                            toast({ title: 'Error', description: 'No se pudo eliminar el alumno.', variant: 'destructive' });
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
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
