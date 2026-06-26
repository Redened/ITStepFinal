using VAPE.Enums;
using VAPE.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace VAPE.Data
{
    public static class DbSeeder
    {
        public static void Seed(DataContext context)
        {

            if (!context.Categories.Any())
            {
                var eliquid = new Category { Name = "E-Liquids", ImageUrl = "" };
                var mods = new Category { Name = "Mods & Kits", ImageUrl = "" };
                var coils = new Category { Name = "Coils & Pods", ImageUrl = "" };
                var disposables = new Category { Name = "Disposables", ImageUrl = "" };
                var accessories = new Category { Name = "Accessories", ImageUrl = "" };
                
                context.Categories.AddRange(eliquid, mods, coils, disposables, accessories);
                context.SaveChanges();

                context.Products.AddRange(
                    new Product { Title = "Premium Mango Ice E-Liquid", Description = "60ml bottle of smooth mango flavor with an icy finish.", Price = 19.99, Stock = 150, Image = "/assets/images/products/sample_mango_vape_juice.jpg", CategoryId = eliquid.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Naked 100 Hawaiian POG", Description = "60ml of passion fruit, orange, and guava blend. A tropical classic.", Price = 22.99, Stock = 120, Image = "/assets/images/products/naked_100_pog.jpg", CategoryId = eliquid.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Jam Monster Strawberry", Description = "100ml of sweet strawberry jam on buttered toast.", Price = 24.99, Stock = 80, Image = "/assets/images/products/jam_monster_strawberry.jpg", CategoryId = eliquid.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Pachamama Fuji Apple", Description = "60ml crisp Fuji apple mixed with strawberries and nectarines.", Price = 21.99, Stock = 90, Image = "/assets/images/products/pachamama_fuji_apple.jpg", CategoryId = eliquid.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "VooPoo Drag 4 Starter Kit", Description = "Dual 18650 mod with 177W output. Perfect for cloud chasers.", Price = 69.99, Stock = 45, Image = "/assets/images/products/voopoo_drag_4.jpg", CategoryId = mods.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "GeekVape Aegis Legend 2", Description = "Shockproof, waterproof, and dustproof 200W mod.", Price = 59.99, Stock = 30, Image = "/assets/images/products/geekvape_aegis.jpg", CategoryId = mods.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Vaporesso XROS 3 Mini", Description = "Compact and highly reliable pod system with excellent flavor.", Price = 29.99, Stock = 85, Image = "/assets/images/products/vaporesso_xros.jpg", CategoryId = mods.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "GeekVape L200 Classic Kit", Description = "Dual 21700 battery mod for extreme battery life and durability.", Price = 89.99, Stock = 20, Image = "/assets/images/products/geekvape_l200.jpg", CategoryId = mods.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Smok Novo 4 Replacement Pods", Description = "Pack of 3 empty replacement pods.", Price = 12.99, Stock = 200, Image = "/assets/images/products/smok_novo_pods.jpg", CategoryId = coils.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Uwell Caliburn G2 Pods", Description = "Pack of 2 replacement pods for the Caliburn G2.", Price = 9.99, Stock = 150, Image = "/assets/images/products/caliburn_g2_pods.jpg", CategoryId = coils.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "SMOK TFV18 Replacement Coils", Description = "Pack of 3 mesh coils designed for massive vapor production.", Price = 14.99, Stock = 100, Image = "/assets/images/products/smok_coils.jpg", CategoryId = coils.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Elf Bar BC5000 - Watermelon Ice", Description = "5000 puffs of refreshing watermelon ice flavor. Rechargeable.", Price = 19.99, Stock = 300, Image = "/assets/images/products/elf_bar_watermelon.jpg", CategoryId = disposables.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Lost Mary OS5000 - Blue Razz", Description = "5000 puffs of sweet and tart blue raspberry.", Price = 20.99, Stock = 250, Image = "/assets/images/products/lost_mary_blue_razz.jpg", CategoryId = disposables.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Nitecore D4 Battery Charger", Description = "4-slot intelligent battery charger compatible with 18650 and 21700 cells.", Price = 34.99, Stock = 60, Image = "/assets/images/products/nitecore_charger.jpg", CategoryId = accessories.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() },
                    new Product { Title = "Samsung 25R 18650 Battery", Description = "Reliable 2500mAh 20A high-drain flat top battery.", Price = 7.99, Stock = 400, Image = "/assets/images/products/samsung_25r_battery.jpg", CategoryId = accessories.Id, Status = ProductStatus.Active, CreatedAt = DateTime.UtcNow, Gallery = new System.Collections.Generic.List<string>() }
                );

                var admin = new User
                {
                    Username = "admin",
                    Email = "admin@vape.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    IsVerified = true,
                    Role = UserRoles.Admin,
                    UserDetails = new UserDetails { Address = "123 Admin St", PhoneNumber = "555-0100" }
                };
                context.Users.Add(admin);

                context.SaveChanges();
            }
        }
    }
}
