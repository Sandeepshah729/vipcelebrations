INSERT OR IGNORE INTO programs(name,slug,sort_order) VALUES
('Birthday Decoration','birthday-decoration',1),
('Theme Based Birthday','theme-based-birthday',2),
('Anniversary','anniversary',3),
('Baby Shower','baby-shower',4),
('Welcome Baby','welcome-baby',5),
('Annaprashan','annaprashan',6),
('Balloon Decoration','balloon-decoration',7),
('Wedding Stage','wedding-stage',8),
('Haldi - Mehendi','haldi-mehendi',9),
('Entry Setup','entry-setup',10);

INSERT OR IGNORE INTO budgets(name,min_price,max_price,sort_order) VALUES
('Starting ₹1,000+',1000,NULL,1),
('Under ₹3,000',1000,2999,2),
('Under ₹5,000',1000,4999,3),
('Under ₹8,000',1000,7999,4),
('Under ₹10,000',1000,9999,5),
('Under ₹15,000',1000,14999,6),
('Under ₹20,000',1000,19999,7),
('Under ₹25,000',1000,24999,8),
('Under ₹30,000',1000,29999,9),
('Under ₹40,000',1000,39999,10),
('Under ₹50,000',1000,49999,11);

INSERT OR IGNORE INTO settings(setting_key,setting_value) VALUES
('business_name','VIP CELEBRATIONS'),
('whatsapp','9691683699'),
('instagram','https://www.instagram.com/vip_celebrations'),
('facebook','https://www.facebook.com/vipcelebrations1'),
('youtube','https://youtube.com/@vipcelebrations'),
('google_maps','https://maps.app.goo.gl/fA1tQ4AiJhRDjxQw5'),
('starting_price','1000'),
('city','Waidhan'),
('district','Singrauli'),
('state','Madhya Pradesh'),
('country','India');
