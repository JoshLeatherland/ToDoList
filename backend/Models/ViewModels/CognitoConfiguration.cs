using System.Text.Json.Serialization;

namespace Models.ViewModels
{
    public class CognitoConfiguration
    {
        [JsonPropertyName("UserPoolId")]
        public string UserPoolId { get; set; } = string.Empty;
        [JsonPropertyName("ClientId")]
        public string ClientId { get; set; } = string.Empty;
        [JsonPropertyName("RedirectUri")]
        public string RedirectUri { get; set; } = string.Empty;
        [JsonPropertyName("AuthUrl")]
        public string AuthUrl { get; set; } = string.Empty;
    }
}
