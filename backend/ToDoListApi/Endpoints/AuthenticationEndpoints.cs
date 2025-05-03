using Business.Helpers;
using Business.Services.Interfaces;
using Models.Constants;

namespace ToDoListApi.Endpoints
{
    public static class AuthenticationEndpoints
    {
        public static IEndpointRouteBuilder AddAuthenticationEndpoints(this IEndpointRouteBuilder app)
        {
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

            app.MapPost("/signout", async (ICognitoService cognitoService, HttpContext httpContext) =>
            {
                if (!httpContext.Request.Cookies.TryGetValue(CookieTypes.AccessToken, out var accessToken))
                {
                    return Results.Unauthorized();
                }

                await cognitoService.SignOut(accessToken);

                CookieHelper.RemoveCookie(httpContext, CookieTypes.AccessToken);
                CookieHelper.RemoveCookie(httpContext, CookieTypes.RefreshToken);

                return Results.Ok(true);
            });

            app.MapPost("/verify", () =>
            {
                return Results.Ok();
            }).RequireAuthorization();

            return app;
        }
    }
}
