import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/utils/storage';
import html2canvas from "html2canvas";

interface QRGeneratorProps {
  student: Student;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ student }) => {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // Descargar el QR como PNG para máxima compatibilidad móvil
  const downloadPNG = async () => {
    if (!qrContainerRef.current) return;
    try {
      // Clona el SVG y lo inserta en un div temporal para renderizarlo como HTML
      const svgElement = qrContainerRef.current.querySelector('svg');
      if (!svgElement) throw new Error('No se encontró el SVG del QR');
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(svgElement.cloneNode(true));
      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: "#fff"
      });
      document.body.removeChild(tempDiv);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-${student.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Éxito",
        description: "QR descargado correctamente como PNG",
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
        <Button onClick={downloadPNG} className="mt-2 bg-orange-500 hover:bg-black active:bg-black focus:bg-black text-white transition-colors">
          Descargar QR
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
