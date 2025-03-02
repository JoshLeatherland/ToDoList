using Amazon.DynamoDBv2;
using Database.Entities;
using Database.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using Models.ViewModels;

namespace Database.Repositories
{
    public class BoardRepository(IAmazonDynamoDB dynamoDb, IOptions<AwsResources> awsResourcesOptions) : GenericRepository<BoardDto>(dynamoDb, awsResourcesOptions), IBoardRepository
    {
    }
}
