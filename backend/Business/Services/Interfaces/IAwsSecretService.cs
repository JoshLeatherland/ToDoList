namespace Business.Services.Interfaces
{
    public interface IAwsSecretService
    {
        Task<string> GetSecretASync(string secretName);
    }
}
