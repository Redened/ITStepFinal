using VAPE.Data;
using VAPE.Mappers;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace VAPE.Tests
{
    /// <summary>
    /// Shared helpers for building isolated in-memory <see cref="DataContext"/>
    /// instances and a real AutoMapper instance for service tests.
    /// </summary>
    public static class TestHelpers
    {
        public static DataContext NewContext()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new DataContext(options);
        }

        public static IMapper CreateMapper()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ProductMappers>());
            return config.CreateMapper();
        }
    }
}
