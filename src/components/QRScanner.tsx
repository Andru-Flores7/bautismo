import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from "html5-qrcode";

import { findStudentByQR, markAttendance } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Smartphone, Camera, CameraOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    setScanResult(null);
    setCameraError(false);

    try {
      // Iniciar el escaneo directamente con Html5Qrcode, sin pedir stream manualmente
      const html5QrCode = new Html5Qrcode("qr-scanner-container");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          console.log("QR scanning error:", errorMessage);
        }
      );

      setScanning(true);
    } catch (error) {
      console.error("Error starting scanner:", error);
      setCameraError(true);
      setScanning(false);
      toast({
        title: "Error",
        description: "No se pudo iniciar la cámara trasera. Verifica permisos y disponibilidad.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          console.log("Scanner stopped");
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        });
    }
    setScanning(false);
  };

  const handleScan = (result) => {
    if (!result) return;

    stopScanning();

    const student = findStudentByQR(result);

    if (!student) {
      setScanResult({
        success: false,
        message: "QR no reconocido. Este alumno no está registrado.",
        isFirstTime: false,
      });
      toast({
        title: "Error",
        description: "QR no reconocido",
        variant: "destructive",
      });
      return;
    }

    const isFirstTime = !student.attended;

    if (isFirstTime) {
      markAttendance(result);
      setScanResult({
        success: true,
        message: "¡Asistencia registrada exitosamente!",
        isFirstTime: true,
        studentName: student.name,
      });
      toast({
        title: "Éxito",
        description: `Asistencia registrada para ${student.name}`,
      });
    } else {
      setScanResult({
        success: true,
        message: "Este estudiante ya fue registrado anteriormente",
        isFirstTime: false,
        studentName: student.name,
      });
      toast({
        description: `${student.name} ya fue registrado anteriormente`,
      });
    }
  };

  return (
    <div className="space-y-4">
      {!scanning && !scanResult && !cameraError && (
        <div className="flex flex-col items-center space-y-4 p-4">
          <Smartphone className="h-16 w-16 text-primary" />
          <h3 className="text-xl font-medium">Escanear Código QR</h3>
          <p className="text-center text-muted-foreground">
            Haz clic en el botón para escanear el código QR del alumno
          </p>
          <Button onClick={startScanning} className="w-full">
            <Camera className="mr-2" />
            Iniciar Escaneo (Cámara Trasera)
          </Button>
        </div>
      )}

      {cameraError && !scanning && !scanResult && (
        <Alert variant="destructive">
          <CameraOff className="h-4 w-4" />
          <AlertTitle>Error de acceso a la cámara</AlertTitle>
          <AlertDescription>
            <p>No se pudo acceder a la cámara trasera. Por favor verifica:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Que hayas dado permisos de cámara al navegador</li>
              <li>Que no haya otra aplicación usando la cámara</li>
              <li>Que estés usando un navegador compatible (Chrome o Safari recomendados)</li>
              <li>Si estás en un dispositivo móvil, intenta recargar la página</li>
            </ul>
            <Button onClick={startScanning} className="mt-4">
              Intentar nuevamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {scanning && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Escanea el Código QR</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              id="qr-scanner-container"
              style={{ width: '100%', minHeight: '300px' }}
            ></div>
            <Button onClick={stopScanning} variant="outline" className="mt-4 w-full">
              Cancelar
            </Button>
          </CardContent>
        </Card>
      )}

      {scanResult && (
        <Alert
          className={
            scanResult.success
              ? scanResult.isFirstTime
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
              : 'bg-red-50 border-red-200'
          }
        >
          {scanResult.success && scanResult.isFirstTime && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          <AlertTitle>
            {scanResult.success
              ? scanResult.isFirstTime
                ? '¡Asistencia Registrada!'
                : 'Alumno Verificado'
              : 'No Registrado'}
          </AlertTitle>
          <AlertDescription>
            {scanResult.success ? (
              <>
                <div className="font-medium">{scanResult.studentName}</div>
                <div>{scanResult.message}</div>
              </>
            ) : (
              scanResult.message
            )}
          </AlertDescription>
          <div className="mt-4 flex justify-end">
            <Button onClick={startScanning} className="mr-2">
              Escanear otro
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default QRScanner;
