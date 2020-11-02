using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EnterTel.DAL.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Divisions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FullTitle = table.Column<string>(nullable: false),
                    ShortTitle = table.Column<string>(nullable: false),
                    ParentId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Divisions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Position",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(nullable: false),
                    DivisionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Position", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Position_Divisions_DivisionId",
                        column: x => x.DivisionId,
                        principalTable: "Divisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PersonnelNumber = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Surname = table.Column<string>(nullable: false),
                    Patronymic = table.Column<string>(nullable: false),
                    BirthDate = table.Column<DateTime>(nullable: false),
                    Email = table.Column<string>(nullable: false),
                    WorkPhone = table.Column<string>(nullable: false),
                    ContactPhone = table.Column<string>(nullable: false),
                    Photo = table.Column<string>(nullable: false),
                    PositionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employee_Position_PositionId",
                        column: x => x.PositionId,
                        principalTable: "Position",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserName = table.Column<string>(nullable: false),
                    Password = table.Column<string>(nullable: false),
                    EmployeeId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Account_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Account",
                columns: new[] { "Id", "EmployeeId", "Password", "UserName" },
                values: new object[] { 1, null, "admin", "admin" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 18, "Службы главного инженера", 14, "СГИ" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 17, "Юридическая служба", 16, "ЮС" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 16, "Службы начальника управления", 14, "СНУ" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 15, "Руководство", 14, "Р" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 14, "Районное управление 1 (филиал)", 21, "РУ1ф" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 13, "Сектор производственных ИС", 11, "СекПИС" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 12, "Сектор финансовых ИС", 11, "СекФИС" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 11, "Отдел ИТ", 7, "ОтИТ" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 10, "Сектор СДКУ", 8, "СекСДКУ" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 9, "Сектор АСУ", 8, "СекАСУ" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 8, "Отдел АСУТП", 7, "ОтАСУТП" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 7, "Службы заместителя главного инженера по АСУТП", 6, "СЗамГИ АСУТП" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 6, "Службы главного инженера", 1, "СГИ" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 5, "Юридический отдел", 3, "ЮО" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 4, "Служба общественных коммуникаций", 3, "СОК" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 3, "Службы генерального директора", 2, "СГД" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 2, "Руководство", 1, "Р" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 1, "Аппарат управления", 21, "АУ" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 21, "Все сотрудники", null, "Все" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 19, "Отдел АСУТП", 18, "ОтАСУТП" });

            migrationBuilder.InsertData(
                table: "Divisions",
                columns: new[] { "Id", "FullTitle", "ParentId", "ShortTitle" },
                values: new object[] { 20, "Отдел ИТ", 18, "ОтИТ" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 1, 2, "Генеральный директор" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 22, 12, "Инженер-программист 1 категории" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 23, 13, "Начальник сектора" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 24, 13, "Ведущий инженер-программист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 25, 13, "Инженер-программист 1 категории" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 26, 15, "Начальник управления" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 27, 15, "Главный инженер" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 21, 12, "Ведущий инженер-программист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 28, 17, "Юристконсульт" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 30, 19, "Начальник отдела" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 31, 19, "Ведущий инженер-программист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 32, 19, "Инженер-программист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 33, 19, "Техник" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 34, 20, "Начальник отдела" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 35, 20, "Ведущий инженер-программист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 29, 17, "Юристконсульт" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 20, 12, "Начальник сектора" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 19, 11, "Заместитель начальника отдела" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 18, 11, "Начальник отдела" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 2, 2, "Главный инженер" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 4, 4, "Начальник службы" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 5, 4, "Ведущий специалист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 6, 4, "Специалист 1 категории" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 7, 4, "Специалист 2 категории" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 8, 5, "Начальник отдела" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 9, 5, "Заместитель начальника отдела" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 10, 5, "Ведущий юристконсульт" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 11, 5, "Юристконсульт" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 12, 8, "Начальник отдела" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 13, 8, "Заместитель начальника отдела" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 14, 9, "Начальник сектора" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 15, 9, "Инженер программист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 16, 10, "Начальник сектора" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 17, 10, "Ведущий инженер-программист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 36, 20, "Инженер-программист" });

            migrationBuilder.InsertData(
                table: "Position",
                columns: new[] { "Id", "DivisionId", "Title" },
                values: new object[] { 37, 20, "Техник" });

            migrationBuilder.CreateIndex(
                name: "IX_Account_EmployeeId",
                table: "Account",
                column: "EmployeeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Account_UserName",
                table: "Account",
                column: "UserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_ContactPhone",
                table: "Employee",
                column: "ContactPhone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Email",
                table: "Employee",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_PersonnelNumber",
                table: "Employee",
                column: "PersonnelNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_PositionId",
                table: "Employee",
                column: "PositionId");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Name_Surname_Patronymic_BirthDate",
                table: "Employee",
                columns: new[] { "Name", "Surname", "Patronymic", "BirthDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Position_DivisionId",
                table: "Position",
                column: "DivisionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Position");

            migrationBuilder.DropTable(
                name: "Divisions");
        }
    }
}
