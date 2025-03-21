﻿using Microsoft.AspNetCore.Http;

namespace Business.Helpers
{
    public static class CookieHelper
    {
        public static void SetCookie(HttpContext context, string name, string value, DateTime expiry)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = expiry,
                IsEssential = true
            };

            context.Response.Cookies.Append(name, value, cookieOptions);
        }

        public static void RemoveCookie(HttpContext context, string name)
        {
            context.Response.Cookies.Delete(name, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                IsEssential = true,
            });
        }
    }
}
