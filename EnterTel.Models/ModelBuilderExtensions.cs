using System;
using EnterTel.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace EnterTel.Models
{
    public static class ModelBuilderExtensions
    {
        public static void InsertModels(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 21,
                FullTitle = "Все сотрудники",
                ShortTitle = "Все",
                ParentId = null
            });

            #region 1. Аппарат управления (Id = 1)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 1,
                FullTitle = "Аппарат управления",
                ShortTitle = "АУ",
                ParentId = 21
            });

            #region 1.1. Руководство (Id = 2)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 2,
                FullTitle = "Руководство",
                ShortTitle = "Р",
                ParentId = 1
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 1,
                Title = "Генеральный директор",
                DivisionId = 2
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 2,
                Title = "Главный инженер",
                DivisionId = 2
            });

            #endregion

            #region 1.2. Службы генерального директора (Id = 3)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 3,
                FullTitle = "Службы генерального директора",
                ShortTitle = "СГД",
                ParentId = 2
            });

            #region 1.2.1. Служба общественных коммуникаций (Id = 4)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 4,
                FullTitle = "Служба общественных коммуникаций",
                ShortTitle = "СОК",
                ParentId = 3
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 4,
                Title = "Начальник службы",
                DivisionId = 4
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 5,
                Title = "Ведущий специалист",
                DivisionId = 4
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 6,
                Title = "Специалист 1 категории",
                DivisionId = 4
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 7,
                Title = "Специалист 2 категории",
                DivisionId = 4
            });

            #endregion

            #region 1.2.2. Юридический отдел (Id = 5)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 5,
                FullTitle = "Юридический отдел",
                ShortTitle = "ЮО",
                ParentId = 3
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 8,
                Title = "Начальник отдела",
                DivisionId = 5
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 9,
                Title = "Заместитель начальника отдела",
                DivisionId = 5
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 10,
                Title = "Ведущий юристконсульт",
                DivisionId = 5
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 11,
                Title = "Юристконсульт",
                DivisionId = 5
            });

            #endregion

            #endregion

            #region 1.3. Службы главного инженера (Id = 6)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 6,
                FullTitle = "Службы главного инженера",
                ShortTitle = "СГИ",
                ParentId = 1
            });

            #region 1.3.1. Службы заместителя главного инженера по АСУТП (Id = 7)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 7,
                FullTitle = "Службы заместителя главного инженера по АСУТП",
                ShortTitle = "СЗамГИ АСУТП",
                ParentId = 6
            });

            #region 1.3.1.1. Отдел АСУТП (Id = 8)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 8,
                FullTitle = "Отдел АСУТП",
                ShortTitle = "ОтАСУТП",
                ParentId = 7
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 12,
                Title = "Начальник отдела",
                DivisionId = 8
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 13,
                Title = "Заместитель начальника отдела",
                DivisionId = 8
            });

            #region 1.3.1.1.3. Сектор АСУ (Id = 9)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 9,
                FullTitle = "Сектор АСУ",
                ShortTitle = "СекАСУ",
                ParentId = 8
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 14,
                Title = "Начальник сектора",
                DivisionId = 9
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 15,
                Title = "Инженер программист",
                DivisionId = 9
            });

            #endregion

            #region 1.3.1.1.4. Сектор СДКУ (Id = 10)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 10,
                FullTitle = "Сектор СДКУ",
                ShortTitle = "СекСДКУ",
                ParentId = 8
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 16,
                Title = "Начальник сектора",
                DivisionId = 10
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 17,
                Title = "Ведущий инженер-программист",
                DivisionId = 10
            });

            #endregion

            #endregion

            #region 1.3.1.2. Отдел ИТ (Id = 11)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 11,
                FullTitle = "Отдел ИТ",
                ShortTitle = "ОтИТ",
                ParentId = 7
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 18,
                Title = "Начальник отдела",
                DivisionId = 11
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 19,
                Title = "Заместитель начальника отдела",
                DivisionId = 11
            });

            #region 1.3.1.2.3. Сектор финансовых ИС (Id = 12)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 12,
                FullTitle = "Сектор финансовых ИС",
                ShortTitle = "СекФИС",
                ParentId = 11
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 20,
                Title = "Начальник сектора",
                DivisionId = 12
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 21,
                Title = "Ведущий инженер-программист",
                DivisionId = 12
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 22,
                Title = "Инженер-программист 1 категории",
                DivisionId = 12
            });

            #endregion

            #region 1.3.1.2.4. Сектор производственных ИС (Id = 13)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 13,
                FullTitle = "Сектор производственных ИС",
                ShortTitle = "СекПИС",
                ParentId = 11
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 23,
                Title = "Начальник сектора",
                DivisionId = 13
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 24,
                Title = "Ведущий инженер-программист",
                DivisionId = 13
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 25,
                Title = "Инженер-программист 1 категории",
                DivisionId = 13
            });

            #endregion

            #endregion

            #endregion

            #endregion

            #endregion

            #region 2. Районное управление 1 (филиал) (Id = 14)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 14,
                FullTitle = "Районное управление 1 (филиал)",
                ShortTitle = "РУ1ф",
                ParentId = 21
            });

            #region 2.1. Руководство (Id = 15)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 15,
                FullTitle = "Руководство",
                ShortTitle = "Р",
                ParentId = 14
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 26,
                Title = "Начальник управления",
                DivisionId = 15
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 27,
                Title = "Главный инженер",
                DivisionId = 15
            });

            #region 2.2. Службы начальника управления (Id = 16)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 16,
                FullTitle = "Службы начальника управления",
                ShortTitle = "СНУ",
                ParentId = 14
            });

            #region 2.2.1. Юридическая служба (Id = 17)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 17,
                FullTitle = "Юридическая служба",
                ShortTitle = "ЮС",
                ParentId = 16
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 28,
                Title = "Юристконсульт",
                DivisionId = 17
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 29,
                Title = "Юристконсульт",
                DivisionId = 17
            });

            #endregion

            #endregion

            #region 2.3. Службы главного инженера (Id = 18)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 18,
                FullTitle = "Службы главного инженера",
                ShortTitle = "СГИ",
                ParentId = 14
            });

            #region 2.3.1. Отдел АСУТП (Id = 19)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 19,
                FullTitle = "Отдел АСУТП",
                ShortTitle = "ОтАСУТП",
                ParentId = 18
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 30,
                Title = "Начальник отдела",
                DivisionId = 19
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 31,
                Title = "Ведущий инженер-программист",
                DivisionId = 19
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 32,
                Title = "Инженер-программист",
                DivisionId = 19
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 33,
                Title = "Техник",
                DivisionId = 19
            });

            #endregion

            #region 2.3.2. Отдел ИТ (Id = 20)

            modelBuilder.Entity<Division>().HasData(new Division
            {
                Id = 20,
                FullTitle = "Отдел ИТ",
                ShortTitle = "ОтИТ",
                ParentId = 18
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 34,
                Title = "Начальник отдела",
                DivisionId = 20
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 35,
                Title = "Ведущий инженер-программист",
                DivisionId = 20
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 36,
                Title = "Инженер-программист",
                DivisionId = 20
            });

            modelBuilder.Entity<Position>().HasData(new Position
            {
                Id = 37,
                Title = "Техник",
                DivisionId = 20
            });

            #endregion

            #endregion

            #endregion

            #endregion

        }
    }
}
