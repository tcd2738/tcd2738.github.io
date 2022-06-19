import { Map } from "./classes/Map.js";

new Vue({
	el: '#app',
	data: {
		map: undefined,
		searchterm: "",
		searchType: "service",
		loading: false,
		movieID: "",
		movieTitle: "Search for a movie!",
		posterURL: "./images/baseposter.png", 
		userScore: 0,
		overview: "Waiting for a movie.",	
		favoritedMovies: [],
		locations: [],
		services: ["Netflix"],
		country: "US",
		servicesChecked: ['Netflix','HBO Max','Disney Plus','Paramount Plus', 'Amazon Prime Video','Hulu','Apple TV Plus'],
		locationMarkers: [],
		mapboxAccessToken: 'pk.eyJ1IjoidG9tbXljZDM2OSIsImEiOiJjazVlN3F6NTkyNGo3M2dvM2Nta24zcDJ2In0.xZ2ELx51EP9OCV6wD6Cm4g'
	},
    mounted() {
        this.map = new Map(this.mapboxAccessToken);

		// check local storage for past settings
			// otherwise, set default

		if (localStorage.getItem("servicesSelected")) {
			this.services = JSON.parse(localStorage.getItem("servicesSelected"));
		} else {
			this.services = ["Netflix"];
			localStorage.setItem("searchType", "service");
		}

		if (localStorage.getItem("countrySelected")) {
			this.country = localStorage.getItem("countrySelected");
		} else {
			this.country = "US";
			localStorage.setItem("countrySelected", "US");
		}

		if (localStorage.getItem("searchType")) {
			this.searchType = localStorage.getItem("searchType");
		} else {
			localStorage.setItem("searchType", "service");
		}
		this.lockUI();

		if (localStorage.getItem("lastMovieSearched")) {
			this.searchterm = localStorage.getItem("lastMovieSearched");
		} else {
			this.searchterm = "";
			localStorage.setItem("lastMovieSearched", "");
		}
		this.search();

		if (localStorage.getItem("favoritedMovies")) {
			this.favoritedMovies = JSON.parse(localStorage.getItem("favoritedMovies"));
		} else {
			this.favoritedMovies = [];
			localStorage.setItem("favoritedMovies", JSON.stringify([]));
		}
    },  
	methods:{
		// make changes to UI based on what search type is selected
		lockUI() {
			let services = document.getElementById("servicesContainer");
			let countries = document.getElementById("countryContainer");

			if (this.searchType == "country") {
				services.classList.add("collapse");
				countries.classList.remove("collapse");
				
				if (this.movieID) {
					this.collectStreamingData();
				}
			}

			if (this.searchType == "service") {
				services.classList.remove("collapse");
				countries.classList.add("collapse");

				if (this.movieID) {
					this.collectStreamingData();
				}
			}

			localStorage.setItem("searchType", this.searchType);
		},
		// handle search
		search() {
			if(!this.searchterm) return;

			// begin api data collection process
			this.collectMovieData();
		},
		// wipe local storage, clear controls, and reset defaults
		resetPage() {
			localStorage.clear();

			// reset pieces of data to their default state
			this.services = ["Netflix"];
			this.country = "US";
			this.searchType = "service";
			this.searchterm = "";
			this.favoritedMovies = [];

			// reset items in localStorage to their default state
			localStorage.setItem("servicesSelected", JSON.stringify(["Netflix"]));
			localStorage.setItem("countrySelected", "US");
			localStorage.setItem("searchType", "service");
			localStorage.setItem("lastMovieSearched", "");
			localStorage.setItem("favoritedMovies", JSON.stringify([]));

			// run methods that change depending on pieces of data
			this.clearMovieData();	
			this.clearLocationData();
			this.lockUI();
		},
		// add a movie to the favorited list
		favoriteMovie() {
			// check if the favoritedMovied array has been defined yet
			if (this.favoritedMovies == null) {
				this.favoritedMovies = new Array;
			}

			// check if this movie is already in the favoritedMovie array and if it is the default title
			if (!this.favoritedMovies.includes(this.movieTitle) && this.movieTitle != "Search for a movie!") {
				this.favoritedMovies.push(this.movieTitle);
				localStorage.setItem("favoritedMovies", JSON.stringify(this.favoritedMovies));
			}
		},
		// find favorite from favorite list
		findFavorite(movieTitle) {
			this.searchterm = movieTitle;
			this.collectMovieData();
		},
		// remove favorite from favorite list
		removeFavorite(movieTitle) {
			let index = this.favoritedMovies.indexOf(movieTitle);
			this.favoritedMovies.splice(index,1);

			localStorage.setItem("favoritedMovies", JSON.stringify(this.favoritedMovies));
		},
		// collect movie data from TMDB api
		collectMovieData() {
			this.clearMovieData();			
			localStorage.setItem("lastMovieSearched", this.searchterm);
			this.loading = true;
			
			// 'get a movie by search' api call and add searchterm to query string
			fetch("https://api.themoviedb.org/3/search/movie?api_key=bb73f5d438a0a349571a3ef38a3fa999&query=" + encodeURIComponent(this.searchterm.trim()))
			.then(response => {
				if(!response.ok){
					throw Error(`ERROR: ${response.statusText}`);
				}
				return response.json();
			})
			.then(json => {	

				// check if call returned anything
				if (json.results.length == 0) {
					this.movieTitle = "No movies found!";
					return;
				}

				// load the entire first result into the movie data piece
				let movie = json.results[0];

				// pull out the title, posterURL, and movieID for later
				this.movieTitle = movie.original_title;
				this.posterURL = "https://image.tmdb.org/t/p/w200" + movie.poster_path;
				this.userScore = movie.vote_average;
				this.overview = movie.overview;
				this.movieID = movie.id;

				this.loading = false;
				this.collectStreamingData();
			});	
		},
		// collect streaming data from TMDB api
		collectStreamingData() {

			localStorage.setItem("servicesSelected", JSON.stringify(this.services));
			localStorage.setItem("countrySelected", this.country);

			this.clearLocationData();

			if (this.movieID != "") {
				// 'get watch providers' api call with current movieID
				fetch("https://api.themoviedb.org/3/movie/"+ this.movieID + "/watch/providers?api_key=bb73f5d438a0a349571a3ef38a3fa999")
				.then(response => {
					if(!response.ok){
						throw Error(`ERROR: ${response.statusText}`);
					}
					return response.json();
				})
				.then(json => {	
					// temporarily load in the results
					let results = json.results;

					if (this.searchType == "service") {
						this.dataByService(results);
					} else {
						this.dataByCountry(results);
					}

					this.map.dataToMap(this.locations);
				});	
			}
		},
		// display data by selected services
		dataByService(results) {
			for (const country in results) {
				// check each contry and see if it contains a list of subscription-based services
				if(results[country].flatrate != undefined) {
					results[country].flatrate.forEach(provider => {
						// check each subscription-based service in the list and compare it to the one we are currently searching for
						if(this.services.includes(provider.provider_name)) {
							this.locations.push({country: country, service: provider.provider_name});
						}
					});
				}
			}
		},
		// display data by selected country
		dataByCountry(results) {
			for (const country in results) {
				// check if the country matches the country currently being searched for and then check if it contains a list of subscription-based services
				if(country == this.country && results[country].flatrate != undefined) {
					results[country].flatrate.forEach(provider => {
						// check if the service is contianed within the list of services we check for
						if(this.servicesChecked.includes(provider.provider_name)) {
							this.locations.push({country: country, service: provider.provider_name});
						}
					});
				}
			}
		},
		// resets movie data so new search can be performed
		clearMovieData() {
			this.movieID = "";
			this.movieTitle = "Search for a movie!";
			this.posterURL = "./images/baseposter.png";
			this.userScore = 0;
			this.overview = "Waiting for a movie.";
		},
		// resets location data so new markers can be loaded
		clearLocationData() {
			this.locations = [];
			this.map.clearLocationMarkers();
		}
	}
});