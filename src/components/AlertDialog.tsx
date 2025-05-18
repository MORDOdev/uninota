import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface AlertDialogProps {
  type: 'error' | 'success' | 'info';
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ type, message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iconMap = {
    error: <AlertCircle className="text-red-500" size={24} />,
    success: <CheckCircle className="text-green-500" size={24} />,
    info: <AlertCircle className="text-blue-500" size={24} />
  };

  const bgColorMap = {
    error: 'bg-red-100 border-red-500',
    success: 'bg-green-100 border-green-500',
    info: 'bg-blue-100 border-blue-500'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className={`${bgColorMap[type]} border-l-4 p-4 rounded-md shadow-lg flex items-start space-x-3 max-w-xs`}>
        <div>{iconMap[type]}</div>
        <div className="flex-1">
          <p className="text-gray-800">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default AlertDialog;