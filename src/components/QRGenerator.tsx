import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import { Student } from '@/utils/storage';

interface QRGeneratorProps {
  student: Student;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ student }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = async () => {
    if (!qrRef.current) return;

    try {
      const canvas = await html2canvas(qrRef.current);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-${student.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = url;
      link.click();
      toast({
        title: "Éxito",
        description: "QR descargado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar el código QR",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center">Código QR para {student.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div 
          ref={qrRef} 
          className="qr-container mb-4"
        >
          <QRCodeSVG 
            value={student.qrCode}
            size={240} // Más grande
            level="H"
            includeMargin
            bgColor="#FFFFFF"
            fgColor="#000000" // Negro puro para máximo contraste
          />
          <div className="mt-2 text-center text-sm font-medium">
            {student.name}
          </div>
        </div>
        
        <Button onClick={downloadQR} className="mt-2 bg-orange-500 hover:bg-black active:bg-black focus:bg-black text-white transition-colors">
          Descargar QR
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
