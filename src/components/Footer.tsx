import React from 'react';
import { Copyright } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <div className="flex items-center space-x-1">
          <Copyright size={16} />
          <p className="text-sm">
            {new Date().getFullYear()} <span className="font-semibold">chiquilloDEV</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;