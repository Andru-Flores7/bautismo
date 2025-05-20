import React, { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

import { findStudentByQR, markAttendance } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Smartphone, Camera, CameraOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const startScanning = async () => {
    setScanResult(null);
    setCameraError(false);
    setScanning(true);
    try {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (!videoInputDevices || videoInputDevices.length === 0) {
        throw new Error('No se detectó ninguna cámara en el dispositivo.');
      }
      // Selecciona la cámara trasera si está disponible
      let deviceId = videoInputDevices[0]?.deviceId;
      for (const device of videoInputDevices) {
        if (device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('trasera')) {
          deviceId = device.deviceId;
          break;
        }
      }
      codeReader.decodeFromVideoDevice(deviceId, videoRef.current, async (result, err, controls) => {
        if (result) {
          console.log('QR leído:', result.getText());
          // Detener el escaneo inmediatamente después de leer un QR válido
          if (controls && typeof controls.stop === 'function') {
            await controls.stop();
          }
          // Mostrar todos los alumnos registrados para depuración
          const alumnos = JSON.parse(localStorage.getItem('students') || '[]');
          console.log('Alumnos registrados:', alumnos);
          handleScan(result.getText());
        }
        if (err && err.name === 'NotReadableError') {
          setCameraError(true);
          setScanning(false);
          toast({
            title: 'Error',
            description: 'No se pudo acceder a la cámara. Puede estar en uso por otra aplicación o bloqueada por el sistema.',
            variant: 'destructive',
          });
        } else if (err && err.name !== 'NotFoundException') {
          // NotFoundException es un nombre de error estándar en ZXing
          toast({
            title: 'Error de escaneo',
            description: 'No se pudo detectar ningún código QR válido. Asegúrate de que el QR esté bien enfocado, con buen contraste y completamente visible.',
            variant: 'destructive',
          });
          console.error('Error de escaneo:', err);
        }
      });
    } catch (error) {
      setCameraError(true);
      setScanning(false);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo iniciar la cámara. Verifica permisos y compatibilidad.',
        variant: 'destructive',
      });
    }
  };

  const stopScanning = () => {
    setScanning(false);
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };

  const handleScan = async (result) => {
    stopScanning();
    // Log visual para depuración
    toast({
      title: 'Depuración',
      description: `QR leído: ${result}`,
    });
    console.log('Valor recibido por el escáner:', result);
    // Extraer nombre si el QR tiene formato id:nombre
    let nombreQR = '';
    let id = result;
    if (result.includes(':')) {
      const partes = result.split(':');
      id = partes[0];
      nombreQR = partes.slice(1).join(':');
    }
    // Mostrar alumnos en localStorage para depuración
    const alumnos = JSON.parse(localStorage.getItem('students') || '[]');
    toast({
      title: 'Depuración',
      description: `Alumnos en storage: ${alumnos.map(a => a.qrCode).join(' | ')}`,
    });
    const student = findStudentByQR(result);
    if (!student) {
      setScanResult({
        success: false,
        message: nombreQR
          ? `QR no reconocido. Nombre leído: ${nombreQR}`
          : 'QR no reconocido. Este alumno no está registrado.',
        isFirstTime: false,
        studentName: nombreQR || undefined,
      });
      toast({
        title: 'Error',
        description: 'QR no reconocido',
        variant: 'destructive',
      });
      return;
    }
    const isFirstTime = !student.attended;
    if (isFirstTime) {
      markAttendance(result);
      setScanResult({
        success: true,
        message: '¡Asistencia registrada exitosamente!',
        isFirstTime: true,
        studentName: student.name,
      });
      toast({
        title: 'Éxito',
        description: `Asistencia registrada para ${student.name}`,
      });
    } else {
      setScanResult({
        success: true,
        message: 'Este estudiante ya fue registrado anteriormente',
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
          <Smartphone className="h-16 w-16 text-orange-400" />
          <h3 className="text-xl font-medium text-orange-400">Escanear Código QR</h3>
          <p className="text-center text-orange-200">
            Haz clic en el botón para escanear el código QR del alumno
          </p>
          <Button onClick={startScanning} className="w-full bg-orange-500 hover:bg-black active:bg-black focus:bg-black text-white transition-colors">
            <Camera className="mr-2" />
            Iniciar Escaneo (Cámara Trasera)
          </Button>
        </div>
      )}

      {cameraError && !scanning && !scanResult && (
        <Alert variant="destructive">
          <CameraOff className="h-4 w-4 text-orange-400" />
          <AlertTitle className="text-orange-400">Error de acceso a la cámara</AlertTitle>
          <AlertDescription className="text-orange-200">
            <p>No se pudo acceder a la cámara. Por favor verifica:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Que hayas dado permisos de cámara al navegador</li>
              <li>Que no haya otra aplicación usando la cámara</li>
              <li>Que estés usando un navegador compatible (Chrome o Safari recomendados)</li>
              <li>Si estás en un dispositivo móvil, intenta recargar la página</li>
            </ul>
            <Button onClick={startScanning} className="mt-4 bg-orange-500 hover:bg-black active:bg-black focus:bg-black text-white transition-colors">
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
            <video ref={videoRef} style={{ width: '100%', minHeight: '300px' }} />
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
            <Check className="h-4 w-4 text-orange-400" />
          )}
          <AlertTitle className="text-orange-400">
            {scanResult.success
              ? scanResult.isFirstTime
                ? '¡Asistencia Registrada!'
                : 'Alumno Verificado'
              : 'No Registrado'}
          </AlertTitle>
          <AlertDescription className="text-orange-200">
            {scanResult.success ? (
              <>
                <div className="font-medium text-orange-400">{scanResult.studentName}</div>
                <div>{scanResult.message}</div>
              </>
            ) : (
              scanResult.message
            )}
          </AlertDescription>
          <div className="mt-4 flex justify-end">
            <Button onClick={startScanning} className="mr-2 bg-orange-500 hover:bg-black active:bg-black focus:bg-black text-white transition-colors">
              Escanear otro
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default QRScanner;
