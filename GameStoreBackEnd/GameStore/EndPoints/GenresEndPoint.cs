using System;
using GameStore.Data;
using GameStore.Dtos;
using Microsoft.EntityFrameworkCore;

namespace GameStore.EndPoints;

public static class GenresEndPoint
{
  public static void MapGenresEndpoints(this WebApplication app)
  {
    var group = app.MapGroup("/genres");
    // Endpoint to get all genres
    group.MapGet("/", async (GameStoreContext context) => 
    {
      return await context.Genres.Select(genre => new GenreDto(
        genre.Id,
        genre.Name
        ))
        .AsNoTracking()
        .ToListAsync();
    });
  }
}
