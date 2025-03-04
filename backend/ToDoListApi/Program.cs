using Amazon;
using Business.Helpers;
using Business.Middleware;
using Business.Services.Interfaces;
using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Models.Constants;
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

builder.Services.AddHttpContextAccessor();

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

app.MapPost("/token", async (string authorizationCode, ICognitoService cognitoService, HttpContext httpContext) =>
{
    var response = await cognitoService.GetToken(authorizationCode);

    if (!string.IsNullOrEmpty(response.AccessToken))
    {
        CookieHelper.SetCookie(httpContext, CookieTypes.AccessToken, response.AccessToken, DateTime.Now.AddMinutes(15));
        CookieHelper.SetCookie(httpContext, CookieTypes.RefreshToken, response.RefreshToken, DateTime.Now.AddDays(7));

        return Results.Ok(true);
    }

    return Results.Unauthorized();
});

app.MapPost("/refresh", async (ICognitoService cognitoService, HttpContext httpContext) =>
{
    if (!httpContext.Request.Cookies.TryGetValue(CookieTypes.RefreshToken, out var refreshToken))
    {
        return Results.Unauthorized();
    }

    var response = await cognitoService.RefreshToken(refreshToken);

    if (!string.IsNullOrEmpty(response.AccessToken))
    {
        CookieHelper.SetCookie(httpContext, CookieTypes.AccessToken, response.AccessToken, DateTime.Now.AddMinutes(15));

        return Results.Ok(true);
    }

    return Results.Unauthorized();
});

app.MapPost("/verify", () =>
{
    return Results.Ok();
}).RequireAuthorization();

app.UseAuthentication();
app.UseAuthorization();

app.Run();