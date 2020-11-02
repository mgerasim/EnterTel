using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using EnterTel.Auth;
using EnterTel.Auth.Models;
using EnterTel.DAL;
using EnterTel.Models.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EnterTel.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        /// <summary>
        /// Контекст базы данных
        /// </summary>
        private readonly EnterTelContext _context;

        // TODO: Переименовать в tokenOptions

        /// <summary>
        /// Опции генерации токена
        /// </summary>
        private readonly IOptions<AuthOptions> _authOptions;

        public AuthController(EnterTelContext context, IOptions<AuthOptions> authOptions)
        {
            _context = context;

            _authOptions = authOptions;
        }

        // POST: api/login
        /// <summary>
        /// Авторизация
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Токен авторизации</returns>
        /// <response code="200">Авторизация успешно пройдена</response>
        /// <response code="400">Ошибка при создании</response>
        /// <response code="401">Пользователь для авторизации не найден</response>
        [HttpPost]
        [Route("login")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Login([FromBody] AuthRequest user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("Invalid client request");
                }

                var account = _context.Accounts
                    .Where(x => x.Password == user.Password && x.UserName == user.UserName)
                    .SingleOrDefault();

                if (account is null)
                {
                    return Unauthorized("Пользователь не нейден!");
                }

                var tokenString = GenerateJWT(account);

                return Ok(new AuthResponse {
                    Token = tokenString,
                    EmployeeId = account.EmployeeId,
                    UserName = account.UserName
                });
            }
            catch (Exception exc)
            {
                return BadRequest(exc.Message);
            } 
        }

        private string GenerateJWT(Account account)
        {
            var authParams = _authOptions.Value;

            var securityKey = authParams.GetKey();

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] { new Claim("id", account.Id.ToString()) };

            var token = new JwtSecurityToken(authParams.Issuer,
                authParams.Audience,
                claims,
                expires: DateTime.Now.AddSeconds(authParams.TokenLifetime),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
