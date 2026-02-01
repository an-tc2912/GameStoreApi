namespace GameStore;
// DTO for Game entity
public record GameSummaryDto
(
    int Id,
    string Name,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);
