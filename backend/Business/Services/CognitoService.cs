using Amazon.CognitoIdentityProvider;
using Business.Services.Interfaces;
using Models.Constants;
using Models.ViewModels;
using System.Text.Json;

namespace Business.Services
{
    public class CognitoService(IAwsSecretService awsSecretService) : ICognitoService
    {
        private readonly IAwsSecretService _awsSecretService = awsSecretService;

        /// <summary>
        /// There isnt a SDK for this so have to do Http.
        /// Could send direct from clientside but I want to store as secure cookie and not local/session storage.
        /// </summary>
        /// <param name="authorizationCode"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<TokenResponse> GetToken(string authorizationCode)
        {
            var cognitoConfig = await GetCognitoConfigurationAsync();

            using var httpClient = new HttpClient();
            var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "grant_type", "authorization_code" },
                { "client_id", cognitoConfig.ClientId },
                { "code", authorizationCode },
                { "redirect_uri", cognitoConfig.RedirectUri }
            });

            var response = await httpClient.PostAsync(cognitoConfig.AuthUrl, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine(responseBody);
                throw new Exception($"Error exchanging code: {responseBody}");
            }

            return JsonSerializer.Deserialize<TokenResponse>(responseBody);
        }

        public async Task<CognitoConfiguration> GetCognitoConfigurationAsync()
        {
            var secretString = await _awsSecretService.GetSecretASync(SecretManagerKeys.CognitoConfiguration);

            return JsonSerializer.Deserialize<CognitoConfiguration>(secretString) ?? 
                throw new InvalidOperationException("Failed to find Cognito Configuration");
        }
    }
}
