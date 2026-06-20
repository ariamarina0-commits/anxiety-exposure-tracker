using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FearController : ControllerBase
{
    private readonly AppDbContext _context;

    public FearController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var fears = await _context.Fears
            .Select(f => new
            {
                f.Id,
                f.Title,
                f.Description,
                f.CurrentAnxietyLevel,
                f.CreatedAt,
                ExposureSessions = f.ExposureSessions.Select(s => new
                {
                    s.Id,
                    s.FearId,
                    s.Date,
                    s.AnxietyBefore,
                    s.AnxietyAfter,
                    s.Notes
                }).ToList()
            })
            .ToListAsync();

        return Ok(fears);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var fear = await _context.Fears
            .Where(f => f.Id == id)
            .Select(f => new
            {
                f.Id,
                f.Title,
                f.Description,
                f.CurrentAnxietyLevel,
                f.CreatedAt,
                ExposureSessions = f.ExposureSessions.Select(s => new
                {
                    s.Id,
                    s.FearId,
                    s.Date,
                    s.AnxietyBefore,
                    s.AnxietyAfter,
                    s.Notes
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (fear == null)
        {
            return NotFound();
        }

        return Ok(fear);
    }

[HttpPost]
public async Task<ActionResult> Create(CreateFearDto dto)
{
    if (string.IsNullOrWhiteSpace(dto.Title))
    {
        return BadRequest("Title is required.");
    }

    var newFear = new Fear
    {
        Title = dto.Title,
        Description = dto.Description,
        CurrentAnxietyLevel = dto.CurrentAnxietyLevel,
        CreatedAt = DateTime.UtcNow
    };

    _context.Fears.Add(newFear);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = newFear.Id }, new
    {
        newFear.Id,
        newFear.Title,
        newFear.Description,
        newFear.CurrentAnxietyLevel,
        newFear.CreatedAt,
        ExposureSessions = new List<object>()
    });
}

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Fear updatedFear)
    {
        var fear = await _context.Fears.FindAsync(id);

        if (fear == null)
        {
            return NotFound();
        }

        fear.Title = updatedFear.Title;
        fear.Description = updatedFear.Description;
        fear.CurrentAnxietyLevel = updatedFear.CurrentAnxietyLevel;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var fear = await _context.Fears.FindAsync(id);

        if (fear == null)
        {
            return NotFound();
        }

        _context.Fears.Remove(fear);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}