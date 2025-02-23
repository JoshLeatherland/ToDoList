using System.Text.Json.Serialization;

namespace Database.Entities
{
    public class BoardDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("columns")]
        public List<ColumnDto> Columns { get; set; } = [];
    }
}
