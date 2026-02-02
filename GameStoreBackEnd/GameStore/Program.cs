using GameStore;
using GameStore.Data;
using GameStore.EndPoints;
using GameStore.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddValidation();
builder.AddGameStoreDb();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Use CORS
app.UseCors("AllowFrontend");


app.MapGamesEndpoints();
app.MapGenresEndpoints();

app.MigrateDb();

app.Run();
