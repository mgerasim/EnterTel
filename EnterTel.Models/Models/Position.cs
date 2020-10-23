using System;
using EnterTel.Models.Models.Base;

namespace EnterTel.Models.Models
{
    /// <summary>
    /// Должность
    /// </summary>
    public class Position : BaseModel
    {
        /// <summary>
        /// Наименование
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Подразделение 
        /// </summary>
        public Division Division { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public Position()
        {
        }
    }
}
