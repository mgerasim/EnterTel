using System;
using EnterTel.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace EnterTel.DAL
{
    public class EnterTelContext : DbContext
    {
        /// <summary>
        /// Список подразделений
        /// </summary>
        public DbSet<Division> Divisions { get; set; }

        /// <summary>
        /// Список должностей
        /// </summary>
        public DbSet<Position> Positions { get; set; }

        /// <summary>
        /// Список сотрудников
        /// </summary>
        public DbSet<Employee> Employees { get; set; }

        public EnterTelContext(DbContextOptions<EnterTelContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Division>()
                .ToTable(nameof(Divisions))
                .Property(x => x.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Position>()
                .ToTable(nameof(Position))
                .Property(x => x.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Employee>()
                .ToTable(nameof(Employee))
                .Property(x => x.Id)
                .ValueGeneratedOnAdd();
        }
    }
}
