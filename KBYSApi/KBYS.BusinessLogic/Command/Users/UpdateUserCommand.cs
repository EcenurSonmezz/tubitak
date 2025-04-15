using KBYS.Entities.Dto;
using KBYS.Helper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KBYS.BusinessLogic.Command.Users
{
    public class UpdateUserCommand : IRequest<ServiceResponse<UserDto>>
    {
        public  Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
