import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/utils/storage';

interface QRGeneratorProps {
  student: Student;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ student }) => {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // Descargar el SVG del QR directamente, compatible con todos los navegadores
  const downloadSVG = () => {
    if (!qrContainerRef.current) return;
    // Busca el primer SVG dentro del contenedor
    const svg = qrContainerRef.current.querySelector('svg');
    if (!svg) return;
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${student.name.replace(/\s+/g, '-').toLowerCase()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
        <div className="qr-container mb-4" ref={qrContainerRef}>
          <QRCodeSVG
            value={student.qrCode}
            size={240}
            level="H"
            includeMargin
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
          <div className="mt-2 text-center text-sm font-medium">
            {student.name}
          </div>
        </div>
        <Button onClick={downloadSVG} className="mt-2 bg-orange-500 hover:bg-black active:bg-black focus:bg-black text-white transition-colors">
          Descargar QR
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
