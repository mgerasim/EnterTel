using System;
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
        public string FullTitle { get; set; }

        /// <summary>
        /// Короткое наименование
        /// </summary>
        public string ShortTitle { get; set; }

        /// <summary>
        /// Родительское подразделение
        /// </summary>
        public int ParentId { get; set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public Division()
        {
        }
    }
}
