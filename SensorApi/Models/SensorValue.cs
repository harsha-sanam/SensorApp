namespace SensorApi.Models
{
    public class SensorValue
    {
        public int Id { get; set; }
        public int SensorId { get; set; }
        public DateTime Timestamp { get; set; }
        public double Value { get; set; }
    }
}