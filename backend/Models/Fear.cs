using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Fear
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CurrentAnxietyLevel { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<ExposureSession> ExposureSessions { get; set; } = new();
}