-- RentDirect MVP schema for Supabase / PostgreSQL

-- users / profiles
create table if not exists profiles (
  id uuid primary key default auth.uid(),
  full_name text,
  email text,
  phone text,
  role text default 'renter',
  avatar_url text,
  phone_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- properties
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  property_type text,
  address text,
  area text,
  city text,
  state text,
  latitude double precision,
  longitude double precision,
  annual_rent bigint default 0,
  caution_deposit bigint default 0,
  service_charge bigint default 0,
  legal_fee bigint default 0,
  agency_fee bigint default 0,
  bedrooms int,
  bathrooms int,
  parking_spaces int,
  status text default 'draft',
  verification_status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- amenities
create table if not exists amenities (
  id serial primary key,
  name text not null unique
);

-- property_amenities
create table if not exists property_amenities (
  property_id uuid references properties(id) on delete cascade,
  amenity_id int references amenities(id) on delete cascade,
  primary key(property_id, amenity_id)
);

-- property_images
create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  url text,
  position int default 0,
  is_cover boolean default false,
  created_at timestamptz default now()
);

-- saved_properties
create table if not exists saved_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, property_id)
);

-- viewing_requests
create table if not exists viewing_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  renter_id uuid references profiles(id),
  landlord_id uuid references profiles(id),
  preferred_date date,
  preferred_time text,
  message text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- reports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  reporter_id uuid references profiles(id),
  reason text,
  message text,
  admin_note text,
  created_at timestamptz default now(),
  resolved boolean default false
);

-- basic indexes
create index if not exists idx_properties_city on properties(city);
create index if not exists idx_properties_state on properties(state);
create index if not exists idx_properties_area on properties(area);
create index if not exists idx_properties_rent on properties(annual_rent);

-- audit log for admin actions
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text,
  meta jsonb,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY POLICIES

-- Helper note: policies use auth.uid() and the profiles table to check admin role.

-- profiles: users can insert/select; only owners can update/delete their profile
alter table profiles enable row level security;
create policy profiles_insert_authenticated on profiles for insert using (auth.uid() is not null) with check (auth.uid() = id);
create policy profiles_select_authenticated on profiles for select using (auth.uid() is not null);
create policy profiles_update_owner on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy profiles_delete_owner on profiles for delete using (auth.uid() = id);

-- properties: published visible to all; landlords can manage their properties; admins can manage all
alter table properties enable row level security;
create policy properties_select_public_or_owner_or_admin on properties for select using (
  status = 'published'
  or landlord_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy properties_insert_landlord on properties for insert with check (landlord_id = auth.uid());
create policy properties_update_owner_or_admin on properties for update using (
  landlord_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  (landlord_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
  and not (verification_status = 'verified' and not (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')))
);
create policy properties_delete_owner_or_admin on properties for delete using (
  landlord_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- property_images: allow owners or admin to manage images for a property; anyone can select images for published properties
alter table property_images enable row level security;
create policy property_images_select_public_or_owner_or_admin on property_images for select using (
  exists (select 1 from properties pr where pr.id = property_images.property_id and (pr.status = 'published' or pr.landlord_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')))
);
create policy property_images_insert_owner_or_admin on property_images for insert with check (
  exists (select 1 from properties pr where pr.id = property_images.property_id and (pr.landlord_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')))
);
create policy property_images_update_owner_or_admin on property_images for update using (
  exists (select 1 from properties pr where pr.id = property_images.property_id and (pr.landlord_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')))
);
create policy property_images_delete_owner_or_admin on property_images for delete using (
  exists (select 1 from properties pr where pr.id = property_images.property_id and (pr.landlord_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')))
);

-- saved_properties: users can manage their own saved items
alter table saved_properties enable row level security;
create policy saved_properties_manage_own on saved_properties for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- viewing_requests: renters can create; renters and landlords (for their properties) and admins can view their related requests
alter table viewing_requests enable row level security;
create policy viewing_requests_insert_renter on viewing_requests for insert with check (renter_id = auth.uid());
create policy viewing_requests_select_owner_or_parties on viewing_requests for select using (
  renter_id = auth.uid()
  or landlord_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy viewing_requests_update_owner_or_admin on viewing_requests for update using (
  renter_id = auth.uid() or landlord_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (renter_id = auth.uid() or landlord_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- reports: users can create reports; reporter or admin can view; only admin can update (resolve)
alter table reports enable row level security;
create policy reports_insert_reporter on reports for insert with check (reporter_id = auth.uid());
create policy reports_select_reporter_or_admin on reports for select using (reporter_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy reports_update_admin_only on reports for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- audit_log: only admin may view; only admin may insert audit entries
alter table audit_log enable row level security;
create policy audit_log_admin_only on audit_log for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy audit_log_insert_admin only on audit_log for insert with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));


-- Insert common amenities
insert into amenities (name) values
('24/7 Electricity'),('Borehole Water'),('Parking'),('Security'),('Estate'),('Prepaid Meter'),('POP Ceiling'),('Fitted Kitchen'),('Wardrobe'),('Air Conditioning'),('Generator'),('Internet'),('Balcony'),('Ensuite Rooms'),('Kitchen'),('Water Heater')
on conflict (name) do nothing;

-- Row Level Security notes: enable policies in Supabase dashboard as appropriate.
