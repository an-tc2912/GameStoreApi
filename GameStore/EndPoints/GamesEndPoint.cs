using System;
using GameStore.Data;
using GameStore.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.EndPoints;

public static class GamesEndPoint
{
    const string GameByIdEndpointName = "GetGameById";

    public static void MapGamesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/games");
        // Endpoint to get all games
        group.MapGet("/", async (GameStoreContext context) =>
        {
            return context.Games
            .Include(g => g.Genre)
            .Select(game => new GameSummaryDto(
                game.Id,
                game.Name,
                game.Genre!.Name,
                game.Price,
                game.ReleaseDate
                ))
                .AsNoTracking()
                ;
        }
        );

        // Endpoint to get a game by ID
        group.MapGet("/{id}", async (int id, GameStoreContext context) =>
        {
            var game = await context.Games.FindAsync(id);
            return game is null ?
            Results.NotFound() :
            Results.Ok(new GameDetailsDto(
                game.Id,
                game.Name,
                game.GenreId,
                game.Price,
                game.ReleaseDate
                ));
        }).WithName(GameByIdEndpointName);

        // POST /games
        group.MapPost("/", async (CreateGameDto newGame, GameStoreContext context) =>
        {
            Game game = new()
            {
                Name = newGame.Name,
                GenreId = newGame.GenreId,
                Price = newGame.Price,
                ReleaseDate = newGame.ReleaseDate
            };
            context.Games.Add(game);
            await context.SaveChangesAsync();

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
        group.MapPut("/{id}", async (int id, UpdateDto updateGame, GameStoreContext context) =>
        {
            var game = await context.Games.FindAsync(id);
            if (game is null)
            {
                return Results.NotFound();
            }
            game.Name = updateGame.Name;
            game.GenreId = updateGame.GenreId;
            game.Price = updateGame.Price;
            game.ReleaseDate = updateGame.ReleaseDate;
            await context.SaveChangesAsync();

            return Results.NoContent();

        });

        // DELETE /games/{id}
        group.MapDelete("/{id}", async (int id, GameStoreContext context) =>
        {
            await context.Games.Where(g => g.Id == id).ExecuteDeleteAsync();
            return Results.NoContent();
        });
    }

}
