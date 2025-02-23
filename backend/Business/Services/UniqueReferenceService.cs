using Business.Services.Interfaces;
using System.Security.Cryptography;

namespace Business.Services
{
    public class UniqueReferenceService : IUniqueReferenceService
    {
        public string GetUniqueReference(int length = 11)
        {
            if (length <= 0 || length > 20)
                throw new ArgumentException("Length must be between 1 and 20 characters.");

            // generates 8 random bytes (64 bits)
            var randomBytes = new byte[8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            // convert it to Base64, remove any url params
            string base64 = Convert.ToBase64String(randomBytes)
                .Replace('+', '-')
                .Replace('/', '_')
                .TrimEnd('=');

            // return the desired length
            return base64.Length > length ? base64[..length] : base64;
        }
    }
}
