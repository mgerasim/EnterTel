using System;
using System.ComponentModel.DataAnnotations;

namespace EnterTel.Auth.Models
{
    /// <summary>
    /// Ответ на успешную авторизацию, содержащий токен
    /// </summary>
    public class AuthResponse
    {
        /// <summary>
        /// Токен
        /// </summary>
        [Required]
        public string Token { get; set; }

        public int? EmployeeId { get; set; }

        public string UserName { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public AuthResponse()
        {
        }
    }
}
