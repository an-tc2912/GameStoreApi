using System;
using GameStore.Data;
using GameStore.Models;

namespace GameStore.EndPoints;

public static class GameEndPoint
{
    const string GameByIdEndpointName = "GetGameById";
    private static readonly List<GameDto> games = [
      new (1, "Street Fighter V", "Fighting", 19.99M, new DateOnly(1992, 7, 15)),
    new (2, "The Witcher 3: Wild Hunt", "RPG", 39.99M, new DateOnly(2015, 5, 19)),
    new (3, "Minecraft", "Sandbox", 26.95M, new DateOnly(2011, 11, 18))
    ];

    public static void MapGamesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/games");
        // Endpoint to get all games
        group.MapGet("/", () => games);

        // Endpoint to get a game by ID
        group.MapGet("/{id}", (int id) =>
        {
            var game = games.FirstOrDefault(g => g.Id == id);
            return game is null ? Results.NotFound() : Results.Ok(game);
        }).WithName(GameByIdEndpointName);

        // POST /games
        group.MapPost("/", (CreateGameDto newGame, GameStoreContext context) =>
        {
            Game game = new()
            {
                Name = newGame.Name,
                GenreId = newGame.GenreId,
                Price = newGame.Price,
                ReleaseDate = newGame.ReleaseDate
            };
            context.Games.Add(game);
            context.SaveChanges();

            GameDetailsDto gameDto = new(
                game.Id,
                game.Name,
                game.GenreId,
                game.Price,
                game.ReleaseDate
            );
            return Results.CreatedAtRoute(GameByIdEndpointName, new { id = game.Id }, gameDto);
        });

        // PUT /games/{id}
        group.MapPut("/{id}", (int id, UpdateDto updateGame) =>
        {
            var index = games.FindIndex(g => g.Id == id);
            if (index == -1)
            {
                return Results.NotFound();
            }
            games[index] = games[index] with
            {
                Name = updateGame.Name,
                Genre = updateGame.Genre,
                Price = updateGame.Price,
                ReleaseDate = updateGame.ReleaseDate
            };
            return Results.NoContent();

        });
    }

}
