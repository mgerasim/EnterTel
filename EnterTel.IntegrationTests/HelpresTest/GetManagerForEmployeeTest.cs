using System;
using System.Threading.Tasks;
using EnterTel.DAL;
using EnterTel.Helpers;
using EnterTel.Models.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace EnterTel.IntegrationTests.HelpresTest
{
    public class GetManagerForEmployeeTest : IDisposable
    {
        private readonly EnterTelContext _context;

        public GetManagerForEmployeeTest()
        {
            var optionsBuilder = new DbContextOptionsBuilder<EnterTelContext>();

            optionsBuilder.UseInMemoryDatabase("InMemoryDbForTestingHelpersGetManagerForEmployeeTest");

            _context = new EnterTelContext(optionsBuilder.Options);

            _context.Database.EnsureCreated();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetManagerForEmployee_Success()
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

                var bossId = await generate.GetManagerForEmployee(employeeSubMain);

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
        public async Task GetManagerForEmployeeMainService_Success()
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

            var employeeMainService = new Employee()
            {
                Name = "Начальник службы",
                PositionId = 4
            };

            try
            {
                // Arrange

                await _context.Employees.AddAsync(employeeMain);

                await _context.Employees.AddAsync(employeeSubMain);

                await _context.Employees.AddAsync(employeeMainService);

                await _context.SaveChangesAsync();

                // Act

                var generate = new GenerateEmployeeDomain(_context);

                var bossId = await generate.GetManagerForEmployee(employeeMainService);

                // Assert
                Assert.Equal(employeeMain.Id, bossId);
            }
            finally
            {
                _context.Employees.Remove(employeeMain);

                _context.Employees.Remove(employeeSubMain);

                _context.Employees.Remove(employeeMainService);

                await _context.SaveChangesAsync();
            }
        }
    }
}
