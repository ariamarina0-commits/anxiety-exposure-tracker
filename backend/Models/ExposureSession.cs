using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class ExposureSession
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int FearId { get; set; }
    public Fear Fear { get; set; } = null!;

    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int AnxietyBefore { get; set; }
    public int AnxietyAfter { get; set; }
    public string? Notes { get; set; }
}