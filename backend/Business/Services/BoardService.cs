using Business.Services.Interfaces;
using Database.Entities;
using Database.Interfaces;
using Models;

namespace Business.Services
{
    public class BoardService(IUniqueReferenceService uniqueReferenceService, IUnitOfWork unitOfWork) : IBoardService
    {
        private readonly IUniqueReferenceService _uniqueReferenceService = uniqueReferenceService;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<string> Create()
        {
            var newBoardId = _uniqueReferenceService.GetUniqueReference();

            var board = await _unitOfWork.Boards.GetAsync(DbPartitionKeys.Boards, newBoardId);

            if (board == null)
            {
                board = new BoardDto { Id = newBoardId, Name = "ToDo" };
                await _unitOfWork.Boards.AddAsync(DbPartitionKeys.Boards, newBoardId, board);
                return newBoardId;
            }

            throw new InvalidOperationException("Generated Id already existed!");
        }

        public async Task<BoardDto> GetAsync(string boardId)
        {
            var board = await _unitOfWork.Boards.GetAsync(DbPartitionKeys.Boards, boardId);

            return board ?? throw new InvalidOperationException($"No board found with Id {boardId} found");
        }

        public async Task<BoardDto> UpdateAsync(BoardDto boardDto)
        {
            var board = await GetAsync(boardDto.Id);

            await _unitOfWork.Boards.UpdateAsync(DbPartitionKeys.Boards, boardDto.Id, boardDto);
            return boardDto;
        }
    }
}
