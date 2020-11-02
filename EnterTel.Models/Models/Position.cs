using System;
using System.ComponentModel.DataAnnotations;
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
        [Required]
        public string Title { get; set; }

        /// <summary>
        /// Подразделение 
        /// </summary>
        [Required]
        public int DivisionId { get; set; }

        public Division Division { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public Position()
        {
        }
    }
}
