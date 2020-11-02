using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnterTel.DAL;
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
    public class PositionsController : Controller
    {
        /// <summary>
        /// Контекст базы данных
        /// </summary>
        private readonly EnterTelContext _context;

        public PositionsController(EnterTelContext context)
        {
            _context = context;
        }

        // GET: api/positions
        /// <summary>
        /// Возвращает список всех должностей
        /// </summary>
        /// <returns>Список всех должностей</returns>
        /// <response code="200">Успешное выполнение запроса</response>
        /// <response code="400">Ошибка при выполнении запроса</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(List<Position>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Get()
        {
            try
            {
                var positions = await _context.Positions.AsNoTracking().ToListAsync();

                return Ok(positions);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        // GET: api/vacantPositions
        /// <summary>
        /// Возвращает список свободных должностей
        /// </summary>
        /// <returns>Список свободных должностей</returns>
        /// <response code="200">Успешное выполнение запроса</response>
        /// <response code="400">Ошибка при выполнении запроса</response>
        [HttpGet]
        [Authorize]
        [Route("vacant")]
        [ProducesResponseType(typeof(List<Position>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetVacant()
        {
            try
            {
                var employees = await _context
                    .Employees
                    .AsNoTracking()
                    .ToListAsync();

                var positions = await _context
                    .Positions
                    .Where(x => !employees.Select(e => e.PositionId).Contains(x.Id))
                    .Include(x => x.Division)
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(positions);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        // GET api/positions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var employee = await _context.Employees.SingleOrDefaultAsync(x => x.Id == id);

            return Ok(employee);
        }

        // POST api/positions
        /// <summary>
        /// Создает должность
        /// </summary>
        /// <param name="position"></param>
        /// <returns>Возвращает информацию о созданной должности</returns>
        /// <response code="201">Успешное создание должности</response>
        /// <response code="400">Ошибка при создании</response>   
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Post([FromBody] Position position)
        {
            await _context.Positions.AddAsync(position);

            await _context.SaveChangesAsync();

            return Created($"/api/positions/{position.Id}", position);
        }

        // PUT api/positions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Position position)
        {
            _context.Positions.Update(position);

            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE api/positions/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var position = new Position()
            {
                Id = id
            };

            _context.Positions.Remove(position);

            return Delete(id);
        }
    }
}
