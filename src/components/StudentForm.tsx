import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { addStudent, getStudents } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface StudentFormProps {
  onStudentAdded: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onStudentAdded }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Campo vacío",
        description: "Por favor ingresa el nombre del alumno antes de registrar.",
        variant: "destructive",
      });
      return;
    }
    // Validar solo letras y números (sin caracteres especiales)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+$/.test(name.trim())) {
      toast({
        title: "Nombre inválido",
        description: "Solo se permiten letras y números en el nombre.",
        variant: "destructive",
      });
      return;
    }
    // Validar que no exista un alumno con el mismo nombre (insensible a mayúsculas/minúsculas)
    const existing = getStudents().find(
      s => s.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) {
      toast({
        title: "Alumno ya registrado",
        description: "Ese alumno ya está registrado. Elimínalo si deseas volver a ingresarlo.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      addStudent(name);
      setName("");
      onStudentAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar al alumno",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Alumno</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              disabled={isSubmitting}
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-400 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar y Generar QR"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
