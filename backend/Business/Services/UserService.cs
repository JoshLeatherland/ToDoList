using Business.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Models;
using Models.ViewModels;
using System.Security.Claims;

namespace Business.Services
{
    public class UserService(IHttpContextAccessor httpContextAccessor, IUserBoardService userBoardService) : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IUserBoardService _userBoardService = userBoardService;

        public async Task<UserViewModel> GetLoggedInUser()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null || httpContext.User.Identity == null || !httpContext.User.Identity.IsAuthenticated)
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }

            var claimsPrincipal = httpContext.User;
            var sub = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            var userBoardIds = await GetUsersBoards(sub);

            return new UserViewModel
            {
                UserId = sub,
                UserBoardIds = userBoardIds
            };
        }

        private async Task<List<string>> GetUsersBoards(string userIdentifier)
        {
            var userBoards = await _userBoardService.GetAsync(userIdentifier);
            return userBoards.BoardIds;
        }
    }
}
