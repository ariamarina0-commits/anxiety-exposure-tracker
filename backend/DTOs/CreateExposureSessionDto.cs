namespace backend.DTOs;

public class CreateExposureSessionDto
{
    public int FearId { get; set; }
    public int AnxietyBefore { get; set; }
    public int AnxietyAfter { get; set; }
    public string? Notes { get; set; }
}