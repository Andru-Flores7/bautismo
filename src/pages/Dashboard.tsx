import React from 'react';
import Header from '@/components/Header';
import StudentList from '@/components/StudentList';
import { getStats } from '@/utils/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const stats = getStats();

  const attendancePercentage = stats.total > 0 
    ? Math.round((stats.attended / stats.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center text-orange-400">Dashboard de Asistencia</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-orange-400">{stats.total}</CardTitle>
                <p className="text-orange-200 text-sm">Alumnos Totales</p>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-green-300">{stats.attended}</CardTitle>
                <p className="text-orange-200 text-sm">Asistencias</p>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-orange-400">{attendancePercentage}%</CardTitle>
                <p className="text-orange-200 text-sm">Porcentaje</p>
              </CardHeader>
            </Card>
          </div>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-400">Asistencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${attendancePercentage}%`,
                      background: `repeating-linear-gradient(135deg, #f97316 0 16px, #000 16px 24px)`
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-orange-200 text-center">
                  {stats.attended} de {stats.total} alumnos han asistido
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <StudentList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
