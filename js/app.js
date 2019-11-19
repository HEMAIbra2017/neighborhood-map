let bounds, info, map;

// Locations  points
const locations = [
    {
        title: 'El Rehab city',
        location: {
            lat: 30.066026,
            lng: 31.485607
        },
        about: ' El Rehab City ' + '<br>' +
            '<img src="img/RehabCity.jpg" alt="El Rehab city">'
        },

        {
        title: 'Badr City',
        location: {
            lat: 30.142210,
            lng: 31.741371
        },
        about: ' Badr City ' + '<br>' +
            '<img src="img/BadrCity.jpg" alt="Badr city">'
        },
        
        {
        title: 'El Shorouk City',
        location: {
            lat: 30.141884,
            lng: 31.628510
        },
        about: ' El Shorouk City ' + '<br>' +
            '<img src="img/ShoroukCity.png" alt="El Shorouk city">'
        },
        {
        title: 'El Maadi city',
        location: {
            lat: 29.970386,
            lng: 31.266781
        },
        about: ' El Maadi City' + '<br>' +
            '<img src="img/MaadiCity.jpg" alt="Maadi city">'
        },
        {
        title: 'Obour City',
        location: {
            lat: 30.228341,
            lng: 31.479895
        },
        about: ' Obour City' + '<br>' +
            '<img src="img/ObourCity.jpg" alt="Obour city">'
        },

    {
        title: 'El Zamalek city',
        location: {
            lat: 30.065882,
            lng: 31.218650
        },
        about: ' El Zamalek city' + '<br>' +
            '<img src="img/ZamalekCity.jpg" alt="Zamalek City">'
        },
    {
        title: 'Helwan city',
        location: {
            lat: 29.848319,
            lng: 31.336853
        },
        about: ' Helwan City' + '<br>' +
            '<img src="img/HelwanCity.jpg" alt="Helwan city">'
        },

    {
        title: 'El Abbasia City',
        location: {
            lat: 30.065008,
            lng: 31.271445
        },
        about: ' El Abbasia City' + '<br>' +
            '<img src="img/Abbasia.png" alt="Abbasia city">'
        },
    {
        title: 'Misr El Gdeda',
        location: {
            lat: 30.090984,
            lng: 31.322709
        },
        about: ' Misr El Gdeda' + '<br>' +
            '<img src="img/MisrElGdeda.jpg" alt="Misr El Gdeda">'
        },

        {
        title: '6 October City',
        location: {
            lat: 29.928543,
            lng: 30.918783
        },
        about: '6 October City' + '<br>' +
            '<img src="img/OctoberCity.jpg" alt="6 October City">'
        }

    ];

// marker
let marker = function (inf) {
    const self = this;
    this.title = inf.title;
    this.about = inf.about;
    this.position = inf.location;

 this.visible = ko.observable(true);
  this.marker = new google.maps.Marker({

        position: this.position,
        title: this.title,
        about: this.about,
        animation: google.maps.Animation.DROP
    });

    //  function to Set cotnent and Show information
    function populateInfo(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('none');
            infowindow.marker = marker;
            const wikipediaSource = 'https://en.wikipedia.org/wiki/' + marker.title;
            const wikipediaURL = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + marker.title;
            $.ajax({
                type: 'Get',
                dataType: 'jsonp',
                data: {},
                url: wikipediaURL
            }).done(function (response) {
                console.log(marker);
                const extract = response.query.pages[Object.keys(response.query.pages)[0]].extract;
                infowindow.setContent('<div>' + '<h3>' + marker.title + '</h3>' + '<br> (check the source: : ' + '<a href=' + wikipediaSource + '> Wikipedia site: </a>' + marker.about + '</div>');
            }).fail(function () {
                alert('unexpected error');
            });
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function () {
                infowindow.close();
                if (infowindow.marker !== null)
                    infowindow.marker.setAnimation(null);
                infowindow.marker = null;
            });

        }
    }

    // filterMakers Bounds 
    self.filterMarkers = ko.computed(function () {
        if (self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });

    this.marker.addListener('click', function () {
        populateInfo(this, info);
        map.panTo(this.getPosition());
        toggleBounce(this);
    });

    //toggleBounce animation
    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1300);
        }
    }

    //  method Of Error handling
    function errorHandle() {
        alert(" please try again and be sure of your internet connection");
    }

    this.bounce = function (place) {
        google.maps.event.trigger(self.marker, 'click');
    };
    this.view = function (location) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

// view_Model function 
const ViewModel = function () {
    const self = this;
    this.FilteredItem = ko.observable('');
    this.itemList = ko.observableArray([]);
    // add markers to each of  location
    locations.forEach(function (location) {
        self.itemList.push(new marker(location));
    });

    // show locations on map
    this.locationList = ko.computed(function () {
        const searchFilter = self.FilteredItem().toLowerCase();
        if (searchFilter) {
            return ko.utils.arrayFilter(self.itemList(),
                function (location) {
                    const plc = location.title.toLowerCase();
                    const res = plc.includes(searchFilter);
                    location.visible(res);
                    return res;
                });
        }
        this.itemList().forEach(function (location) {
            location.visible(true);
        });
        return self.itemList();
    }, this);

};

// initMap 
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.056610,
            lng: 31.330108
        },
        zoom: 14

    });
    info = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    ko.applyBindings(new ViewModel());
}