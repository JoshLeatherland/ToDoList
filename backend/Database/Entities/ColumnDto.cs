using System.Text.Json.Serialization;

namespace Database.Entities
{
    public class ColumnDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("showCompleted")]
        public bool ShowCompleted { get; set; }
        [JsonPropertyName("blurTasks")]
        public bool BlurTasks { get; set; }
        [JsonPropertyName("tasks")]
        public List<TaskDto> Tasks { get; set; } = [];
    }
}
