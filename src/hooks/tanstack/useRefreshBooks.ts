import { QUERY_KEYS } from '@/utils/constants/query';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshBooks = () => {
  const queryClient = useQueryClient();
  
  return {
    // 全書籍データを再取得
    refreshAllBooks: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS }),
    
    // 特定の書籍データを再取得
    refreshBook: (id: string) => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOK(id) }),
    
    // シリーズ別書籍データを再取得
    refreshSeriesBooks: (seriesId: string) => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERIES_BOOKS(seriesId) }),
    
    // 統計データを再取得
    refreshStats: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKS_STATS }),
    
    // すべてのクエリを強制再取得
    refetchAll: () => queryClient.refetchQueries({ queryKey: QUERY_KEYS.BOOKS })
  };
};