using System;
using System.ComponentModel.DataAnnotations;

namespace EnterTel.Auth.Models
{
    /// <summary>
    /// Запрос на авторизацию
    /// </summary>
    public class AuthRequest
    {
        /// <summary>
        /// Имя учетной записи
        /// </summary>
        [Required]
        public string UserName { get; set; }

        /// <summary>
        /// Пароль учетной записи
        /// </summary>
        [Required]
        public string Password { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public AuthRequest()
        {
        }
    }
}
