using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using Business.Services.Interfaces;

namespace Business.Services
{
    public class AwsSecretService(IAmazonSecretsManager secretsManager) : IAwsSecretService
    {
        private readonly IAmazonSecretsManager _secretsManager = secretsManager;

        public async Task<string> GetSecretASync(string secretName)
        {
            try
            {
                var request = new GetSecretValueRequest
                {
                    SecretId = secretName
                };

                var response = await _secretsManager.GetSecretValueAsync(request);

                return response.SecretString;
            }
            catch (Exception ex)
            {
                throw new Exception($"Unable to find secret value: {secretName}", ex);
            }
        }
    }
}
