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
public class ExposureSessionController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExposureSessionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var sessions = await _context.ExposureSessions
            .Where(s => s.Fear.UserId == userId)
            .OrderByDescending(s => s.Date)
            .Select(s => new
            {
                s.Id,
                s.FearId,
                FearTitle = s.Fear.Title,
                s.Date,
                s.AnxietyBefore,
                s.AnxietyAfter,
                s.Notes
            })
            .ToListAsync();

        return Ok(sessions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var session = await _context.ExposureSessions
            .Where(s =>
                s.Id == id &&
                s.Fear.UserId == userId
            )
            .Select(s => new
            {
                s.Id,
                s.FearId,
                s.Date,
                s.AnxietyBefore,
                s.AnxietyAfter,
                s.Notes
            })
            .FirstOrDefaultAsync();

        if (session == null)
        {
            return NotFound();
        }

        return Ok(session);
    }

    [HttpGet("fear/{fearId}")]
    public async Task<ActionResult> GetByFearId(int fearId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var fearExists = await _context.Fears
            .AnyAsync(f =>
                f.Id == fearId &&
                f.UserId == userId
            );

        if (!fearExists)
        {
            return NotFound();
        }

        var sessions = await _context.ExposureSessions
            .Where(s =>
                s.FearId == fearId &&
                s.Fear.UserId == userId
            )
            .OrderByDescending(s => s.Date)
            .Select(s => new
            {
                s.Id,
                s.FearId,
                s.Date,
                s.AnxietyBefore,
                s.AnxietyAfter,
                s.Notes
            })
            .ToListAsync();

        return Ok(sessions);
    }

    [HttpPost]
    public async Task<ActionResult<ExposureSession>> Create(
        CreateExposureSessionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var fearExists = await _context.Fears
            .AnyAsync(f =>
                f.Id == dto.FearId &&
                f.UserId == userId
            );

        if (!fearExists)
        {
            return NotFound();
        }

        var session = new ExposureSession
        {
            FearId = dto.FearId,
            AnxietyBefore = dto.AnxietyBefore,
            AnxietyAfter = dto.AnxietyAfter,
            Notes = dto.Notes?.Trim(),
            Date = DateTime.UtcNow
        };

        _context.ExposureSessions.Add(session);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = session.Id },
            new
            {
                session.Id,
                session.FearId,
                session.Date,
                session.AnxietyBefore,
                session.AnxietyAfter,
                session.Notes
            }
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateExposureSessionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var session = await _context.ExposureSessions
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                s.Fear.UserId == userId
            );

        if (session == null)
        {
            return NotFound();
        }

        var destinationFearExists = await _context.Fears
            .AnyAsync(f =>
                f.Id == dto.FearId &&
                f.UserId == userId
            );

        if (!destinationFearExists)
        {
            return NotFound();
        }

        session.FearId = dto.FearId;
        session.AnxietyBefore = dto.AnxietyBefore;
        session.AnxietyAfter = dto.AnxietyAfter;
        session.Notes = dto.Notes?.Trim();

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var session = await _context.ExposureSessions
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                s.Fear.UserId == userId
            );

        if (session == null)
        {
            return NotFound();
        }

        _context.ExposureSessions.Remove(session);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}