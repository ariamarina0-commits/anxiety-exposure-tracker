namespace backend.DTOs;

public class CreateFearDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description{ get; set; } 
    public int CurrentAnxietyLevel { get; set; }
}