import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ServiceStatusProps {
  errorMsg: string | null;
}

export const ServiceStatus: React.FC<ServiceStatusProps> = ({ errorMsg }) => {
  if (!errorMsg) return null;

  return (
    <div className="bg-red-900/20 border border-red-500/50 p-4 mb-6 rounded-sm text-center">
      <div className="flex items-center justify-center text-red-400 mb-2">
        <AlertTriangle size={16} className="mr-2" /> Erreur
      </div>
      <p className="text-xs text-red-200">{errorMsg}</p>
    </div>
  );
};
