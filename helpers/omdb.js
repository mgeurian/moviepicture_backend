const { omdbApiKey } = require('../config');
const axios = require('axios');

class OmdbWrapper {
	static getBaseUrl() {
		return `http://www.omdbapi.com/?apikey=${omdbApiKey}&type=movie`;
	}

	static async searchMoviesByTitle(title, page = 1) {
		const url = `${this.getBaseUrl()}&s=${encodeURIComponent(title)}&page=${page}`;
		const { data: movies } = await axios.get(url);
		return movies;
	}

	static async getMovieByImdbId(id) {
		const url = `${this.getBaseUrl()}&i=${id}`;
		const { data: movie } = await axios.get(url);
		return movie;
	}
}

module.exports = OmdbWrapper;
