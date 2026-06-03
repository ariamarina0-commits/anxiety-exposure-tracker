namespace backend.Models;

public class Fear
{
    public int Id {get;set;}
    public string Title {get;set;}
    public string ? Description{get;set;}
    public int CurrentAnxietyLevel{get;set;}
    public DateTime CreatedAt{get;set;} = DateTime.UtcNow;
    public List<ExposureSession> ExposureSessions{get;set;} = new();

}