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

it('gets movies by ImdbId', async () => {
	axios.get.mockResolvedValue({
		data: {
			Title: 'Cruella',
			Year: '2021',
			Rated: 'PG-13',
			Released: '28 May 2021',
			Runtime: '134 min',
			Genre: 'Adventure, Comedy, Crime',
			Director: 'Craig Gillespie',
			Writer: 'Dana Fox, Tony McNamara, Aline Brosh McKenna',
			Actors: 'Emma Stone, Emma Thompson, Joel Fry',
			Plot: 'A live-action prequel feature film following a young Cruella de Vil.',
			Language: 'English, French',
			Country: 'United States, United Kingdom',
			Awards: '1 win & 5 nominations',
			Poster:
				'https://m.media-amazon.com/images/M/MV5BOWI5YTUxOWEtZmRiZS00ZmQxLWE2NzctYTRiODA2NzE1ZjczXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg',
			Ratings: [
				{
					Source: 'Internet Movie Database',
					Value: '7.4/10'
				},
				{
					Source: 'Rotten Tomatoes',
					Value: '74%'
				},
				{
					Source: 'Metacritic',
					Value: '59/100'
				}
			],
			Metascore: '59',
			imdbRating: '7.4',
			imdbVotes: '185,717',
			imdbID: 'tt3228774',
			Type: 'movie',
			DVD: '27 Aug 2021',
			BoxOffice: '$86,103,234',
			Production: 'N/A',
			Website: 'N/A',
			Response: 'True'
		}
	});

	const imdbId = 'tt3228774';
	const title = 'Cruella';
	const data = await OmdbWrapper.getMovieByImdbId(imdbId);

	expect(data.Title).toEqual(title);
});
