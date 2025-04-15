using AutoMapper;
using KBYS.BusinessLogic.Command.Users;
using KBYS.DataAcces.KBYSDbContexts;
using KBYS.DataAcces.UnitOfWork;
using KBYS.Entities.Dto;
using KBYS.Helper;
using KBYS.Repository.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KBYS.BusinessLogic.Handler.Users
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, ServiceResponse<UserDto>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork<KBYSDbContext> _unitOfWork;

        public UpdateUserCommandHandler(IUserRepository userRepository, IMapper mapper, IUnitOfWork<KBYSDbContext> unitOfWork)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<ServiceResponse<UserDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var entity = await _userRepository.FindAsync(request.Id);
                if (entity == null)
                {
                    return ServiceResponse<UserDto>.Return404("User Not Found");
                }
                else
                {
                    //Password Şifreleme işlemi yapılacak sonra devam et
                }
            }
            catch (Exception)
            {

                throw;
            }
            throw new NotImplementedException();
        }
    }
}
