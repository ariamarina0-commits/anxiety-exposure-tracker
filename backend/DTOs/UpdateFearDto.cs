using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class UpdateFearDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string? Description { get; set; }

    [Range(0, 100, ErrorMessage = "Anxiety level must be between 0 and 100.")]
    public int CurrentAnxietyLevel { get; set; }
}