USE [Vape];

-- Variables to hold Category IDs
DECLARE @cpuId INT = (SELECT TOP 1 Id FROM Categories WHERE Name = 'CPUs' ORDER BY Id DESC);
DECLARE @gpuId INT = (SELECT TOP 1 Id FROM Categories WHERE Name = 'GPUs' ORDER BY Id DESC);
DECLARE @ramId INT = (SELECT TOP 1 Id FROM Categories WHERE Name = 'RAM' ORDER BY Id DESC);
DECLARE @storageId INT = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Storage' ORDER BY Id DESC);
DECLARE @moboId INT = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Motherboards' ORDER BY Id DESC);

-- Products
INSERT INTO Products (Title, Description, Price, Stock, Image, CategoryId, Status, CreatedAt, Gallery) VALUES 
('AMD Ryzen 9 7950X', '16-Core, 32-Thread Unlocked Desktop Processor with Zen 4 architecture.', 599.00, 50, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80', @cpuId, 0, GETUTCDATE(), '[]'),
('Intel Core i9-14900K', '24 cores (8 P-cores + 16 E-cores) and 32 threads, up to 6.0 GHz.', 589.99, 30, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80', @cpuId, 0, GETUTCDATE(), '[]'),
('Intel Core i5-13600K', '14 cores (6 P-cores + 8 E-cores) and 20 threads. Excellent for gaming.', 319.99, 70, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80', @cpuId, 0, GETUTCDATE(), '[]'),
('NVIDIA GeForce RTX 4090', '24GB GDDR6X, Ada Lovelace Architecture, DLSS 3.', 1599.99, 10, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80', @gpuId, 0, GETUTCDATE(), '[]'),
('AMD Radeon RX 7900 XTX', '24GB GDDR6, RDNA 3 Architecture, excellent 4K gaming performance.', 999.00, 20, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80', @gpuId, 0, GETUTCDATE(), '[]'),
('ASUS ROG Strix GeForce RTX 4080', '16GB GDDR6X, incredible thermal design and DLSS 3 support.', 1199.99, 15, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80', @gpuId, 0, GETUTCDATE(), '[]'),
('Corsair Vengeance RGB 32GB', 'DDR5 6000MHz C36 Memory Kit, optimized for Intel/AMD.', 114.99, 100, 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&q=80', @ramId, 0, GETUTCDATE(), '[]'),
('G.Skill Trident Z5 RGB 64GB', 'DDR5 6400MHz Desktop Memory, high capacity for creators.', 219.99, 40, 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&q=80', @ramId, 0, GETUTCDATE(), '[]'),
('Samsung 990 PRO 2TB', 'PCIe 4.0 NVMe M.2 SSD, blazing fast read/write speeds.', 169.99, 200, 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&q=80', @storageId, 0, GETUTCDATE(), '[]'),
('Western Digital WD_BLACK 1TB', 'SN850X NVMe Internal Gaming SSD, with heatsink option.', 84.99, 150, 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&q=80', @storageId, 0, GETUTCDATE(), '[]'),
('MSI MAG B650 TOMAHAWK WIFI', 'AM5 ATX Motherboard, DDR5, PCIe 4.0, Wi-Fi 6E.', 219.99, 45, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', @moboId, 0, GETUTCDATE(), '[]'),
('ASUS ROG Maximus Z790 Hero', 'Intel Z790 ATX Motherboard, DDR5, PCIe 5.0, Wi-Fi 6E.', 629.99, 12, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', @moboId, 0, GETUTCDATE(), '[]');
