using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var fears = await _context.Fears
            .Where(f => f.UserId == userId)
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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var fear = await _context.Fears
            .Where(f => f.Id == id && f.UserId == userId)
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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest("Title is required.");
        }

        var newFear = new Fear
        {
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            CurrentAnxietyLevel = dto.CurrentAnxietyLevel,
            CreatedAt = DateTime.UtcNow,
            UserId = userId
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
    public async Task<IActionResult> Update(int id, UpdateFearDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest("Title is required.");
        }

        var fear = await _context.Fears
            .FirstOrDefaultAsync(f =>
                f.Id == id &&
                f.UserId == userId
            );

        if (fear == null)
        {
            return NotFound();
        }

        fear.Title = dto.Title.Trim();
        fear.Description = dto.Description?.Trim();
        fear.CurrentAnxietyLevel = dto.CurrentAnxietyLevel;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var fear = await _context.Fears
            .FirstOrDefaultAsync(f =>
                f.Id == id &&
                f.UserId == userId
            );

        if (fear == null)
        {
            return NotFound();
        }

        _context.Fears.Remove(fear);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}