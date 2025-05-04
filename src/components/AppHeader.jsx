
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

function AppHeader({ onAddClick }) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mb-0">
        Control Financiero Familiar
      </h1>
      <Button onClick={onAddClick} className="shadow-lg">
        <Plus className="mr-2 h-4 w-4" /> Añadir Transacción
      </Button>
    </header>
  );
}

export default AppHeader;
