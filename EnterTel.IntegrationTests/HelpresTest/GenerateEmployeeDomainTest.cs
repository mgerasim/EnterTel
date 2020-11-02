using System;
using Xunit;

namespace EnterTel.IntegrationTests.HelpresTest
{
    public class GenerateEmployeeDomainTest : IClassFixture<WebApplicationFactoryWithInMemory<EnterTel.Startup>>
    {
        private readonly WebApplicationFactoryWithInMemory<EnterTel.Startup> _factory;

        public GenerateEmployeeDomainTest(WebApplicationFactoryWithInMemory<EnterTel.Startup> factory)
        {
            _factory = factory;


        }
    }
}
