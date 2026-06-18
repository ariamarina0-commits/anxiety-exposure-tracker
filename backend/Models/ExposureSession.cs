namespace backend.Models;

public class ExposureSession
{
    public int Id{get;set;}
    public int FearId{get;set;}
    public Fear Fear{get;set;} = null!;
    public DateTime Date{get;set;} = DateTime.UtcNow;
    public int AnxietyBefore{get;set;}
    public int AnxietyAfter{get;set;}

    public string? Notes{get;set;}

}