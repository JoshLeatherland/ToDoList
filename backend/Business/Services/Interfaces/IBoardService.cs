using Database.Entities;

namespace Business.Services.Interfaces
{
    public interface IBoardService
    {
        Task<string> Create();
        Task<BoardDto> GetAsync(string boardId);
        Task<BoardDto> UpdateAsync(BoardDto boardDto);
    }
}
