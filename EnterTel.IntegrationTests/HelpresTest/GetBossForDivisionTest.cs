using System;
using System.Threading.Tasks;
using EnterTel.DAL;
using EnterTel.Helpers;
using EnterTel.Models.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace EnterTel.IntegrationTests.HelpresTest
{
    public class GetBossForDivisionTest : IDisposable
    {
        private readonly EnterTelContext _context;

        public GetBossForDivisionTest()
        {
            var optionsBuilder = new DbContextOptionsBuilder<EnterTelContext>();

            optionsBuilder.UseInMemoryDatabase("InMemoryDbForTestingGetBossForDivisionTest");

            _context = new EnterTelContext(optionsBuilder.Options);

            _context.Database.EnsureCreated();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetBossForDivisionMain_Success()
        {
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

            try
            {
                // Arrange

                await _context.Employees.AddAsync(employeeMain);

                await _context.Employees.AddAsync(employeeSubMain);

                await _context.SaveChangesAsync();

                // Act

                var generate = new GenerateEmployeeDomain(_context);

                var divisionId = 2; // Руководство Аппарата управления

                var bossId = await generate.GetBossForDivision(divisionId);

                // Assert
                Assert.Equal(employeeMain.Id, bossId);
            }
            finally
            {
                _context.Employees.Remove(employeeMain);

                _context.Employees.Remove(employeeSubMain);

                await _context.SaveChangesAsync();
            }
        }

        [Fact]
        public async Task GetBossForDivisionSubMain_Success()
        {
            var employeeSubMain = new Employee()
            {
                Name = "Главный инженер",
                PositionId = 2
            };

            try
            {
                // Arrange

                await _context.Employees.AddAsync(employeeSubMain);

                await _context.SaveChangesAsync();

                // Act

                var generate = new GenerateEmployeeDomain(_context);

                var divisionId = 2; // Руководство Аппарата управления

                var bossId = await generate.GetBossForDivision(divisionId);

                // Assert
                Assert.Equal(employeeSubMain.Id, bossId);
            }
            finally
            {
                _context.Employees.Remove(employeeSubMain);

                await _context.SaveChangesAsync();
            }
        }
    }
}
