import { useAppStore } from '@/stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { DeathType } from '@/types';

const DEATH_TYPES: { value: DeathType; label: string }[] = [
  { value: 'natural', label: 'Natural' },
  { value: 'violenta', label: 'Violenta' },
  { value: 'homicidio', label: 'Homicidio' },
  { value: 'suicidio', label: 'Suicidio' },
  { value: 'accidente', label: 'Accidente' },
  { value: 'indeterminada', label: 'Indeterminada' },
];

const YEARS = [2023]; // Datos reales disponibles para 2023

export default function FilterPanel() {
  const { filters, setFilters, resetFilters } = useAppStore();

  const toggleYear = (year: number) => {
    const newYears = filters.years.includes(year)
      ? filters.years.filter((y) => y !== year)
      : [...filters.years, year];
    setFilters({ years: newYears });
  };

  const toggleDeathType = (type: DeathType) => {
    const newTypes = filters.deathTypes.includes(type)
      ? filters.deathTypes.filter((t) => t !== type)
      : [...filters.deathTypes, type];
    setFilters({ deathTypes: newTypes });
  };

  const toggleGender = (gender: 'M' | 'F' | 'O') => {
    const newGender = filters.gender.includes(gender)
      ? filters.gender.filter((g) => g !== gender)
      : [...filters.gender, gender];
    setFilters({ gender: newGender });
  };

  return (
    <div className="space-y-6">
      {/* Años */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Año</CardTitle>
          <CardDescription>Selecciona uno o más años</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => toggleYear(year)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.years.includes(year)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tipo de muerte */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de Muerte</CardTitle>
          <CardDescription>Filtra por categoría</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {DEATH_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-accent"
              >
                <input
                  type="checkbox"
                  checked={filters.deathTypes.includes(type.value)}
                  onChange={() => toggleDeathType(type.value)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Género */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Género</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { value: 'M' as const, label: 'Masculino' },
              { value: 'F' as const, label: 'Femenino' },
              { value: 'O' as const, label: 'Otro' },
            ].map((gender) => (
              <label
                key={gender.value}
                className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-accent"
              >
                <input
                  type="checkbox"
                  checked={filters.gender.includes(gender.value)}
                  onChange={() => toggleGender(gender.value)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">{gender.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rango de edad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rango de Edad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Mínimo: {filters.ageRange[0]}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.ageRange[0]}
                onChange={(e) =>
                  setFilters({
                    ageRange: [parseInt(e.target.value), filters.ageRange[1]],
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Máximo: {filters.ageRange[1]}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.ageRange[1]}
                onChange={(e) =>
                  setFilters({
                    ageRange: [filters.ageRange[0], parseInt(e.target.value)],
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset button */}
      <Button
        onClick={resetFilters}
        variant="outline"
        className="w-full"
      >
        Limpiar Filtros
      </Button>
    </div>
  );
}
