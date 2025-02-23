using Business.Middleware;
using Business.Services.Interfaces;
using Database.Entities;
using Models.ViewModels;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

builder.Services.Configure<AwsResources>(builder.Configuration.GetSection("AwsResources"));
Database.DependencyInjection.AddDatabase(builder.Services, builder.Configuration);
Business.DependencyInjection.AddBusiness(builder.Services, builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/", () => "Welcome to ASP.NET Core on AWS Lambda!");

app.MapPost("/api/boards", async (IBoardService boardService) =>
{
    var boardId = await boardService.Create();
    return Results.Created($"/api/boards/{boardId}", new { boardId });
});

app.MapGet("/api/boards/{boardId}", async (string boardId, IBoardService boardService) =>
{
    var board = await boardService.GetAsync(boardId);
    return board is not null ? Results.Ok(board) : Results.NotFound();
});

app.MapPut("/api/boards", async (BoardDto boardDto, IBoardService boardService) =>
{
    var updatedBoard = await boardService.UpdateAsync(boardDto);
    return updatedBoard is not null ? Results.Ok(updatedBoard) : Results.NotFound();
});

app.Run();