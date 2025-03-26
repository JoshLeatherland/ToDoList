using System.Text.Json.Serialization;

namespace Database.Entities
{
    public class TaskDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;
        [JsonPropertyName("timestamp")]
        public string Timestamp { get; set; } = string.Empty;
        [JsonPropertyName("comments")]
        public List<CommentDto> Comments { get; set; } = [];
        [JsonPropertyName("completed")]
        public bool Completed { get; set; }
        [JsonPropertyName("completedDate")]
        public string CompletedDate { get; set; } = string.Empty;
    }
}
