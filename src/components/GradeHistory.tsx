import React, { useState, useEffect } from 'react';
import { Book, TrendingUp, Trash2 } from 'lucide-react';
import { getUserGrades, deleteGrade } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { CourseGrade } from '../types';
import AlertDialog from './AlertDialog';

const GradeHistory: React.FC = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<CourseGrade[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info', message: string } | null>(null);

  useEffect(() => {
    if (user) {
      const userGrades = getUserGrades(user.id);
      setGrades(userGrades);
      
      // Extract unique semesters
      const uniqueSemesters = Array.from(new Set(userGrades.map(grade => grade.semester)));
      setSemesters(uniqueSemesters);
      
      if (uniqueSemesters.length > 0) {
        setSelectedSemester(uniqueSemesters[0]);
      }
    }
  }, [user]);

  const handleDelete = (gradeId: string) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      deleteGrade(gradeId);
      
      // Update local state
      const updatedGrades = grades.filter(grade => grade.id !== gradeId);
      setGrades(updatedGrades);
      
      // Update semesters if needed
      const uniqueSemesters = Array.from(new Set(updatedGrades.map(grade => grade.semester)));
      setSemesters(uniqueSemesters);
      
      setAlert({
        type: 'success',
        message: 'Registro eliminado correctamente'
      });
    }
  };

  const filteredGrades = selectedSemester 
    ? grades.filter(grade => grade.semester === selectedSemester)
    : grades;

  if (!user) {
    return null;
  }

  if (grades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto mt-8">
        <div className="flex items-center justify-center py-6">
          <p className="text-gray-500 italic">No hay registros de notas guardados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Book className="mr-2 text-blue-600" size={24} />
        Historial de Notas
      </h2>
      
      <div className="mb-4">
        <label htmlFor="semesterFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por Semestre
        </label>
        <select
          id="semesterFilter"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {semesters.map(semester => (
            <option key={semester} value={semester}>{semester}</option>
          ))}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asignatura
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                1er (30%)
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                2do (35%)
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Req. (35%)
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGrades.map((grade) => (
              <tr key={grade.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{grade.courseName}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{grade.firstGrade.toFixed(2)}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{grade.secondGrade.toFixed(2)}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {grade.requiredGrade === 0 ? (
                    <div className="text-sm text-green-600 font-medium">Aprobado</div>
                  ) : grade.requiredGrade === undefined || grade.requiredGrade === null ? (
                    <div className="text-sm text-red-600 font-medium">Imposible</div>
                  ) : (
                    <div className="text-sm text-blue-600 font-medium">{grade.requiredGrade.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleDelete(grade.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
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

export default GradeHistory;