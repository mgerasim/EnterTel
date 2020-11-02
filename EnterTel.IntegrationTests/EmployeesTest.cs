using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using EnterTel.Models.Models;
using Newtonsoft.Json;
using Xunit;

namespace EnterTel.IntegrationTests
{
    public class EmployeesTest : IClassFixture<WebApplicationFactoryWithInMemory<EnterTel.Startup>>
    {
        private readonly WebApplicationFactoryWithInMemory<EnterTel.Startup> _factory;

        public EmployeesTest(WebApplicationFactoryWithInMemory<EnterTel.Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Тестирует создание подразделения
        /// </summary>
        [Theory]
        [InlineData("/api/employees")]
        public async void Create_Success(string url)
        {
            // Arrange
            var client = _factory.CreateClient();

            var division = await CreateDivision(client, url);

            // Act
            var employee = new Employee()
            {
                Name = "testtest"
            };

            var content = new StringContent(JsonConvert.SerializeObject(employee),
                Encoding.UTF8,
                "application/json");

            var response = await client.PostAsync(url, content);

            var body = await response.Content.ReadAsStringAsync();

            var value = JsonConvert.DeserializeObject<Employee>(body);

            Assert.Equal(value.Name, employee.Name);
        }

        private async Task<Division> CreateDivision(HttpClient client, string url)
        {
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

            var value = JsonConvert.DeserializeObject<Division>(body);

            return value;
        }
    }
}
