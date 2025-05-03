using Amazon;
using Business.Middleware;
using Business.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Models.ViewModels;
using Database;
using Business;
using ToDoListApi.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

builder.Services.Configure<AwsResources>(builder.Configuration.GetSection("AwsResources"));

builder.Services.AddDatabase().AddBusiness();

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

app.MapBoardEndpoints().AddAuthenticationEndpoints();

app.UseAuthentication();
app.UseAuthorization();

app.Run();