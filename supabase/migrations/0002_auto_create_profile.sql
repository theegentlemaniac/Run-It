-- Run-It: auto-create profile on signup
-- Ensures every new auth.users row (email/password or OAuth, e.g. Google)
-- gets a matching public.profiles row, since RLS on public.profiles only
-- allows a user to insert their own row and nothing in the app does that.

-- ---------------------------------------------------------------------------
-- handle_new_user
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
