import { queryOptions } from '@tanstack/react-query';
import { listNews } from './news.functions';
export const newsQuery = queryOptions({ queryKey:['public-news'], queryFn: () => listNews(), staleTime:60_000 });