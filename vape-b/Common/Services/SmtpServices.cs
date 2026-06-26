using System.Net;
using System.Net.Mail;

namespace VAPE.Common.Services
{
    public class SmtpServices
    {
        private readonly string _host;
        private readonly int _port;
        private readonly bool _enableSsl;
        private readonly string _email;
        private readonly string _password;
        private readonly string _displayName;

        public SmtpServices(IConfiguration config)
        {
            var smtp = config.GetSection("Smtp");

            _host = smtp["Host"] ?? "smtp.gmail.com";
            _port = int.TryParse(smtp["Port"], out var port) ? port : 587;
            _enableSsl = !bool.TryParse(smtp["EnableSsl"], out var ssl) || ssl;
            _email = smtp["Email"] ?? throw new InvalidOperationException("Smtp:Email is not configured.");
            _password = smtp["Password"] ?? throw new InvalidOperationException("Smtp:Password is not configured.");
            _displayName = smtp["DisplayName"] ?? "VAPE";
        }

        public void SendEmail(string subject, string email, string body)
        {
            var mail = new MailMessage();

            mail.From = new MailAddress(_email, _displayName);
            mail.Subject = subject;
            mail.Body = body;
            mail.To.Add(email);
            mail.IsBodyHtml = false;

            var smtp = new SmtpClient(_host)
            {
                Port = _port,
                EnableSsl = _enableSsl,
                Credentials = new NetworkCredential(_email, _password)
            };

            smtp.Send(mail);
        }
    }
}
