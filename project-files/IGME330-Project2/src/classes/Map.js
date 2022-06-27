class Map {
    
    // initialize Mapbox map
    constructor(accessToken) {
        // set up mapbox
        mapboxgl.accessToken = accessToken;
        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11'
        });

        // some map settings
        this.map.setZoom(-1);		
        this.map.addControl(new mapboxgl.NavigationControl())
        
        // set up mapbox sdk (for adding features)
        this.mapboxClient = mapboxSdk({
            accessToken: accessToken
        });

        this.locationMarkers = new Array;
    }

    // searches through returned streaming data and determines what needs added to the map
    dataToMap(locations) {
        locations.forEach(location => {
				
            // exceptions that need built in to interface between tmdb and mapbox: NO, CA, AT, HU, RO
            if (location.country == "CA") {
                location.country = "CAN";
            } else if (location.country == "NO") {
                // NO (Norway) returns North Carolina whether you use the 2 letter or 3 letter country code.
                    // I'm going to remove it instead of making it the only country that doesn't follow the naming pattern.
                return;
            } else if (location.country == "HU") {
                location.country = "HUN";
            } else if (location.country == "RO") {
                location.country = "ROU";
            } else if (location.country == "AT") {
                location.country = "AUT";
            }

            this.mapboxClient.geocoding
            .forwardGeocode({
                query: location.country,
                autocomplete: true,
                limit: 1
            })
            .send()
            .then((response) => {
                if (
                response &&
                response.body &&
                response.body.features &&
                response.body.features.length
                ) {
                let feature = response.body.features[0];

                this.addMapMarker(feature, location);
                }  
            });
        });
    }

    // determines marker type and adds it to map
    addMapMarker(feature, location) {
        let currentMarker;
        let el = document.createElement('div')
        el.className = location.service.split(" ").join("");

        // Create a marker and add it to the map.
        currentMarker = new mapboxgl.Marker(el)
        .setLngLat(feature.center)
        .setPopup(new mapboxgl.Popup({offset:25}) // add popups
            .setHTML('<div style="text-align:center;"><h3>' + location.country + '</h3><p>' + location.service + '</p></div>'))
        .addTo(this.map);

        this.locationMarkers.push(currentMarker);
    }

    // resets location data so new markers can be loaded
    clearLocationMarkers() {
        this.locationMarkers.forEach(marker => {
            marker.remove();
        });
        this.locationMarkers = [];
    }
}

export {Map};