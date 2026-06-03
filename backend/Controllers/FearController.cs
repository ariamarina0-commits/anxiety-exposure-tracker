using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class FearController : ControllerBase
{
    private readonly AppDbContext _context;
    public FearController(AppDbContext context)
    {
        _context=context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Fear>>> GetAll()
    {
        return await _context.Fears
            .Include(f => f.ExposureSessions)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Fear>> GetById(int id)
    {
        var fear = await _context.Fears
            .Include(f => f.ExposureSessions)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (fear == null)
        {
            return NotFound();
        }

        return fear;
    }


    [HttpPost]
    public async Task<ActionResult<Fear>> Create(Fear fear)
    {
        _context.Fears.Add(fear);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = fear.Id }, fear);
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