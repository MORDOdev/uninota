import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import GradeCalculator from './components/GradeCalculator';
import GradeHistory from './components/GradeHistory';
import SemesterComparison from './components/SemesterComparison';
import Auth from './components/Auth';

// Main app content that uses auth context
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <>
            <GradeCalculator />
            <GradeHistory />
            <SemesterComparison />
          </>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
              <p className="text-blue-800">
                Inicia sesión o regístrate para calcular y guardar tus notas universitarias
              </p>
            </div>
            <Auth />
          </div>
        )}
      </main>
      
      <Footer />
      <Analytics />
    </div>
  );
};

// Wrap the app with the auth provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;