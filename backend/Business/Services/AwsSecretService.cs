using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using Business.Services.Interfaces;
using Microsoft.Extensions.Options;
using Models.ViewModels;

namespace Business.Services
{
    public class AwsSecretService(IAmazonSecretsManager secretsManager, IOptions<AwsResources> awsResourcesOptions) : IAwsSecretService
    {
        private readonly IAmazonSecretsManager _secretsManager = secretsManager;
        private readonly AwsResources _awsResources = awsResourcesOptions.Value;

        public async Task<string> GetSecretASync(string secretName)
        {
            try
            {
                var request = new GetSecretValueRequest
                {
                    SecretId = GetSecretName(secretName)
                };

                var response = await _secretsManager.GetSecretValueAsync(request);

                return response.SecretString;
            }
            catch (Exception ex)
            {
                throw new Exception($"Unable to find secret value: {secretName}", ex);
            }
        }

        private string GetSecretName(string secretName)
        {
            if (string.IsNullOrEmpty(_awsResources.StageAlias))
                return secretName;

            return $"{secretName}-{_awsResources.StageAlias}";
        }
    }
}
