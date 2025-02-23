using Database.Repositories.Interfaces;

namespace Database.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IBoardRepository Boards {  get; }
    }
}
