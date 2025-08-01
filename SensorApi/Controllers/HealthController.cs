using Microsoft.AspNetCore.Mvc;

namespace SensorApi.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("I'm Up.");
        }

    }
}