using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (builder.Environment.IsProduction())
    {
        options.UseNpgsql(connectionString).ConfigureWarnings(warnings=>warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

//app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.MapControllers();

app.MapGet("/", () => "Anxiety Exposure Tracker API is running");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();