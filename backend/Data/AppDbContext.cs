using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
    public DbSet<Fear> Fears => Set<Fear>();
    public DbSet<ExposureSession> ExposureSessions => Set<ExposureSession>();
}