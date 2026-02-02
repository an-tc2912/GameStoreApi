import useSWR from 'swr'

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Generic fetch helper for API calls
 * Handles error responses and validation errors from backend
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise<any>} Parsed JSON response or null for 204 No Content
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let error = new Error(`API Error: ${response.status}`);

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json();

          // Handle ASP.NET Core validation errors
          if (errorData.errors) {
            error.validationErrors = errorData.errors;
            error.message = errorData.title || "Validation error";
          } else if (errorData.message) {
            error.message = errorData.message;
          } else if (errorData.detail) {
            error.message = errorData.detail;
          }
        } catch {
          console.error("Failed to parse error response");
        }
      } else {
        const text = await response.text();
        error.message = text || error.message;
      }
      throw error;
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * SWR fetcher function
 */
const swrFetcher = (endpoint) => fetchAPI(endpoint);

/**
 * Games API - CRUD operations for games
 */
export const gamesAPI = {
  // Fetch all games
  getAll: async () => {
    return fetchAPI("/games");
  },

  // Fetch single game by ID
  getById: async (id) => {
    return fetchAPI(`/games/${id}`);
  },

  // Create new game
  create: async (gameData) => {
    return fetchAPI("/games", {
      method: "POST",
      body: JSON.stringify(gameData),
    });
  },

  // Update existing game
  update: async (id, gameData) => {
    return fetchAPI(`/games/${id}`, {
      method: "PUT",
      body: JSON.stringify(gameData),
    });
  },

  // Delete game
  delete: async (id) => {
    return fetchAPI(`/games/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Genres API - CRUD operations for genres
 */
export const genresAPI = {
  // Fetch all genres
  getAll: async () => {
    return fetchAPI("/genres");
  },

  // Fetch single genre by ID
  getById: async (id) => {
    return fetchAPI(`/genres/${id}`);
  },

  // Create new genre
  create: async (genreData) => {
    return fetchAPI("/genres", {
      method: "POST",
      body: JSON.stringify(genreData),
    });
  },

  // Update existing genre
  update: async (id, genreData) => {
    return fetchAPI(`/genres/${id}`, {
      method: "PUT",
      body: JSON.stringify(genreData),
    });
  },

  // Delete genre
  delete: async (id) => {
    return fetchAPI(`/genres/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * SWR Hooks for data fetching with caching and deduplication
 */
export function useGames() {
  const { data, error, isLoading, mutate } = useSWR('/games', swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  return {
    games: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useGenres() {
  const { data, error, isLoading } = useSWR('/genres', swrFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Genres rarely change, cache for 1 minute
  });

  return {
    genres: data || [],
    isLoading,
    isError: error,
  };
}

export default fetchAPI;
