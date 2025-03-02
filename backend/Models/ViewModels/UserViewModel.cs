namespace Models.ViewModels
{
    public class UserViewModel
    {
        public required string UserId { get; set; }
        public List<string> UserBoardIds { get; set; } = [];
    }
}
