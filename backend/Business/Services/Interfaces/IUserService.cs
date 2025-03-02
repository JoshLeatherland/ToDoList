using Models.ViewModels;

namespace Business.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserViewModel> GetLoggedInUser();
    }
}
