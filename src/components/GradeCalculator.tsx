import React, { useState } from 'react';
import { Calculator, Save } from 'lucide-react';
import { calculateRequiredGrade, isValidDecimalGrade } from '../utils/gradeCalculator';
import { useAuth } from '../contexts/AuthContext';
import { saveGrade } from '../utils/storage';
import { CourseGrade } from '../types';
import AlertDialog from './AlertDialog';

interface Alert {
  type: 'error' | 'success' | 'info';
  message: string;
}

const GradeCalculator: React.FC = () => {
  const { user } = useAuth();
  const [courseName, setCourseName] = useState('');
  const [firstGrade, setFirstGrade] = useState('');
  const [secondGrade, setSecondGrade] = useState('');
  const [semester, setSemester] = useState('');
  const [requiredGrade, setRequiredGrade] = useState<number | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!isValidDecimalGrade(firstGrade)) {
      setAlert({
        type: 'error',
        message: 'La nota del primer corte debe ser un número decimal válido (ejemplo: 2.70)'
      });
      return;
    }
    
    if (!isValidDecimalGrade(secondGrade)) {
      setAlert({
        type: 'error',
        message: 'La nota del segundo corte debe ser un número decimal válido (ejemplo: 2.70)'
      });
      return;
    }
    
    // Calculate required grade
    const required = calculateRequiredGrade(parseFloat(firstGrade), parseFloat(secondGrade));
    setRequiredGrade(required);
    setCalculated(true);
  };
  
  const handleSave = () => {
    if (!user) {
      setAlert({
        type: 'error',
        message: 'Debes iniciar sesión para guardar tus notas'
      });
      return;
    }
    
    if (!courseName) {
      setAlert({
        type: 'error',
        message: 'Ingresa el nombre de la asignatura'
      });
      return;
    }
    
    if (!semester) {
      setAlert({
        type: 'error',
        message: 'Ingresa el semestre'
      });
      return;
    }
    
    // Save grade data
    const gradeData: CourseGrade = {
      id: crypto.randomUUID(),
      userId: user.id,
      courseName,
      firstGrade: parseFloat(firstGrade),
      secondGrade: parseFloat(secondGrade),
      requiredGrade: requiredGrade || undefined,
      semester,
      createdAt: new Date()
    };
    
    saveGrade(gradeData);
    
    setAlert({
      type: 'success',
      message: 'Notas guardadas correctamente'
    });
    
    // Reset form
    setCourseName('');
    setFirstGrade('');
    setSecondGrade('');
    setSemester('');
    setRequiredGrade(null);
    setCalculated(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Calculator className="mr-2 text-blue-600" size={24} />
        Calculadora de Notas
      </h2>
      
      <form onSubmit={handleCalculate} className="space-y-4">
        <div>
          <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Asignatura
          </label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Cálculo I"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstGrade" className="block text-sm font-medium text-gray-700 mb-1">
              Nota Primer Corte (30%)
            </label>
            <input
              type="text"
              id="firstGrade"
              value={firstGrade}
              onChange={(e) => setFirstGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2.70"
            />
          </div>
          
          <div>
            <label htmlFor="secondGrade" className="block text-sm font-medium text-gray-700 mb-1">
              Nota Segundo Corte (35%)
            </label>
            <input
              type="text"
              id="secondGrade"
              value={secondGrade}
              onChange={(e) => setSecondGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2.70"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
            Semestre
          </label>
          <input
            type="text"
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 2023-1"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
          >
            <Calculator size={18} className="mr-1" />
            Calcular
          </button>
          
          {calculated && (
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
              <Save size={18} className="mr-1" />
              Guardar
            </button>
          )}
        </div>
      </form>
      
      {calculated && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Resultado:</h3>
          
          {requiredGrade === null ? (
            <p className="text-red-600 font-medium">
              Lo sentimos, no es posible obtener un 3.0 en la asignatura con las notas actuales.
            </p>
          ) : requiredGrade === 0 ? (
            <p className="text-green-600 font-medium">
              ¡Felicidades! Ya has aprobado la asignatura con las notas actuales.
            </p>
          ) : (
            <p className="text-blue-800">
              Necesitas obtener al menos <span className="font-bold text-lg">{requiredGrade.toFixed(2)}</span> en el tercer corte (35%) para aprobar la asignatura con 3.0.
            </p>
          )}
        </div>
      )}
      
      {alert && (
        <AlertDialog
          type={alert.type}
          message={alert.message}
          isOpen={!!alert}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default GradeCalculator;