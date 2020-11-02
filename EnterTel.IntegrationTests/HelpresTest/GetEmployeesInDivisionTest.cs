using System;
using System.Threading.Tasks;
using EnterTel.DAL;
using EnterTel.Helpers;
using EnterTel.Models.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace EnterTel.IntegrationTests.HelpresTest
{
    public class GetEmployeesInDivisionTest : IDisposable
    {
        private readonly EnterTelContext _context;

        public GetEmployeesInDivisionTest()
        {
            var optionsBuilder = new DbContextOptionsBuilder<EnterTelContext>();

            optionsBuilder.UseInMemoryDatabase("InMemoryDbForTestingHelpers");

            _context = new EnterTelContext(optionsBuilder.Options);

            _context.Database.EnsureCreated();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetEmployeesInDivision_Success()
        {
            // Arrange

            var employeeMain = new Employee()
            {
                Name = "Генеральный директор",
                PositionId = 1
            };

            var employeeSubMain = new Employee()
            {
                Name = "Главный инженер",
                PositionId = 2
            };

            await _context.Employees.AddAsync(employeeMain);

            await _context.Employees.AddAsync(employeeSubMain);

            await _context.SaveChangesAsync();
            // Act

            var generate = new GenerateEmployeeDomain(_context);

            var divisionId = 2; // Руководство Аппарата управления

            var employees = await generate.GetEmployeesInDivision(divisionId);

            // Assert
            Assert.Equal(2, employees.Count);
        }
    }
}
