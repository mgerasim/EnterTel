using System;
using System.Linq;
using EnterTel.DAL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EnterTel.IntegrationTests
{
    public class WebApplicationFactoryWithInMemory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType ==
                        typeof(DbContextOptions<EnterTelContext>));

                services.Remove(descriptor);

                services.AddDbContext<EnterTelContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });

                var sp = services.BuildServiceProvider();

                using (var scope = sp.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<EnterTelContext>();
                    var logger = scopedServices
                        .GetRequiredService<ILogger<WebApplicationFactoryWithInMemory<TStartup>>>();

                    db.Database.EnsureCreated();


                }
            });
        }
    }
}
