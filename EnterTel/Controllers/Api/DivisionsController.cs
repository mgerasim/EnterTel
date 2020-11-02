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
    public class DivisionsController : Controller
    {
        /// <summary>
        /// Контекст базы данных
        /// </summary>
        private readonly EnterTelContext _context;

        public DivisionsController(EnterTelContext context)
        {
            _context = context;
        }

        // GET: api/divisions
        /// <summary>
        /// Возвращает список подразделений предприятия
        /// </summary>
        /// <returns>Список подразделений</returns>
        /// <response code="200">Успешное выполнение запроса</response>
        /// <response code="400">Ошибка при выполнении запроса</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(List<Division>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Get()
        {
            try
            {
                var divisions = await _context.Divisions.AsNoTracking().ToListAsync();

                return Ok(divisions);
            }
            catch(Exception exc)
            {
                return BadRequest(exc.Message);
            }
        }

        // GET api/divisions/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var division = await _context.Divisions.SingleOrDefaultAsync(x => x.Id == id);

            return Ok(division);
        }

        // POST api/divisions
        /// <summary>
        /// Создает подразделение
        /// </summary>
        /// <param name="division"></param>
        /// <returns>Возвращает созданное подразделение</returns>
        /// <response code="201">Успешное создание подразделения</response>
        /// <response code="400">Ошибка при создании</response>   
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Post([FromBody] Division division)
        {
            // TODO: Добавить проверку на пустую модель

            await _context.Divisions.AddAsync(division);

            await _context.SaveChangesAsync();

            return Created($"/divisions/{division.Id}", division);
        }

        // PUT api/divisions/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Put(int id, [FromBody] Division division)
        {
            _context.Divisions.Update(division);

            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE api/divisions/5
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            var division = new Division()
            {
                Id = id
            };

            _context.Divisions.Remove(division);

            return Delete(id);
        }
    }
}
