using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using EnterTel.Auth.Models;
using EnterTel.Models.Models;
using Newtonsoft.Json;
using Xunit;

namespace EnterTel.IntegrationTests
{
    public class AuthTest : IClassFixture<WebApplicationFactoryWithInMemory<EnterTel.Startup>>
    {
        private readonly WebApplicationFactoryWithInMemory<EnterTel.Startup> _factory;

        public AuthTest(WebApplicationFactoryWithInMemory<EnterTel.Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Тестирует авторизацию
        /// </summary>
        [Theory]
        [InlineData("/api/auth/login")]
        public async void Login_Success(string url)
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var user = new AuthRequest()
            {
                UserName = "admin",
                Password = "admin"
            };

            var content = new StringContent(JsonConvert.SerializeObject(user),
                Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync(url, content);

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299

            var body = await response.Content.ReadAsStringAsync();

        }
    }
}
