-- Demo seed data for RentDirect MVP
-- Run this in Supabase SQL editor after applying schema.sql

-- Insert demo profiles
insert into profiles (id, full_name, email, phone, role, avatar_url, phone_verified)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin User', 'admin@gidaa.test', '+2348000000000', 'admin', null, true),
  ('11111111-1111-1111-1111-111111111111', 'Landlord A', 'landlordA@gidaa.test', '+2348011111111', 'landlord', null, true),
  ('22222222-2222-2222-2222-222222222222', 'Landlord B', 'landlordB@gidaa.test', '+2348022222222', 'landlord', null, true),
  ('33333333-3333-3333-3333-333333333333', 'Landlord C', 'landlordC@gidaa.test', '+2348033333333', 'landlord', null, true),
  ('99999999-9999-9999-9999-999999999999', 'Renter Demo', 'renter@gidaa.test', '+2348099999999', 'renter', null, true)
on conflict (id) do nothing;

-- Sample properties (Lagos, Abuja, Kaduna)
insert into properties (id, landlord_id, title, description, property_type, address, area, city, state, annual_rent, caution_deposit, service_charge, legal_fee, agency_fee, bedrooms, bathrooms, parking_spaces, status, verification_status)
values
  ('p-1','11111111-1111-1111-1111-111111111111','Spacious 2 Bedroom in Lekki','Bright 2BR near Lekki Phase 1','2 Bedroom','11 Palm Street','Lekki Phase 1','Lekki','Lagos',1200000,60000,20000,50000,60000,2,2,1,'published','verified'),
  ('p-2','11111111-1111-1111-1111-111111111111','Self-Contained Studio Yaba','Compact self-contained apartment in Yaba','Self-Contained','5 Tech Road','Yaba','Yaba','Lagos',400000,20000,5000,10000,20000,1,1,0,'published','verified'),
  ('p-3','22222222-2222-2222-2222-222222222222','3 Bedroom Duplex in Gwarinpa','Family duplex with compound','Duplex','12 Garden Layout','Gwarinpa','Gwarinpa','Abuja',1800000,90000,30000,60000,90000,3,3,2,'published','verified'),
  ('p-4','22222222-2222-2222-2222-222222222222','1 Bedroom Flat in Wuse','Cozy 1BR, close to Garki market','1 Bedroom','34 Market Lane','Wuse','Wuse','Abuja',600000,30000,10000,15000,30000,1,1,0,'published','pending'),
  ('p-5','33333333-3333-3333-3333-333333333333','4 Bedroom Detached House Ikeja','Spacious detached house with garden','Detached House','78 Hilltop Avenue','Ikeja','Ikeja','Lagos',2500000,125000,50000,80000,120000,4,4,2,'published','verified'),
  ('p-6','11111111-1111-1111-1111-111111111111','2 Bedroom Flat in Kaduna','Modern 2BR near Central Mall','2 Bedroom','22 Central Road','Ungwan Rimi','Kaduna','Kaduna',800000,40000,15000,20000,40000,2,2,1,'published','verified'),
  ('p-7','22222222-2222-2222-2222-222222222222','Self-Contained Lekki Elegance','New self-contained unit','Self-Contained','9 Ocean Drive','Lekki Phase 1','Lekki','Lagos',500000,25000,8000,12000,25000,1,1,0,'published','pending'),
  ('p-8','33333333-3333-3333-3333-333333333333','3 Bedroom Apartment in Yaba','Renovated 3BR apartment','3 Bedroom','3 Tech Street','Yaba','Yaba','Lagos',1500000,75000,25000,35000,75000,3,2,1,'published','verified'),
  ('p-9','11111111-1111-1111-1111-111111111111','Duplex Near Lekki Tollgate','Luxury duplex with pool','Duplex','101 Palm Boulevard','Lekki Phase 1','Lekki','Lagos',4500000,225000,60000,90000,150000,4,4,3,'draft','pending'),
  ('p-10','22222222-2222-2222-2222-222222222222','Affordable 1BR in Gwarinpa','Budget 1 bedroom apartment','1 Bedroom','7 Estate Road','Gwarinpa','Gwarinpa','Abuja',450000,22500,8000,12000,20000,1,1,0,'published','verified'),
  ('p-11','33333333-3333-3333-3333-333333333333','2 Bedroom in Lekki-Epe','Quiet neighborhood, secure estate','2 Bedroom','55 Palm Grove','Ikate','Lekki','Lagos',1100000,55000,20000,25000,50000,2,2,1,'published','verified'),
  ('p-12','11111111-1111-1111-1111-111111111111','Studio in Ikeja GRA','Compact studio close to amenities','Self-Contained','2 GRA Close','GRA','Ikeja','Lagos',350000,17500,5000,8000,15000,1,1,0,'published','verified'),
  ('p-13','22222222-2222-2222-2222-222222222222','3BR House in Kaduna City','Family home with borehole','3 Bedroom','44 River Road','Kaduna City','Kaduna','Kaduna',900000,45000,20000,25000,45000,3,2,2,'published','pending'),
  ('p-14','33333333-3333-3333-3333-333333333333','4+ Bedroom Mansion Abuja','Executive home in serene area','4+ Bedroom','1 Presidential Way','Asokoro','Abuja',6000000,300000,100000,150000,250000,6,6,4,'published','verified'),
  ('p-15','11111111-1111-1111-1111-111111111111','1 Bedroom Compact in Yaba','Ideal for young professionals','1 Bedroom','8 Tech Plaza','Yaba','Yaba','Lagos',500000,25000,7000,10000,20000,1,1,0,'published','verified'
  )
on conflict (id) do nothing;

-- Sample images (public unsplash placeholders) mapped to a few properties
insert into property_images (property_id, url, position, is_cover)
values
  ('p-1','https://images.unsplash.com/photo-1560185127-6c4f4b5a9a9f?w=1200&q=80',0,true),
  ('p-1','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80',1,false),
  ('p-1','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',2,false),
  ('p-2','https://images.unsplash.com/photo-1505691723518-36a0f9b0f0a9?w=1200&q=80',0,true),
  ('p-3','https://images.unsplash.com/photo-1572120360610-d971b9b8c7a6?w=1200&q=80',0,true),
  ('p-5','https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',0,true),
  ('p-8','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',0,true),
  ('p-14','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',0,true)
on conflict do nothing;

-- Map some amenities (IDs assume order from schema.sql inserts)
insert into property_amenities (property_id, amenity_id)
values
  ('p-1',1),('p-1',3),('p-1',11),
  ('p-2',1),('p-2',6),
  ('p-3',3),('p-3',4),('p-3',2),
  ('p-5',3),('p-5',11),('p-5',12),
  ('p-8',1),('p-8',3),('p-8',9),
  ('p-14',3),('p-14',11),('p-14',12)
on conflict do nothing;

-- create a few saved properties for the demo renter
insert into saved_properties (id, user_id, property_id)
values
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 'p-1'),
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 'p-8')
on conflict do nothing;
