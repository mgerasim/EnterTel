using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using EnterTel.Models.Models.Base;

namespace EnterTel.Models.Models
{
    /// <summary>
    /// Подразделение
    /// </summary>
    public class Division : BaseModel
    {
        /// <summary>
        /// Полное наименование
        /// </summary>
        [Required]
        public string FullTitle { get; set; }

        /// <summary>
        /// Короткое наименование
        /// </summary>
        [Required]
        public string ShortTitle { get; set; }

        /// <summary>
        /// Родительское подразделение
        /// </summary>
        public int? ParentId { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public Division()
        {
        }
    }
}
