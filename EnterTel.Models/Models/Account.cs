using System;
using System.ComponentModel.DataAnnotations;
using EnterTel.Models.Models.Base;

namespace EnterTel.Models.Models
{
    /// <summary>
    /// Учетная запись для авторизации
    /// </summary>
    public class Account : BaseModel
    {
        /// <summary>
        /// Имя пользователя для авторизации
        /// </summary>
        [Required]
        public string UserName { get; set; }

        // TODO: Изменить на сохранение закриптованного пароля

        /// <summary>
        /// Пароль для авторизации
        /// </summary>
        [Required]
        public string Password { get; set; }

        /// <summary>
        /// Сотрудник
        /// </summary>
        public Employee Employee { get; set; }

        // TODO: Добавить рекомендации по внешнему ключу https://docs.microsoft.com/ru-ru/ef/core/modeling/relationships?tabs=fluent-api%2Cfluent-api-simple-key%2Csimple-key#one-to-one

        public int? EmployeeId { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public Account()
        {

        }
    }
}
