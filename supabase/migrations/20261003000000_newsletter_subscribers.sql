create table if not exists newsletter_subscribers (
  id             uuid        default gen_random_uuid() primary key,
  email          text        not null unique,
  locale         text        not null default 'zh-TW',
  subscribed_at  timestamptz not null default now(),
  is_active      boolean     not null default true
);

alter table newsletter_subscribers enable row level security;

create policy "Allow public insert"
  on newsletter_subscribers for insert to anon
  with check (true);

create policy "Allow authenticated select"
  on newsletter_subscribers for select to authenticated
  using (true);
