using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SensorApi.Data;
using SensorApi.Models;

namespace SensorApi.Controllers
{
    [ApiController]
    [Route("api/sensors")]
    public class SensorsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SensorsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetSensors()
        {
            var sensors = await _context.Sensors.ToListAsync();
            return Ok(sensors);
        }

        [HttpPost]
        public async Task<IActionResult> AddSensor([FromBody] Sensor sensor)
        {
            if (sensor == null)
            {
                return BadRequest();
            }
            _context.Sensors.Add(sensor);
            await _context.SaveChangesAsync();
            return Ok(sensor);
        }
    }
}