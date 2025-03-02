namespace Business.Services.Interfaces
{
    public interface IUniqueReferenceService
    {
        string GetUniqueReference(int length = 11);
    }
}
