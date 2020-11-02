using System;
namespace EnterTel.Models.Models
{
    /// <summary>
    /// Доменная модель сотрудника с информацией о подчинённости
    /// </summary>
    public class EmployeeDomain
    {
        /// <summary>
        /// Модель сотрудника
        /// </summary>
        public Employee Employee { get; private set; }

        /// <summary>
        /// Должность сотрудника
        /// </summary>
        public Position Position { get; private set; }

        /// <summary>
        /// Руководитель сотрудника
        /// </summary>
        public int? ManagerId { get; private set; }

        /// <summary>
        /// Конструктор
        /// </summary>
        public EmployeeDomain(Employee employee, int? managerId, Position position)
        {
            Employee = employee;

            ManagerId = managerId;

            Position = position;
        }
    }
}
