import React from 'react';

import { EditModeHeader } from '@/features/home/components/editable/EditModeHeader';
import { EditableSeriesList } from '@/features/home/components/editable/EditableSeriesList';
import { SeriesWithBooks } from '@/features/home/types';
import { SeriesStats } from '@/hooks/screens/useHomeScreen';

interface SeriesEditModeProps {
  data: SeriesWithBooks[];
  onDragEnd: ({ data }: { data: SeriesWithBooks[] }) => void;
  getSeriesStats: (books: any[]) => SeriesStats;
  onCancel: () => void;
  onSave: () => void;
  isUpdating: boolean;
}

export const SeriesEditMode: React.FC<SeriesEditModeProps> = ({
  data,
  onDragEnd,
  getSeriesStats,
  onCancel,
  onSave,
  isUpdating,
}) => {
  return (
    <>
      <EditModeHeader onCancel={onCancel} onSave={onSave} isUpdating={isUpdating} />
      <EditableSeriesList
        data={data}
        onDragEnd={onDragEnd}
        getSeriesStats={getSeriesStats}
      />
    </>
  );
};