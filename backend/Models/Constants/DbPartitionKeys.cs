namespace Models
{
    public class DbPartitionKeys
    {
        /// <summary>
        /// Data in which boards are stored.
        /// </summary>
        public const string Boards = "Boards";
        /// <summary>
        /// Releationship between CognitoId and BoardId to ensure authenticated users remain in there own board.
        /// </summary>
        public const string UserBoards = "UserBoards";
    }
}
