const apiKey = 'b656a56dbb20aecd3ffc68f77c7b55a5';
const units  = 'Metric';
const iUrl   = 'http://openweathermap.org/img/w/'
const png    = '.png';

$(document).ready(function() { 	
	init();
});

// Initalise the functionality we want to load when the page loads
var init = function () {
	initStyles();
	selectCityList();
};

// Make use of some bootstrap classes for asthetic purposes
var initStyles = function() {
	$('li').on('click', function(){
		$('li').removeClass('active');
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');
		}		
	});
}

// Method to call the weather API passing in the selected city dynamically
var loadWeatherData = function() {
	$('select').on('change', function() {
		var city = $(this).val();
		$.ajax( {
			url:'http://api.openweathermap.org/data/2.5/weather',
			type: 'GET',
			dataType: 'JSON', // Returns JSON
			data: {
				q: city + ', uk',
				units: units,
				appid: apiKey
			},
			success: function(response){
				if (response.base.length > 0) {
					var conditions = response.weather;
					var condition  = '';
					var iconurl    = '';

					$.each(conditions, function(index) {
						condition += '<ul>'
						condition += '<li>'+conditions[index].description+'</li>';
						condition += '</ul>'	
						iconurl = iUrl + conditions[0].icon + png;
					});
					
					// Table head
					var table = '<table id="weather-table">';
					table += '<tr>';
					table += '<th></th>';
					table += '<th>City</th>';
					table += '<th>Date</th>';
					table += '<th>Weather Conditions</th>';
					table += '<th>Temperature (&#8451;)</th>';
					table += '<th>Wind Speed</th>';
					table += '<th>Wind Direction</th>';					
					table += '</tr>';

					// Data
					table += '<tr>';
					table += '<td><img id="wicon" src="' + iconurl + '" alt="Weather icon"></td>';
					table += '<td>' + response.name + '</td>';
					table += '<td>' + convertUnixToUk(response.dt) + '</td>';
					table += '<td class="capitalise">' + condition + '</td>';
					table += '<td>Temp: ' + response.main.temp + '<br>Min Temp: ' + response.main.temp_min + '<br>Max Temp: ' + response.main.temp_max + '</td>';
					table += '<td>' + convertToMph(response.wind.speed) + ' mph</td>';
					table += '<td>' + convertFromDegrees(response.wind.deg) + '</td>';
					table += '</tr>';

					table += '</table>'

					$('#results').html(table);
				}
			},	
			error: function() {
				$('#cities').html('<p><div class="alert alert-danger">' +
					'<strong>Error!</strong> An error has occurred, no city by that name in the UK.' +
				'</div>');
				$('#results').empty();
			}
		});
	});
}

// Method to dynamically load the appropriate country lists from static files
var selectCityList = function (){
	$('li').on('click', function(){
		// Load the appropriate sub menus for the country clicked
		if ($(this).text() == 'England') {
			loadCountryList('england');
		}
		if ($(this).text() == 'Scotland') {
			loadCountryList('scotland');
		}
		if ($(this).text() == 'Wales') {
			loadCountryList('wales');
		}
		if ($(this).text() == 'Northern Ireland') {
			loadCountryList('nireland');
		}
	});
};

// Ajax method to take the passed in country name and then return a dropdown menu of cities specfic to that country
var loadCountryList = function(country){
	$.ajax( {
		url:'uk_cities/'+country+'-cities.html',
		type: 'GET',
		dataType: 'HTML', // Returns JSON
		success: function(response){
			// Build the select dropdown
			var select = '<select id="city-list" class="custom-select">';
			select += response;
			select += '</select>';

			// Inject the select dropdown into the page
			$('#cities').html(select);

			// Initalise the city dropdown select controls
			loadWeatherData();
		},	
		error: function() {
			$('#cities').html('<p><div class="alert alert-danger">' +
				'<strong>Error!</strong> An error has occurred, cannot load country list.' +
			'</div>');
			$('#results').empty();
		}
	});
};

// Method used to convert a unix timestamp into a UK date format
var convertUnixToUk = function(unixDate){
	// Create a new date object from the timestamp
	var temp   = new Date(unixDate * 1000);
		
	// Grab the bits we need
	var date   = temp.getDate();
	var month  = temp.getMonth();
	var year   = temp.getFullYear();

	// Piece the final string together
	return date + '-' + month + '-' + year;
};

// Method used to convert Metres per second into Miles per hour using a simple x * 2.23694 formula
var convertToMph = function(value){
	var mph = value * 2.23694;

	// return it to 4 decimal places
	return mph.toFixed(4);
};


// Helper method to convert the degree of angle to the closes appropriate compass string value
// Formula used: degree / 11.25 / 2
var convertFromDegrees = function(degree) {
	var compass = ['North', 'North North East', 'North East', 'East North East', 'East', 'East South East', 
	'South East', 'South South Eeast', 'South', 'South South West', 'South West', 'West South West', 'West', 
	'West North West', 'North West', 'North North West', 'North']; // Last north is the fallback

	return compass[Math.round(degree / 11.25 / 2)];
};