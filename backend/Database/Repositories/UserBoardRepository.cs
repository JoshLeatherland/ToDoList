using Amazon.DynamoDBv2;
using Database.Entities;
using Database.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using Models.ViewModels;

namespace Database.Repositories
{
    public class UserBoardRepository(IAmazonDynamoDB dynamoDb, IOptions<AwsResources> awsResourcesOptions) : GenericRepository<UserBoardDto>(dynamoDb, awsResourcesOptions), IUserBoardRepository
    {
    }
}
