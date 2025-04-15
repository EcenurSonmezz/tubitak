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
    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, ServiceResponse<UserDto>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork<KBYSDbContext> _unitOfWork;

        public DeleteUserCommandHandler(IUserRepository userRepository, IMapper mapper, IUnitOfWork<KBYSDbContext> unitOfWork)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<ServiceResponse<UserDto>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var entity = await _userRepository.FindAsync(request.Id);

                if (entity == null)
                {
                    return ServiceResponse<UserDto>.Return404("User Not Fount");
                }
                else
                {
                    _userRepository.Remove(entity);
                    await _unitOfWork.SaveAsync();
                    var entityDto = _mapper.Map<UserDto>(entity);
                    return ServiceResponse<UserDto>.ReturnResultWith200(entityDto);
                }
            }
            catch (Exception ex)
            {
                return ServiceResponse<UserDto>.ReturnException(ex);
            }


        }
    }
}
