import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { getUserGrades } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { CourseGrade } from '../types';

interface SemesterStatistics {
  semester: string;
  courseCount: number;
  passedCount: number;
  failedCount: number;
  averageRequired: number;
}

const SemesterComparison: React.FC = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<SemesterStatistics[]>([]);

  useEffect(() => {
    if (user) {
      const userGrades = getUserGrades(user.id);
      
      // Group by semester
      const semesterGroups = userGrades.reduce((groups: Record<string, CourseGrade[]>, grade) => {
        const { semester } = grade;
        groups[semester] = groups[semester] || [];
        groups[semester].push(grade);
        return groups;
      }, {});
      
      // Calculate statistics for each semester
      const stats: SemesterStatistics[] = Object.entries(semesterGroups).map(([semester, grades]) => {
        const courseCount = grades.length;
        const passedCount = grades.filter(grade => grade.requiredGrade === 0).length;
        const failedCount = grades.filter(grade => grade.requiredGrade === null).length;
        
        // Calculate average required grade (excluding passed and failed)
        const validGrades = grades.filter(grade => 
          grade.requiredGrade !== null && grade.requiredGrade !== 0
        );
        
        const sum = validGrades.reduce((total, grade) => 
          total + (grade.requiredGrade || 0), 0
        );
        
        const averageRequired = validGrades.length > 0 
          ? sum / validGrades.length 
          : 0;
        
        return {
          semester,
          courseCount,
          passedCount,
          failedCount,
          averageRequired
        };
      });
      
      // Sort by semester
      setStatistics(stats.sort((a, b) => a.semester.localeCompare(b.semester)));
    }
  }, [user]);

  if (!user || statistics.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto mt-8 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <TrendingUp className="mr-2 text-blue-600" size={24} />
        Comparación entre Semestres
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Semestre
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aprobadas
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reprobadas
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nota Req.
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statistics.map((stat) => (
              <tr key={stat.semester} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{stat.semester}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stat.courseCount}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-green-600 font-medium flex items-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mr-2">
                      {stat.passedCount}
                    </span>
                    <span>
                      {Math.round((stat.passedCount / stat.courseCount) * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-red-600 font-medium flex items-center">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs mr-2">
                      {stat.failedCount}
                    </span>
                    <span>
                      {Math.round((stat.failedCount / stat.courseCount) * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-blue-600 font-medium">
                    {stat.averageRequired > 0 ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {stat.averageRequired.toFixed(2)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SemesterComparison;