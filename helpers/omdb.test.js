'use strict';

// const request = require('supertest');
const axios = require('axios');
const OmdbWrapper = require('../helpers/omdb');

jest.mock('axios');

it('searches movies by title', async () => {
	axios.get.mockResolvedValue({
		data: {
			Search: [
				{
					Title: 'Cruella',
					Year: '2021',
					imdbID: 'tt3228774',
					Type: 'movie',
					Poster:
						'https://m.media-amazon.com/images/M/MV5BOWI5YTUxOWEtZmRiZS00ZmQxLWE2NzctYTRiODA2NzE1ZjczXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg'
				},
				{
					Title: 'Selena Gomez: Cruella De Vil',
					Year: '2008',
					imdbID: 'tt6970800',
					Type: 'movie',
					Poster:
						'https://m.media-amazon.com/images/M/MV5BZTYxZmVhZDItMjkwZC00MDY4LWE1N2UtM2RmYmQ4OWZlZGMyXkEyXkFqcGdeQXVyMjgzMzAzMjE@._V1_SX300.jpg'
				},
				{
					Title: 'Tales from the Underworld: A Knight with Cruella',
					Year: '2016',
					imdbID: 'tt6279832',
					Type: 'movie',
					Poster:
						'https://m.media-amazon.com/images/M/MV5BZGY0ODY0YWUtOTQ5Yi00YTdmLWE2NzYtZWFiYzhlN2FlODQzXkEyXkFqcGdeQXVyODA1Nzg3NDY@._V1_SX300.jpg'
				},
				{
					Title: 'Scarytale Ending: Cruella',
					Year: '2019–',
					imdbID: 'tt10309228',
					Type: 'series',
					Poster:
						'https://m.media-amazon.com/images/M/MV5BYTIyZDI4N2MtYWIyMy00MzUxLWI0NTAtZWQzMmJhYTI4ZWM0XkEyXkFqcGdeQXVyNTY3Mjc4MjY@._V1_SX300.jpg'
				},
				{
					Title: 'The Cruella Collection 1',
					Year: '1998',
					imdbID: 'tt0794075',
					Type: 'movie',
					Poster: 'N/A'
				}
			],
			totalResults: '5',
			Response: 'True'
		}
	});

	const title = 'Cruella';
	const data = await OmdbWrapper.searchMoviesByTitle(title, 1);

	expect(data.Search[0].Title).toEqual(title);
});
