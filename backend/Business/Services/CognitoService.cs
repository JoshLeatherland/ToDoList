using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Business.Services.Interfaces;
using Models.Constants;
using Models.ViewModels;
using System.Text.Json;

namespace Business.Services
{
    public class CognitoService(IAwsSecretService awsSecretService, IAmazonCognitoIdentityProvider cognitoProvider) : ICognitoService
    {
        private readonly IAwsSecretService _awsSecretService = awsSecretService;
        private readonly IAmazonCognitoIdentityProvider _cognitoProvider = cognitoProvider;

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

        /// <summary>
        /// A users access token has expired, renew it using the refresh token.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<TokenResponse> RefreshToken(string refreshToken)
        {
            var cognitoConfig = await GetCognitoConfigurationAsync();

            using var httpClient = new HttpClient();
            var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "grant_type", "refresh_token" },
                { "client_id", cognitoConfig.ClientId },
                { "refresh_token", refreshToken }
            });

            var response = await httpClient.PostAsync(cognitoConfig.AuthUrl, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Error refreshing token: {responseBody}");
            }

            return JsonSerializer.Deserialize<TokenResponse>(responseBody);
        }

        /// <summary>
        /// Any sensitive information is stored inside SecretsManager (AWS), fetch it with this func.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task<CognitoConfiguration> GetCognitoConfigurationAsync()
        {
            var secretString = await _awsSecretService.GetSecretASync(SecretManagerKeys.CognitoConfiguration);

            return JsonSerializer.Deserialize<CognitoConfiguration>(secretString) ?? 
                throw new InvalidOperationException("Failed to find Cognito Configuration");
        }

        /// <summary>
        /// Sign out via Cognito, invalidates Auth, Refresh and Id token.
        /// </summary>
        /// <returns></returns>
        public async Task SignOut(string accessToken)
        {
            var request = new GlobalSignOutRequest
            {
                AccessToken = accessToken
            };

            await _cognitoProvider.GlobalSignOutAsync(request);
        }
    }
}
