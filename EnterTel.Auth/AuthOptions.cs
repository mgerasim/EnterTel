using System;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace EnterTel.Auth
{
    // TODO: Реализовать считывание параметров из переменных окружения среды

    public class AuthOptions
    {
        /// <summary>
        /// Кто сгенерировал токен
        /// </summary>
        public string Issuer { get; set; }

        /// <summary>
        /// Для кого предназначался токен
        /// </summary>
        public string Audience { get; set; }

        /// <summary>
        /// Секретная строка для генерации симетричного ключа
        /// </summary>
        public string Secret { get; set; }

        /// <summary>
        /// Длительность жизни токена в секундах
        /// </summary>
        public int TokenLifetime { get; set; }

        public AuthOptions()
        {
        }

        public SymmetricSecurityKey GetKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Secret));
        }
    }
}
