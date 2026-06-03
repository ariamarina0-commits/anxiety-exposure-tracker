using backend.Data;
using backend.Models;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
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
        var sessions = await _context.ExposureSessions
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
    public async Task<ActionResult<ExposureSession>> GetById(int id)
    {
        var session = await _context.ExposureSessions
            .Include(s => s.Fear)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
        {
            return NotFound();
        }

        return session;
    }

    [HttpGet("fear/{fearId}")]
    public async Task<ActionResult> GetByFearId(int fearId)
    {
        var fearExists = await _context.Fears.AnyAsync(f => f.Id == fearId);

        if (!fearExists)
        {
            return NotFound("Fear not found.");
        }

        var sessions = await _context.ExposureSessions
            .Where(s => s.FearId == fearId)
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
    public async Task<ActionResult<ExposureSession>> Create(CreateExposureSessionDto dto)
    {
        var fearExists = await _context.Fears.AnyAsync(f => f.Id == dto.FearId);

        if (!fearExists)
        {
            return BadRequest("Invalid FearId.");
        }

        var session = new ExposureSession
        {
            FearId = dto.FearId,
            AnxietyBefore = dto.AnxietyBefore,
            AnxietyAfter = dto.AnxietyAfter,
            Notes = dto.Notes,
            Date = DateTime.UtcNow
        };

        _context.ExposureSessions.Add(session);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = session.Id }, new
        {
            session.Id,
            session.FearId,
            session.Date,
            session.AnxietyBefore,
            session.AnxietyAfter,
            session.Notes
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ExposureSession updatedSession)
    {
        var session = await _context.ExposureSessions.FindAsync(id);

        if (session == null)
        {
            return NotFound();
        }

        var fearExists = await _context.Fears.AnyAsync(f => f.Id == updatedSession.FearId);

        if (!fearExists)
        {
            return BadRequest("Invalid FearId.");
        }

        session.FearId = updatedSession.FearId;
        session.Date = updatedSession.Date;
        session.AnxietyBefore = updatedSession.AnxietyBefore;
        session.AnxietyAfter = updatedSession.AnxietyAfter;
        session.Notes = updatedSession.Notes;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var session = await _context.ExposureSessions.FindAsync(id);

        if (session == null)
        {
            return NotFound();
        }

        _context.ExposureSessions.Remove(session);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}