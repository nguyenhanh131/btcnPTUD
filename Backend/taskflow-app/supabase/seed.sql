-- OPTIONAL demo data so the Statistics page has something to show. Run once, after schema.sql.
-- Dates are relative to the day you run it. Running it twice inserts the data twice.
insert into public.tasks (title, description, due_date, priority, status, category_id, created_at, completed_at)
select t.title, t.descr, current_date + t.off, t.pri,
       t.st, t.cat, current_date + t.off - 1 - (t.g % 5), case when t.st = 'completed' then current_date + least(0, t.off) end
from (
  select g, cat, off,
    case when off < 0 then (case when g % 4 = 0 then (case when g % 8 = 0 then 'in_progress' else 'todo' end) else 'completed' end)
         else (case when g % 3 = 0 then 'in_progress' else 'todo' end) end as st,
    (array['high','medium','medium','low','low'])[1 + g % 5] as pri,
    (array['Review roadmap draft','Send proposal','Prepare demo','Write documentation','Triage backlog','Plan weekend','Morning run','Pay credit card bill'])[1 + g % 8] as title,
    (array['','Check scope before the sync.','Gather the latest numbers.','Keep it short.'])[1 + g % 4] as descr
  from (select g, (array['work','personal','health','learning','finance'])[1 + g % 5] as cat,
               -((g * 11) % 48) + (case when g % 9 = 0 then 6 else 0 end) as off
        from generate_series(1, 60) g) s
) t;
-- Tasks due today
insert into public.tasks (title, description, due_date, priority, status, category_id, created_at, completed_at) values
  ('Plan the day', '', current_date, 'medium', 'completed', 'personal', current_date - 1, current_date),
  ('Reply to client email', 'Confirm the delivery date.', current_date, 'high', 'in_progress', 'work', current_date - 2, null),
  ('Stretch routine, 15 min', '', current_date, 'low', 'todo', 'health', current_date - 1, null),
  ('Review subscriptions', 'Cancel anything unused.', current_date, 'medium', 'todo', 'finance', current_date - 3, null);
