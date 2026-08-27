CREATE TABLE IF NOT EXISTS programs(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS budgets(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,max_price INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS albums(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,description TEXT DEFAULT '',program_id INTEGER,budget_id INTEGER,price INTEGER DEFAULT 0,keywords TEXT DEFAULT '',youtube_url TEXT DEFAULT '',is_published INTEGER DEFAULT 1,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS photos(id INTEGER PRIMARY KEY AUTOINCREMENT,album_id INTEGER NOT NULL,object_key TEXT NOT NULL UNIQUE,alt_text TEXT DEFAULT '',sort_order INTEGER DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS videos(id INTEGER PRIMARY KEY AUTOINCREMENT,youtube_id TEXT NOT NULL UNIQUE,title TEXT NOT NULL,description TEXT DEFAULT '',published_at TEXT,thumbnail_url TEXT DEFAULT '',source TEXT DEFAULT 'channel-sync');
CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,excerpt TEXT DEFAULT '',content TEXT DEFAULT '',keywords TEXT DEFAULT '',image_key TEXT,is_published INTEGER DEFAULT 1,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS settings(setting_key TEXT PRIMARY KEY,setting_value TEXT NOT NULL);

INSERT OR IGNORE INTO programs(name,slug) VALUES
('Birthday Decoration','birthday-decoration'),('Theme Based Birthday','theme-based-birthday'),('Anniversary','anniversary'),('Baby Shower','baby-shower'),('Welcome Baby','welcome-baby'),('Annaprashan','annaprasan'),('Balloon Decoration','balloon-decoration'),('Wedding Stage','wedding-stage'),('Haldi - Mehendi','haldi-mehendi'),('Entry Setup','entry-setup');
INSERT OR IGNORE INTO budgets(name,max_price,slug) VALUES
('Starting',1000,'starting'),('Under ₹3,000',3000,'under-3000'),('Under ₹5,000',5000,'under-5000'),('Under ₹8,000',8000,'under-8000'),('Under ₹10,000',10000,'under-10000'),('Under ₹15,000',15000,'under-15000'),('Under ₹20,000',20000,'under-20000'),('Under ₹25,000',25000,'under-25000'),('Under ₹30,000',30000,'under-30000'),('Under ₹40,000',40000,'under-40000'),('Under ₹50,000',50000,'under-50000');
