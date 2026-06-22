-- إنشاء جدول المستخدمين في المخطط العام (public schema)
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  phone text unique,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- تفعيل Row Level Security (RLS)
alter table public.users enable row level security;

-- سياسة: كل مستخدم يمكنه قراءة بيانات حسابه الخاص فقط
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

-- سياسة: كل مستخدم يمكنه تحديث بيانات حسابه الخاص فقط
create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- سياسة: السماح للخدمة (service role) بالوصول الكامل
create policy "Service role has full access"
  on public.users for all
  using (true)
  with check (true);

-- إنشاء دالة لمزامنة المستخدمين
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, phone, name, created_at, updated_at)
  values (
    new.id,
    new.email,
    new.phone,
    new.raw_user_meta_data->>'name',
    now(),
    now()
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, new.email),
    phone = coalesce(excluded.phone, new.phone),
    name = coalesce(excluded.name, new.raw_user_meta_data->>'name'),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- حذف الـ trigger القديم إن وجد
drop trigger if exists on_auth_user_created on auth.users;

-- إنشاء trigger لتشغيل الدالة عند إنشاء مستخدم جديد
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- إنشاء دالة لتحديث الـ updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- حذف الـ trigger القديم إن وجد
drop trigger if exists update_users_updated_at on public.users;

-- إنشاء trigger لتحديث updated_at تلقائياً
create trigger update_users_updated_at
  before update on public.users
  for each row execute procedure public.update_updated_at_column();
