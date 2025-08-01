
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SensorApi.Data;
using SensorApi.Models;

namespace SensorApi.Controllers
{

[ApiController]
[Route("api/sensorvalues")]
public class SensorValuesController : ControllerBase {
    private readonly AppDbContext _context;
    public SensorValuesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetValues(string name, DateTime startDate, DateTime endDate) {
        var sensor = await _context.Sensors.FirstOrDefaultAsync(s => s.Name == name);
        if (sensor == null) return NotFound();

        var values = await _context.SensorValues
            .Where(v => v.SensorId == sensor.Id && v.Timestamp >= startDate && v.Timestamp <= endDate)
            .ToListAsync();

        return Ok(values);
    }
[HttpPost]
public async Task<IActionResult> AddValues([FromBody] List<SensorValue> values)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState); // <-- Returns detailed validation issues
    }

    _context.SensorValues.AddRange(values);
    await _context.SaveChangesAsync();
    return Ok(values);
}

}
}