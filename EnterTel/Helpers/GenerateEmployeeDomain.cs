using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnterTel.DAL;
using EnterTel.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace EnterTel.Helpers
{
    /// <summary>
    /// Формирует доменную модель сотрудника с информацией о подчиненности
    /// </summary>
    public class GenerateEmployeeDomain
    {
        private EnterTelContext _context;

        public GenerateEmployeeDomain(EnterTelContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Формирует список доменных сотрудников с информацией о подчинении
        /// </summary>
        /// <param name="ParentDivisionId"></param>
        /// <returns></returns>
        public async Task<List<EmployeeDomain>> Generate()
        {
            var employeesDomain = new List<EmployeeDomain>();

            var employees = await _context.Employees
                .AsNoTracking()
                .ToListAsync();

            foreach (var employee in employees)
            {
                int? managerId = await GetManagerForEmployee(employee);

                var position = await _context
                    .Positions
                    .FindAsync(employee.PositionId);

                var employeeDomain = new EmployeeDomain(employee, managerId, position);

                employeesDomain.Add(employeeDomain);
            }

            return employeesDomain;
        }

        // <summary>
        /// Формирует список доменных сотрудников с информацией о подчинении
        /// </summary>
        /// <param name="ParentDivisionId"></param>
        /// <returns></returns>
        public async Task<List<EmployeeDomain>> GenerateByDivision(int divisionId)
        {
            var division = await GetDivisionAsync(divisionId);

            if (!division.ParentId.HasValue)
            {
                return await Generate();
            }

            var employees = await GetEmployeesInDivision(divisionId);

            var employeesDomain = new List<EmployeeDomain>();

            foreach (var employee in employees)
            {
                int bossId = await GetBossForDivision(divisionId);
                int? managerId = null;
                if (employee.Id != bossId)
                {
                    managerId = bossId;
                }

                var position = await _context.Positions.FindAsync(employee.PositionId);
                employeesDomain.Add(
                    new EmployeeDomain(employee, managerId, position)
                    );
            }

            return employeesDomain;
        }

        // <summary>
        /// Формирует список доменных сотрудников с информацией о подчинении
        /// </summary>
        /// <returns></returns>
        public async Task<List<EmployeeDomain>> GenerateBySearch(string search)
        {
            var positions = await _context
                .Positions
                .Where(position => EF.Functions.Like(position.Title, $"%{search}%"))
                .AsNoTracking()
                .ToListAsync();

            var employees = await _context
                .Employees
                .Where(
                    employee => EF.Functions.Like(employee.Name, $"%{search}%")
                        || EF.Functions.Like(employee.Surname, $"%{search}%")
                        || EF.Functions.Like(employee.Patronymic, $"%{search}%")
                        || EF.Functions.Like(employee.PersonnelNumber, $"%{search}%")
                        || EF.Functions.Like(employee.Email, $"%{search}%")
                        || EF.Functions.Like(employee.ContactPhone, $"%{search}%")
                        || positions.Select(x => x.Id).Contains(employee.PositionId)
                 )
                .AsNoTracking()
                .ToListAsync();

            var employeesDomain = new List<EmployeeDomain>();

            foreach (var employee in employees)
            {
                int? managerId = null;
             
                var position = await _context.Positions.FindAsync(employee.PositionId);
                employeesDomain.Add(
                    new EmployeeDomain(employee, managerId, position)
                    );
            }

            return employeesDomain;
        }

        /// <summary>
        /// Возвращает список сотрудников в подразделении
        /// </summary>
        /// <param name="divisionId"></param>
        public async Task<List<Employee>> GetEmployeesInDivision(int divisionId)
        {
            var division = await GetDivisionAsync(divisionId);

            var positions = await _context
                .Positions
                .Where(x => x.DivisionId == division.Id)
                .AsNoTracking()
                .ToListAsync();

            return await _context
                .Employees
                .Where(x => positions.Select(p => p.Id).Contains(x.PositionId))
                .OrderBy(x => x.Id)
                .AsNoTracking()
                .ToListAsync();
        }

        private async Task<Division> GetDivisionAsync(int divisionId)
        {
            var division = await _context
                .Divisions
                .FindAsync(divisionId);

            if (division is null)
            {
                throw new NullReferenceException(nameof(division));
            }

            return division;
        } 

        /// <summary>
        /// Возвращает идентификатор начальника в подразделении
        /// </summary>
        /// <param name="divisionId"></param>
        public async Task<int> GetBossForDivision(int divisionId)
        {
            var emploees = await GetEmployeesInDivision(divisionId);

            if (emploees.Count == 0)
            {
                throw new Exception(nameof(emploees));
            }

            return emploees[0].Id;
        }

        /// <summary>
        /// Возвращает руководителя для сотрудника
        /// </summary>
        /// <param name="employee"></param>
        /// <returns></returns>
        public async Task<int?> GetManagerForEmployee(Employee employee)
        {
            var position = await _context.Positions
                .FindAsync(employee.PositionId);

            if (position is null)
            {
                throw new NullReferenceException(nameof(position));
            }

            var division = await GetDivisionAsync(position.DivisionId);

            var bossId = await GetBossForDivision(division.Id);

            if (employee.Id != bossId)
            {
                return bossId;
            }

            var parent = await GetParentDivision(division.Id);

            if (!parent.HasValue)
            {
                return null;
            }

            return await GetBossForDivision(parent.Value);
        }

        /// <summary>
        /// Возвращает родительское подразделение, имеющее должности
        /// </summary>
        /// <param name="divisionId"></param>
        public async Task<int?> GetParentDivision(int divisionId)
        {
            var division = await GetDivisionAsync(divisionId);

            if (!division.ParentId.HasValue)
            {
                return null;
            }

            var parent = await GetDivisionAsync(division.ParentId.Value);

            if (await DivisionHasPosiotions(parent.Id))
            {
                return parent.Id;
            }

            if (parent.ParentId.HasValue)
            {
                return await GetParentDivision(parent.Id);
            }

            return null;
        }

        /// <summary>
        /// Определяет - имеет ли подразделение должности
        /// </summary>
        /// <param name="divisionId"></param>
        /// <returns></returns>
        private async Task<bool> DivisionHasPosiotions(int divisionId)
        {
            int count =  await _context
                .Positions
                .Where(x => x.DivisionId == divisionId)
                .AsNoTracking()
                .CountAsync();

            return count > 0;
        }
    }
}
