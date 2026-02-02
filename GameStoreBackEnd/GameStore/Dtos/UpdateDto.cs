using System.ComponentModel.DataAnnotations;

namespace GameStore;

public record UpdateDto
(
    [Required]
    [StringLength(50)]
    string Name,
    [Range(1, int.MaxValue)]
    int GenreId,
    [Range(0.01, 1000)]
    decimal Price,
    DateOnly ReleaseDate
);
