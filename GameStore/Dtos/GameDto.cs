namespace GameStore;
// DTO for Game entity
public record GameDto
(
    int Id,
    string Name,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);
