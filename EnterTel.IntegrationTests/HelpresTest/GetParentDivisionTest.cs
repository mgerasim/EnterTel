using System;
using System.Threading.Tasks;
using EnterTel.DAL;
using EnterTel.Helpers;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace EnterTel.IntegrationTests.HelpresTest
{
    public class GetParentDivisionTest : IDisposable
    {
        private readonly EnterTelContext _context;

        public GetParentDivisionTest()
        {
            var optionsBuilder = new DbContextOptionsBuilder<EnterTelContext>();

            optionsBuilder.UseInMemoryDatabase("InMemoryDbForTestingHelpersGetParentDivisionTest");

            _context = new EnterTelContext(optionsBuilder.Options);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetParentDivision_Success()
        {
            // Arrange

            await _context.Database.EnsureCreatedAsync();

            // Act

            var generate = new GenerateEmployeeDomain(_context);

            // Assert
            Assert.False((await generate.GetParentDivision(1)).HasValue);
            Assert.False((await generate.GetParentDivision(2)).HasValue);

            Assert.True((await generate.GetParentDivision(4)).HasValue);
            Assert.Equal(2, (await generate.GetParentDivision(4)).Value);
        }
    }
}
