using System;
using EnterTel.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace EnterTel.Auth
{
    public static class ModelBuilderExtensions
    {
        public static void DefaultAdmin(this ModelBuilder modelBuilder)
        {
            // Пользователь для авторизации по умолчанию 
            modelBuilder.Entity<Account>().HasData(new Account {
                Id = 1,
                EmployeeId = null,
                UserName = "admin",
                Password = "admin"
            });
        }
    }
}
