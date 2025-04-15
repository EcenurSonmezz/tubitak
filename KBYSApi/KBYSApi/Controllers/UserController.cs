using KBYS.BusinessLogic.Command.Allergies;
using KBYS.BusinessLogic.Command.Foods;
using KBYS.BusinessLogic.Command.UserDiseases;
using KBYS.BusinessLogic.Command.Users;
using KBYS.Entities.Dto;
using KBYS.Helper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KBYSApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AddUserCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _mediator.Send(command);
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result.Errors);
            }

            return CreatedAtAction(nameof(Get), new { id = result.Data.Id }, result.Data);
        }

            /// <summary>
            /// Get By Id
            /// </summary>
            /// <param name="id"></param>
            /// <returns></returns>
            [HttpGet("{id}")]
            [Produces("application/json", "application/xml", Type = typeof(UserDto))]
            public async Task<IActionResult> Get(Guid id)
            {
                var result = await _mediator.Send(new GetUserByIdQuery { Id = id });

                return ReturnFormattedResponse(result);
            }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var result = await _mediator.Send(command);
            if (result.Success)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Message);
        }

        [HttpPost("AddUserDiseases")]
        public async Task<IActionResult> AddUserDiseases([FromBody] AddUserDiseaseCommand command)
        {
            var result = await _mediator.Send(command);
            return ReturnFormattedResponse(result);
        }

        /// <summary>
        /// Delete an user by Id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Produces("application/json", "application/xml", Type = typeof(ServiceResponse<UserDto>))]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _mediator.Send(new DeleteUserCommand { Id = id });
            return ReturnFormattedResponse(result);
        }


    }
}