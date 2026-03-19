-- Seed data for LocalLens (optional)
-- Run after schema.sql

insert into public.businesses (name, category, location, short_description, address_line)
values
  ('Harbor Cafe','Cafe','Riverside','Cozy coffee, light bites, and a calm workspace.','12 Riverwalk Ave, Riverside'),
  ('Midtown Bites','Restaurant','Midtown','Modern comfort food with seasonal specials.','88 Market St, Midtown'),
  ('Paper Lantern Books','Bookstore','Downtown','Indie bookstore with staff picks and events.','210 Cedar Rd, Downtown'),
  ('Uptown Crumb Bakery','Bakery','Uptown','Fresh bread, pastries, and espresso daily.','5 Alder Blvd, Uptown'),
  ('Iron Yard Gym','Gym','Midtown','Strength training, classes, and friendly coaches.','33 Atlas Way, Midtown'),
  ('Studio Satin Salon','Salon','Downtown','Cuts, color, and styling with consultation-first care.','19 Blossom Ln, Downtown')
on conflict do nothing;
