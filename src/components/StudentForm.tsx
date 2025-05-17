
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { addStudent } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface StudentFormProps {
  onStudentAdded: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onStudentAdded }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Add student to storage
    try {
      addStudent(name.trim());
      toast({
        title: "Éxito",
        description: "Alumno registrado correctamente",
      });
      setName('');
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
            className="w-full" 
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
