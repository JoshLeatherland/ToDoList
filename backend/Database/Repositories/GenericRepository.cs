using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Database.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using Models.ViewModels;
using System.Text.Json;


namespace Database.Repositories
{
    public class GenericRepository<T>(IAmazonDynamoDB dynamoDb, IOptions<AwsResources> awsResourcesOptions) : IGenericRepository<T> where T : class
    {
        private readonly IAmazonDynamoDB _dynamoDb = dynamoDb;
        private readonly AwsResources _awsResources = awsResourcesOptions.Value;

        public async Task<T?> GetAsync(string partitionKey, string sortKey)
        {
            var request = CreateGetItemRequest(partitionKey, sortKey);

            var response = await _dynamoDb.GetItemAsync(request);
            if (response.Item == null || response.Item.Count == 0)
                return null;

            var json = response.Item.TryGetValue("Value", out var attributeValue) ? attributeValue.S : string.Empty;

            return JsonSerializer.Deserialize<T>(json);
        }

        public async Task AddAsync(string partitionKey, string sortKey, T entity)
        {
            var json = JsonSerializer.Serialize(entity);
            var request = CreatePutItemRequest(partitionKey, sortKey, json);
            await _dynamoDb.PutItemAsync(request);
        }

        public async Task UpdateAsync(string partitionKey, string sortKey, T entity)
        {
            await AddAsync(partitionKey, sortKey, entity);
        }

        public async Task DeleteAsync(string partitionKey, string sortKey)
        {
            var request = CreateDeleteItemRequest(partitionKey, sortKey);
            await _dynamoDb.DeleteItemAsync(request);
        }

        #region Private

        private GetItemRequest CreateGetItemRequest(string partitionKey, string sortKey)
        {
            return new GetItemRequest
            {
                TableName = _awsResources.DynamoSharedTable,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "PK", new AttributeValue { S = partitionKey } },
                    { "SK", new AttributeValue { S = sortKey } }
                }
            };
        }

        private PutItemRequest CreatePutItemRequest(string partitionKey, string sortKey, string value)
        {
            return new PutItemRequest
            {
                TableName = _awsResources.DynamoSharedTable,
                Item = new Dictionary<string, AttributeValue>
                {
                    { "PK", new AttributeValue { S = partitionKey } },
                    { "SK", new AttributeValue { S = sortKey } },
                    { "Value", new AttributeValue { S = value } },
                    { "CreatedAt", new AttributeValue { S = DateTime.UtcNow.ToString("o") } }
                }
            };
        }

        private DeleteItemRequest CreateDeleteItemRequest(string partitionKey, string sortKey)
        {
            return new DeleteItemRequest
            {
                TableName = _awsResources.DynamoSharedTable,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "PK", new AttributeValue { S = partitionKey } },
                    { "SK", new AttributeValue { S = sortKey } }
                }
            };
        }
        #endregion
    }
}
