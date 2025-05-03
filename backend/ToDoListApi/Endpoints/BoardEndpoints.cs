using Business.Services.Interfaces;
using Database.Entities;

namespace ToDoListApi.Endpoints
{
    public static class BoardEndpoints
    {
        public static IEndpointRouteBuilder MapBoardEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/boards", async (IBoardService boardService) =>
            {
                var board = await boardService.GetAsync();
                return board is not null ? Results.Ok(board) : Results.NotFound();
            }).RequireAuthorization();

            app.MapPut("/boards", async (BoardDto boardDto, IBoardService boardService) =>
            {
                var updatedBoard = await boardService.UpdateAsync(boardDto);
                return updatedBoard is not null ? Results.Ok(updatedBoard) : Results.NotFound();
            }).RequireAuthorization();

            return app;
        }
    }
}
