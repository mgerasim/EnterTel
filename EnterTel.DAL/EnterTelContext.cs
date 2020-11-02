using System;
using EnterTel.Auth;
using EnterTel.Models;
using EnterTel.Models.Models;
using Microsoft.EntityFrameworkCore;

/*
 * https://stackoverflow.com/questions/38705694/add-migration-with-different-assembly
 MacBook-Pro-Mihail:EnterTel mgerasim$ cd ../EnterTel.DAL/
MacBook-Pro-Mihail:EnterTel.DAL mgerasim$ dotnet ef migrations add InitialCreate --startup-project ../EnterTel
 */
namespace EnterTel.DAL
{
    public class EnterTelContext : DbContext // ApiAuthorizationDbContext
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

        /// <summary>
        /// Учетные записи авторизации по сотрудникам
        /// </summary>
        public DbSet<Account> Accounts { get; set; }

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

            modelBuilder.Entity<Employee>()
                .HasIndex(x => new { x.Name, x.Surname, x.Patronymic, x.BirthDate })
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(x => new { x.Email })
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(x => new { x.ContactPhone })
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(x => new { x.PersonnelNumber })
                .IsUnique();

            modelBuilder.Entity<Account>()
                .HasOne(x => x.Employee)
                .WithOne(x => x.Account)
                .HasForeignKey<Account>(x => x.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Account>()
                .HasIndex(x => x.UserName)
                .IsUnique();

            modelBuilder.Entity<Account>()
                .ToTable(nameof(Account))
                .Property(x => x.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.DefaultAdmin();

            modelBuilder.InsertModels();
        }
    }
}
