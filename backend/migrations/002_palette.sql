-- Add palette_slug to invitations table
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS palette_slug VARCHAR(50) DEFAULT NULL;

-- Seed 25 new templates into themes table
INSERT INTO themes (slug, name) VALUES
  ('min-ivory','Ivory'),('min-slate','Slate'),('min-sage','Sage'),('min-noir','Noir'),('min-blush','Blush'),
  ('flo-rose','Rose Garden'),('flo-peony','Peony'),('flo-jasmine','Jasmine'),('flo-orchid','Orchid'),('flo-sakura','Sakura'),
  ('nat-forest','Forest'),('nat-bamboo','Bamboo'),('nat-sunset','Sunset'),('nat-ocean','Ocean'),('nat-stone','Stone'),
  ('fai-aurora','Aurora'),('fai-starlight','Starlight'),('fai-crystal','Crystal'),('fai-enchanted','Enchanted'),('fai-dreamy','Dreamy'),
  ('adt-javanese','Javanese'),('adt-sundanese','Sundanese'),('adt-batak','Batak'),('adt-minang','Minang'),('adt-betawi','Betawi')
ON CONFLICT (slug) DO NOTHING;
