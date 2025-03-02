namespace Database.Entities
{
    public class UserBoardDto
    {
        public required string UserId { get; set; }
        public List<string> BoardIds { get; set; } = [];
    }
}
