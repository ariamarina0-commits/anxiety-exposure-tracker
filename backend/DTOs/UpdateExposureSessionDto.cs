using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class UpdateExposureSessionDto
{
    [Range(1, int.MaxValue, ErrorMessage = "FearId must be greater than 0.")]
    public int FearId { get; set; }

    [Range(0, 100, ErrorMessage = "Anxiety before must be between 0 and 100.")]
    public int AnxietyBefore { get; set; }

    [Range(0, 100, ErrorMessage = "Anxiety after must be between 0 and 100.")]
    public int AnxietyAfter { get; set; }

    [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters.")]
    public string? Notes { get; set; }
}