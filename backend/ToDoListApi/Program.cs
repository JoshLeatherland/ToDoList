using Amazon;
using Business.Middleware;
using Business.Services.Interfaces;
using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
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

var cognitoService = builder.Services.BuildServiceProvider().GetRequiredService<ICognitoService>();
var cognitoConfiguration = await cognitoService.GetCognitoConfigurationAsync();

builder.Services.AddAuthorization();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var region = RegionEndpoint.EUWest2.SystemName;

    options.Authority = $"https://cognito-idp.{region}.amazonaws.com/{cognitoConfiguration.UserPoolId}";
    options.Audience = cognitoConfiguration.ClientId;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = $"https://cognito-idp.{region}.amazonaws.com/{cognitoConfiguration.UserPoolId}",
        ValidAudience = cognitoConfiguration.ClientId,
    };

    options.Events = new JwtBearerEvents
    {
        // we are using SecureCookie so have to obtain the token this way.
        OnMessageReceived = ctx =>
        {
            ctx.Request.Cookies.TryGetValue("accessToken", out var accessToken);
            if (!string.IsNullOrEmpty(accessToken))
            {
                ctx.Token = accessToken;
            }
            else
            {
                ctx.NoResult();
            }

            return Task.CompletedTask;
        }
    };
});

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/", () => "Welcome to ASP.NET Core on AWS Lambda!");

app.MapPost("/boards", async (IBoardService boardService) =>
{
    var boardId = await boardService.Create();
    return Results.Created($"/api/boards/{boardId}", new { boardId });
}).RequireAuthorization();

app.MapGet("/boards/{boardId}", async (string boardId, IBoardService boardService) =>
{
    var board = await boardService.GetAsync(boardId);
    return board is not null ? Results.Ok(board) : Results.NotFound();
}).RequireAuthorization();

app.MapPut("/boards", async (BoardDto boardDto, IBoardService boardService) =>
{
    var updatedBoard = await boardService.UpdateAsync(boardDto);
    return updatedBoard is not null ? Results.Ok(updatedBoard) : Results.NotFound();
}).RequireAuthorization();

app.MapPost("/token", async (string authorizationCode, ICognitoService cognitoService, HttpContext httpContext) =>
{
    var response = await cognitoService.GetToken(authorizationCode);

    if (!string.IsNullOrEmpty(response.AccessToken))
    {
        httpContext.Response.Cookies.Append("accessToken", response.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.Now.AddMinutes(60),
            IsEssential = true
        });

        httpContext.Response.Cookies.Append("refreshToken", response.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.Now.AddDays(5),
            IsEssential = true
        });
    }

    return Results.Ok(true);
});

app.MapPost("/verify", () =>
{
    return Results.Ok();
}).RequireAuthorization();

app.UseAuthentication();
app.UseAuthorization();

app.Run();