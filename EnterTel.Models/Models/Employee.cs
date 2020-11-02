using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EnterTel.Models.Models.Base;

namespace EnterTel.Models.Models
{
    /// <summary>
    /// Сотрудник
    /// </summary>
    public class Employee : BaseModel
    {
        /// <summary>
        /// Табельный номер
        /// </summary>
        [Required]
        public string PersonnelNumber { get; set; }

        /// <summary>
        /// Имя
        /// </summary>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// Фамилия
        /// </summary>
        [Required]
        public string Surname { get; set; }

        /// <summary>
        /// Отчество
        /// </summary>
        [Required]
        public string Patronymic { get; set; }

        /// <summary>
        /// Дата рождения
        /// </summary>
        [Required]
        public DateTime BirthDate { get; set; }

        /// <summary>
        /// Электронный адрес
        /// </summary>
        [Required]
        public string Email { get; set; }

        /// <summary>
        /// Рабочий телефон
        /// </summary>
        [Required]
        public string WorkPhone { get; set; }

        /// <summary>
        /// Сотовый (контактный) телефон
        /// </summary>
        [Required]
        public string ContactPhone { get; set; }

        /// <summary>
        /// Фото
        /// </summary>
        [Required]
        public string Photo { get; set; }

        /// <summary>
        /// Должность сотрудника
        /// </summary>
        [ForeignKey("PositionId")]
        public Position Position { get; set; }

        public int PositionId { get; set; }

        public Account Account { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public Employee()
        {
        }
    }
}
