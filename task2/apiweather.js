 const apiKey = 'b656a56dbb20aecd3ffc68f77c7b55a5';

 $(document).ready(function() { 	
	init();
});

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
				appid: apiKey
			},
			success: function(response){
				console.log(response);
			},	
			error: function() {
				$('#cities').html('<p>An error has occurred</p>');
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
			$('#cities').html('<p>An error has occurred</p>');
		}
	});
};