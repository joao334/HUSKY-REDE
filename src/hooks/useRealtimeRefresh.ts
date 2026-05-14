import { useEffect } from 'react';
import { dataService } from '../services/dataService';

export function useRealtimeRefresh(table: string, callback: () => void, filter?: string) {
  useEffect(() => dataService.subscribeToTable(table, callback, filter), [callback, filter, table]);
}
