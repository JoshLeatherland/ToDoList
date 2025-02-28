using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.SecretsManager;
using Business.Services;
using Business.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Business
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBusiness(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IUniqueReferenceService, UniqueReferenceService>();
            services.AddSingleton<IBoardService, BoardService>();
            services.AddSingleton<IAmazonSecretsManager>(sp => new AmazonSecretsManagerClient(RegionEndpoint.EUWest2));
            services.AddSingleton<IAwsSecretService, AwsSecretService>();
            services.AddSingleton<ICognitoService, CognitoService>();

            return services;
        }
    }
}
