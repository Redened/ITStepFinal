using VAPE.Extensions;
using VAPE.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServices(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    DbSeeder.Seed(context);
}

app.UseApp();

app.Run();
