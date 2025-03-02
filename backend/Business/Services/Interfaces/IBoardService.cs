using Database.Entities;

namespace Business.Services.Interfaces
{
    public interface IBoardService
    {
        Task<BoardDto> GetAsync();
        Task<BoardDto> UpdateAsync(BoardDto boardDto);
    }
}
