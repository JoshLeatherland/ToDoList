using Amazon.DynamoDBv2;
using Database.Interfaces;
using Database.Repositories;
using Database.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using Models.ViewModels;

namespace Database
{
    public class UnitOfWork(IAmazonDynamoDB dynamoDb, IOptions<AwsResources> awsResourcesOptions) : IUnitOfWork
    {
        private readonly IAmazonDynamoDB _dynamoDb = dynamoDb;
        private readonly IOptions<AwsResources> _awsResourcesOptions = awsResourcesOptions;
        private BoardRepository? _boardRepository;
        private UserBoardRepository? _userBoardRepository;

        public IBoardRepository Boards
        {
            get
            {
                return _boardRepository ??= new BoardRepository(_dynamoDb, _awsResourcesOptions);
            }
        }

        public IUserBoardRepository UserBoards
        {
            get
            {
                return _userBoardRepository ??= new UserBoardRepository(_dynamoDb, _awsResourcesOptions);
            }
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}
