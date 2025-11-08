import { useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DeathType } from '@/types';

export default function StatsPanel() {
  const { filteredRecords } = useAppStore();

  const stats = useMemo(() => {
    // Estadísticas por tipo de muerte
    const byType: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    const byGender: Record<string, number> = { M: 0, F: 0, O: 0 };
    const byAgeGroup: Record<string, number> = {
      '0-17': 0,
      '18-30': 0,
      '31-50': 0,
      '51-70': 0,
      '71+': 0,
    };

    filteredRecords.forEach((record) => {
      // Por tipo
      byType[record.type] = (byType[record.type] || 0) + 1;

      // Por departamento
      byDepartment[record.location.department] =
        (byDepartment[record.location.department] || 0) + 1;

      // Por género
      byGender[record.demographics.gender]++;

      // Por grupo de edad
      const age = record.demographics.age;
      if (age <= 17) byAgeGroup['0-17']++;
      else if (age <= 30) byAgeGroup['18-30']++;
      else if (age <= 50) byAgeGroup['31-50']++;
      else if (age <= 70) byAgeGroup['51-70']++;
      else byAgeGroup['71+']++;
    });

    // Convertir a arrays para gráficos
    const typeData = Object.entries(byType).map(([name, value]) => ({
      name,
      value,
    }));

    const departmentData = Object.entries(byDepartment)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10

    const ageGroupData = Object.entries(byAgeGroup).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      total: filteredRecords.length,
      byType: typeData,
      byDepartment: departmentData,
      byGender,
      byAgeGroup: ageGroupData,
    };
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      {/* Total */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total de Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{stats.total.toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Por tipo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Por Tipo de Muerte</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.byType.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No hay datos</p>
          )}
        </CardContent>
      </Card>

      {/* Por departamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top 10 Departamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.byDepartment.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byDepartment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={10} width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No hay datos</p>
          )}
        </CardContent>
      </Card>

      {/* Por género */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Por Género</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Masculino</span>
              <span className="text-sm font-semibold">{stats.byGender.M}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Femenino</span>
              <span className="text-sm font-semibold">{stats.byGender.F}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Otro</span>
              <span className="text-sm font-semibold">{stats.byGender.O}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Por grupo de edad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Por Grupo de Edad</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byAgeGroup}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
