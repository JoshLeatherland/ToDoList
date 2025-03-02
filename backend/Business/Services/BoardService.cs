using Business.Services.Interfaces;
using Database.Entities;
using Database.Interfaces;
using Models;
using Models.ViewModels;

namespace Business.Services
{
    public class BoardService(IUniqueReferenceService uniqueReferenceService, 
                              IUnitOfWork unitOfWork,
                              IUserService userService,
                              IUserBoardService userBoardService) : IBoardService
    {
        private readonly IUniqueReferenceService _uniqueReferenceService = uniqueReferenceService;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IUserService _userService = userService;
        private readonly IUserBoardService _userBoardService = userBoardService;

        public async Task<BoardDto> GetAsync()
        {
            var currentUser = await _userService.GetLoggedInUser();

            var boardId = currentUser.UserBoardIds.FirstOrDefault();

            if (boardId == null)
            {
                return await Create(currentUser);
            } 
            else
            {
                return await Get(boardId);
            }
        }

        public async Task<BoardDto> UpdateAsync(BoardDto boardDto)
        {
            var currentUser = await _userService.GetLoggedInUser();
            var boardId = currentUser.UserBoardIds.FirstOrDefault();

            if (boardId != null)
            {
                await _unitOfWork.Boards.UpdateAsync(DbPartitionKeys.Boards, boardId, boardDto);
                return boardDto;
            }

            throw new InvalidOperationException("Unable to determine users board");
        }

        #region Private

        private async Task<BoardDto> Create(UserViewModel user)
        {
            var newBoardId = _uniqueReferenceService.GetUniqueReference();

            var board = await _unitOfWork.Boards.GetAsync(DbPartitionKeys.Boards, newBoardId);

            if (board == null)
            {
                board = new BoardDto { Id = newBoardId, Name = "ToDo" };
                await _unitOfWork.Boards.AddAsync(DbPartitionKeys.Boards, newBoardId, board);

                await _userBoardService.LinkUser(user.UserId, newBoardId);

                return board;
            }

            throw new InvalidOperationException("Generated Id already existed!");
        }

        private async Task<BoardDto> Get(string boardId)
        {
            var board = await _unitOfWork.Boards.GetAsync(DbPartitionKeys.Boards, boardId);
            return board ?? throw new InvalidOperationException($"No board found with Id {boardId} found");
        }

        #endregion
    }
}
