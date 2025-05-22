import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent, Student } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface StudentListProps {
  refreshTrigger?: number; // To trigger refresh from parent
}

const StudentList: React.FC<StudentListProps> = ({ refreshTrigger }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); // Estado para la búsqueda

  useEffect(() => {
    setLoading(true);
    const students = getStudents();
    setStudents(students);
    setLoading(false);
  }, [refreshTrigger]);

  // Filtrar alumnos por nombre (insensible a mayúsculas/minúsculas)
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <CardTitle>Alumnos Registrados ({filteredStudents.length})</CardTitle>
        <input
          type="text"
          placeholder="Buscar alumno por nombre..."
          className="mt-2 p-2 border rounded w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
              {filteredStudents.map((student) => (
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
                          // Crear un SVG QR en base64 usando QRCodeSVG y abrirlo en una ventana
                          const svgString = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><foreignObject width='100%' height='100%'><div xmlns='http://www.w3.org/1999/xhtml' style='background:#fff;display:flex;align-items:center;justify-content:center;height:100%;width:100%;'><div id='qr-svg'></div></div></foreignObject></svg>`;
                          // Crear un contenedor temporal en el DOM
                          const tempDiv = document.createElement('div');
                          document.body.appendChild(tempDiv);
                          import('react-dom/client').then(ReactDOM => {
                            ReactDOM.createRoot(tempDiv).render(
                              React.createElement(QRCodeSVG, {
                                value: student.qrCode,
                                size: 320,
                                level: 'H',
                                includeMargin: true,
                                bgColor: '#fff',
                                fgColor: '#000',
                              })
                            );
                            setTimeout(() => {
                              const svg = tempDiv.querySelector('svg');
                              if (svg) {
                                const svgData = new XMLSerializer().serializeToString(svg);
                                const base64 = window.btoa(unescape(encodeURIComponent(svgData)));
                                const imgSrc = `data:image/svg+xml;base64,${base64}`;
                                const qrWindow = window.open('', '_blank', 'width=400,height=500');
                                if (qrWindow) {
                                  qrWindow.document.write(`<!DOCTYPE html><html><head><title>QR de ${student.name}</title></head><body style='display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;'><img src='${imgSrc}' width='320' height='320' alt='QR de ${student.name}'/><div style='margin-top:16px;font-family:sans-serif;font-size:18px;color:#f97316;font-weight:bold;text-align:center'>${student.name}</div></body></html>`);
                                  qrWindow.document.close();
                                }
                              }
                              document.body.removeChild(tempDiv);
                            }, 100);
                          });
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
