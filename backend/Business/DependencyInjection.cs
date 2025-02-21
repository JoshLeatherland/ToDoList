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

            return services;
        }
    }
}
