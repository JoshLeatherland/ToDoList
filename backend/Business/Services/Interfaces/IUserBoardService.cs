using Database.Entities;

namespace Business.Services.Interfaces
{
    public interface IUserBoardService
    {
        Task<UserBoardDto> GetAsync(string userId);
        Task LinkUser(string userId, string boardId);
    }
}
