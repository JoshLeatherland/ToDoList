namespace Database.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetAsync(string partitionKey, string sortKey);
        Task AddAsync(string partitionKey, string sortKey, T entity);
        Task UpdateAsync(string partitionKey, string sortKey, T entity);
        Task DeleteAsync(string partitionKey, string sortKey);
    }
}
