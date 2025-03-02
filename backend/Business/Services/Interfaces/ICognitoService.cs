using Models.ViewModels;

namespace Business.Services.Interfaces
{
    public interface ICognitoService
    {
        Task<TokenResponse> GetToken(string authorizationCode);
        Task<CognitoConfiguration> GetCognitoConfigurationAsync();
    }
}
