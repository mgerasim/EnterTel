using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnterTel.DAL;
using EnterTel.Helpers;
using EnterTel.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EnterTel.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class EmployeesController : Controller
    {
        /// <summary>
        /// Контекст базы данных
        /// </summary>
        private readonly EnterTelContext _context;

        public EmployeesController(EnterTelContext context)
        {
            _context = context;
        }

        // GET: api/employees
        /// <summary>
        /// Возвращает список сотрудников
        /// </summary>
        /// <returns>Список сотрудников</returns>
        /// <response code="200">Успешное выполнение запроса</response>
        /// <response code="400">Ошибка при выполнении запроса</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(List<EmployeeDomain>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Get()
        {
            try
            {
                var generate = new GenerateEmployeeDomain(_context);

                var employeesDomain = await generate.Generate();

                return Ok(employeesDomain);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }


        // GET: api/employees/division
        /// <summary>
        /// Возвращает список сотрудников по подразделению
        /// </summary>
        /// <returns>Список сотрудников по подразделению</returns>
        /// <response code="200">Успешное выполнение запроса</response>
        /// <response code="400">Ошибка при выполнении запроса</response>
        [HttpGet]
        [Authorize]
        [Route("division")]
        [ProducesResponseType(typeof(List<EmployeeDomain>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByDivision([FromQuery] int divisionId)
        {
            try
            {
                var generate = new GenerateEmployeeDomain(_context);

                var employeesDomain = await generate.GenerateByDivision(divisionId);

                return Ok(employeesDomain);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        // GET: api/employees/search
        /// <summary>
        /// Возвращает список сотрудников по строке поиска
        /// </summary>
        /// <returns>Список сотрудников по строке поиска</returns>
        /// <response code="200">Успешное выполнение запроса</response>
        /// <response code="400">Ошибка при выполнении запроса</response>
        [HttpGet]
        [Authorize]
        [Route("search")]
        [ProducesResponseType(typeof(List<EmployeeDomain>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetBySearch([FromQuery] string search)
        {
            try
            {
                var generate = new GenerateEmployeeDomain(_context);

                var employeesDomain = await generate.GenerateBySearch(search);

                return Ok(employeesDomain);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        // GET api/employees/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Employee), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get(int id)
        {
            var employee = await _context
                .Employees
                .SingleOrDefaultAsync(x => x.Id == id);

            return Ok(employee);
        }

        // POST api/employees
        /// <summary>
        /// Создает сотрудника
        /// </summary>
        /// <param name="employee"></param>
        /// <returns>Возвращает информацию о созданном сотруднике</returns>
        /// <response code="201">Успешное создание сотрудника</response>
        /// <response code="400">Ошибка при создании</response>   
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Post([FromBody] Employee employee)
        {
            try
            {
                var exist = await _context
                .Employees
                .SingleOrDefaultAsync(x => x.PersonnelNumber == employee.PersonnelNumber);
                if (exist != null)
                {
                    return BadRequest($"Сотрудник с табельным номером {employee.PersonnelNumber} уже существует");
                }

                await _context.Employees.AddAsync(employee);

                await _context.SaveChangesAsync();

                return Created($"/api/employees/{employee.Id}", employee);
            }
            catch(Exception exc)
            {
                if (exc.InnerException != null)
                {
                    return BadRequest(exc.InnerException.Message);
                }
                else
                {
                    return BadRequest(exc.Message);
                }
                
            }
        }

        // PUT api/employees/5
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Put(int id, [FromBody] Employee employee)
        {
            try
            {
                var exist = await _context
                .Employees
                .SingleOrDefaultAsync(x => x.PersonnelNumber == employee.PersonnelNumber);
                if (exist != null)
                {
                    return BadRequest($"Сотрудник с табельным номером {employee.PersonnelNumber} уже существует");
                }

                _context.Employees.Update(employee);

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch(Exception exc)
            {
                if (exc.InnerException != null)
                {
                    return BadRequest(exc.InnerException.Message);
                }
                else
                {
                    return BadRequest(exc.Message);
                }
            }
        }

        [HttpGet]
        [Route("Account")]
        [Authorize]
        [ProducesResponseType(typeof(Account), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAccount(int id)
        {
            try
            {
                var account = await _context.Accounts
                    .SingleOrDefaultAsync(x => x.EmployeeId == id);

                return Ok(account);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        [HttpPost]
        [Route("Account")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> SaveAccount([FromBody] Account account)
        {
            try
            {
                var exist = await _context.Accounts
                    .SingleOrDefaultAsync(x => x.EmployeeId != account.EmployeeId && x.UserName == account.UserName);

                if (exist != null)
                {
                    return BadRequest($"Учетная запись '{account.UserName}' уже существует!");
                }

                var curr = await _context.Accounts
                    .SingleOrDefaultAsync(x => x.EmployeeId == account.EmployeeId);

                if (curr is null)
                {
                    await _context.Accounts.AddAsync(account);
                }
                else
                {
                    curr.UserName = account.UserName;

                    curr.Password = account.Password;

                    _context.Accounts.Update(curr);
                }

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        // DELETE api/employees/5
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            try
            {
                var employee = _context.Employees.Find(id);

                if (employee is null)
                {
                    return Delete(id);
                }

                _context.Employees.Remove(employee);

                _context.SaveChanges();

                return Delete(id);
            }
            catch(Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }
    }
}
