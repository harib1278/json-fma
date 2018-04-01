 $(document).ready(function() {
	init();
});

 var init = function () {
	// Set a timer every 10 secs to keep getting weather info in realtime 
	autoLoad(getWeatherData, 60000, 10000);
};

// Function to automatically run scripts on the page
var autoLoad = function(funct, timeout, interval) {	

	var start = (new Date()).getTime();
	// Fallback to 10 seconds
	interval = interval || 10000;

	(function p() {
		// Remove the old weather table
		$('table').remove();

		// Call the passed in function using a dynamic call
		funct();
		if (((new Date).getTime() - start ) <= timeout)  {
			setTimeout(p, interval);
		}
	})();
};

// Method that reads from static json file and renders the display table for injection into the page
var getWeatherData = function () {
	$.ajax( {
		url:'weather.json',
		type: 'GET',
		dataType: 'json', // Returns JSON
		success: function(response){
			var sTxt = '';
			$.each(response.cities, function(index) {

				if (response.cities[index].available == true) {

					// Table head
					var table = '<table id="weather-table">';					
					table += '<caption>' + response.cities[index].cityName + '</caption>';

					table += '<tr>';

					table += '<th></th>';
					table += '<th>Conditions</th>';
					table += '<th>Temperature (&#8451;)</th>';
					table += '<th>Wind Chill Factor (&#8451;)</th>';
					table += '<th>Wind Direction</th>';
					table += '<th>Wind Speed</th>';

					table += '</tr>';

					// T body
					var conditions = response.cities[index].currentConditions;
					var condition  = '';

					table += '<tr>';
					table += '<td><img src="weather_icons/cloud.png" alt="cloud"></td>';

					$.each(conditions, function(index) {
						condition += '<ul>'
						condition += '<li>'+conditions[index].condition+'</li>';
						condition += '</ul>'
					});

					table += '<td>' + condition + '</td>';

					//Temp
					table += '<td>' + response.cities[index].temperature + '</td>';

					// Wind chill
					table += '<td>' + response.cities[index].windChillFactor + '</td>';

					// Wind direction
					table += '<td>' + response.cities[index].windDirection + '</td>';
					
					// Wind speed
					table += '<td>' + response.cities[index].windSpeed + '</td>';

					// Table footer
					table += '</tr>';
					table += '</table>';

					$('#cities').append(table);
				}

			});
		},	
		error: function() {
			$('#cities').html('<p>An error has occurred</p>');
		}
	});
};