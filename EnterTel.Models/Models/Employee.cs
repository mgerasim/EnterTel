using System;
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
        public string PersonnelNumber { get; set; }

        /// <summary>
        /// Имя
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Фамилия
        /// </summary>
        public string Surname { get; set; }

        /// <summary>
        /// Отчество
        /// </summary>
        public string Patronymic { get; set; }

        /// <summary>
        /// Дата рождения
        /// </summary>
        public DateTime BirthDate { get; set; }

        /// <summary>
        /// Электронный адрес
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Рабочий телефон
        /// </summary>
        public string WorkPhone { get; set; }

        /// <summary>
        /// Сотовый (контактный) телефон
        /// </summary>
        public string ContactPhone { get; set; }

        /// <summary>
        /// Фото
        /// </summary>
        public string Photo { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public Employee()
        {
        }
    }
}
