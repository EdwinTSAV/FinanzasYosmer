
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChartHorizontalBig, FileDown } from 'lucide-react';

function ActionButtons({ onStatsClick, onPdfClick }) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-end gap-2">
      <Button variant="outline" onClick={onStatsClick}>
        <BarChartHorizontalBig className="mr-2 h-4 w-4" />
        Ver Estadísticas por Categoría
      </Button>
      <Button variant="secondary" onClick={onPdfClick}>
        <FileDown className="mr-2 h-4 w-4" />
        Exportar Resumen PDF
      </Button>
    </div>
  );
}

export default ActionButtons;
