
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChartHorizontalBig, FileDown, FileSpreadsheet } from 'lucide-react'; // Added FileSpreadsheet icon

function ActionButtons({ onStatsClick, onPdfClick, onExcelClick }) { // Added onExcelClick prop
  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-end gap-2">
      <Button variant="outline" onClick={onStatsClick}>
        <BarChartHorizontalBig className="mr-2 h-4 w-4" />
        Ver Estadísticas
      </Button>
      <Button variant="secondary" onClick={onPdfClick}>
        <FileDown className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      <Button variant="secondary" onClick={onExcelClick}> {/* Added Excel button */}
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>
    </div>
  );
}

export default ActionButtons;
