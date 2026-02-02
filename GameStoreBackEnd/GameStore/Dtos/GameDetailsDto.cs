namespace GameStore;
// DTO for Game entity
public record GameDetailsDto
(
    int Id,
    string Name,
    int GenreId,
    string? GenreName,
    decimal Price,
    DateOnly ReleaseDate
);
