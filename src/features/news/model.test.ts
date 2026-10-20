import { describe,it,expect } from 'vitest';
import { visibleNews,NEWS_PAGE_SIZE,type NewsItem } from './model';
describe('news visibility',()=>{
 const items:NewsItem[]=Array.from({length:5},(_,i)=>({id:String(i),title:{fi:'uutinen'},body:{fi:'teksti'},news_date:`2026-10-${String(20-i).padStart(2,'0')}`,published:i!==0,image_path:null}));
 it('shows three published articles initially',()=>{expect(NEWS_PAGE_SIZE).toBe(3);expect(visibleNews(items).map(n=>n.id)).toEqual(['1','2','3']);});
 it('shows additional articles when expanded',()=>{expect(visibleNews(items,6).map(n=>n.id)).toEqual(['1','2','3','4']);});
 it('never shows drafts',()=>{expect(visibleNews(items,100).some(n=>n.id==='0')).toBe(false);});
});