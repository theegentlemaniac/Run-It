alter table public.profiles
  add column date_of_birth date;

comment on column public.profiles.date_of_birth is
  'Date of birth; age is computed when displayed.';
