using Business.Services.Interfaces;
using Database.Entities;
using Database.Interfaces;
using Models;

namespace Business.Services
{
    public class UserBoardService(IUnitOfWork unitOfWork) : IUserBoardService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<UserBoardDto> GetAsync(string userId)
        {
            var userBoard = await _unitOfWork.UserBoards.GetAsync(DbPartitionKeys.UserBoards, userId);

            return userBoard ?? await CreateAsync(userId);
        }

        public async Task LinkUser(string userId, string boardId)
        {
            var userBoards = await GetAsync(userId);

            userBoards.BoardIds.Add(boardId);

            await _unitOfWork.UserBoards.UpdateAsync(DbPartitionKeys.UserBoards, userId, userBoards);
        }

        #region Private

        /// <summary>
        /// Creates a UserBoard profile if one does not already exist.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        private async Task<UserBoardDto> CreateAsync(string userId)
        {
            var userBoard = new UserBoardDto
            {
                UserId = userId,
                BoardIds = []
            };

            await _unitOfWork.UserBoards.AddAsync(DbPartitionKeys.UserBoards, userId, userBoard);

            return userBoard;
        }

        #endregion
    }
}
