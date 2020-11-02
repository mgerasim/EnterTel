using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using EnterTel.Auth.Models;
using EnterTel.Models.Models;
using Newtonsoft.Json;
using Xunit;

namespace EnterTel.IntegrationTests
{
    public class DivisionsTest : IClassFixture<WebApplicationFactoryWithInMemory<EnterTel.Startup>>
    {
        private readonly WebApplicationFactoryWithInMemory<EnterTel.Startup> _factory;

        public DivisionsTest(WebApplicationFactoryWithInMemory<EnterTel.Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Тестирует создание подразделения
        /// </summary>
        [Theory]
        [InlineData("/api/divisions")]
        public async void Create_Success(string url)
        {
            // Arrange
            var client = _factory.CreateClient();
            var token = await GetToken(client);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var division = new Division()
            {
                FullTitle = "testtest",
                ShortTitle = "test"
            };

            var content = new StringContent(JsonConvert.SerializeObject(division),
                Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync(url, content);

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299

            var body = await response.Content.ReadAsStringAsync();

            var value = JsonConvert.DeserializeObject<Division>(body);

            Assert.Equal(value.FullTitle, division.FullTitle);
        }

        /// <summary>
        /// Тестирует обновление подразделения
        /// </summary>
        [Theory]
        [InlineData("/api/divisions")]
        public async void Update_Success(string url)
        {
            // Arrange
            var client = _factory.CreateClient();
            var token = await GetToken(client);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var division = new Division()
            {
                FullTitle = "testtest",
                ShortTitle = "test"
            };

            var content = new StringContent(JsonConvert.SerializeObject(division),
                Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync(url, content);

            response.EnsureSuccessStatusCode(); // Status Code 200-299

            var body = await response.Content.ReadAsStringAsync();

            division = JsonConvert.DeserializeObject<Division>(body);

            division.FullTitle = "testtest2";

            content = new StringContent(JsonConvert.SerializeObject(division),
                Encoding.UTF8,
                "application/json");

            await client.PutAsync($"{url}/{division.Id}", content);

            // Assert
            content = new StringContent(JsonConvert.SerializeObject(division.Id),
                Encoding.UTF8,
                "application/json");

            response = await client.GetAsync($"{url}/{division.Id}");

            body = await response.Content.ReadAsStringAsync();

            var value = JsonConvert.DeserializeObject<Division>(body);

            Assert.Equal(value.FullTitle, division.FullTitle);
        }

        private async Task<string> GetToken(HttpClient client)
        {
            var user = new AuthRequest()
            {
                UserName = "admin",
                Password = "admin"
            };

            var content = new StringContent(JsonConvert.SerializeObject(user),
                Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync("/api/auth/login", content);

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299

            var body = await response.Content.ReadAsStringAsync();

            var token = JsonConvert.DeserializeObject<AuthResponse>(body);

            return token.Token;
        }
    }
}
