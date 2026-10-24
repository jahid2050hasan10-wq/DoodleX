import { useState, useEffect, useCallback } from 'react';
import { supabase, type Game } from '@/lib/supabase';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = useCallback(async () => {
    const { data } = await supabase
      .from('games')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setGames(data as Game[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGames();
    const channel = supabase
      .channel('games-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'games' },
        () => fetchGames()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchGames]);

  return { games, loading, refetch: fetchGames };
}
