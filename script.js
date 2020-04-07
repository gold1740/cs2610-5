var ipKey = "96c17426f253e4d5dd491b8de9116d5b";
var weatherKey = "9fc346124fa36f7a6e69c1f10b139411";

var convert = function(number) {return ((number - 273.15)* 1.8 + 32).toFixed(2);};


var current = new Vue({
	el: '#current',
	data: {
		timestamp: "",
		current: "",
		high: "",
		low: "",
		clouds: "",
		pressure: "", 
		humidity: "",
	}
})


var position = new Vue({
	el: '#position',
	data: {
		position: "Location Pending"
	}
})

var forecast = new Vue({
	el: '#forecast',
	data: {
		guesses: [
			{dateTime: "", temperature: "", clouds: "", pressure: "", likely: "neutral"}
		],
		guess: '',
		likely: 0,
		neutral: 0,
		unlikely: 0,
	},
	methods: {
		toggle: function(event) {
			var div = event.target;
			while (div && div.id != "target"){div = div.parentElement;}
			var i = Array.prototype.indexOf.call(div.parentElement.childNodes, div);
			console.log(div);
			if (forecast.guesses[i].likely == "neutral"){
				forecast.guesses[i].likely = "likely";
				forecast.likely++;
				forecast.neutral--;
				div.setAttribute("class", "green shadowed stuff-box");
			} else if (forecast.guesses[i].likely == "likely"){
				forecast.guesses[i].likely = "unlikely";
				forecast.likely--;
				forecast.unlikely++;
				div.setAttribute("class", "red shadowed stuff-box");
			} else {
				forecast.guesses[i].likely = "neutral";
				forecast.unlikely--;
				forecast.neutral++;
				div.setAttribute("class", "black shadowed stuff-box");
			}
		}
	}
})


var weather = function(lat, lon) {

	fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ lat  +"&lon="+ lon + "&appid=" + weatherKey)
		.then(response => response.json())
		.then(json => {
			var d = new Date();
			current.timestamp = d.getMonth() + "/"+ d.getDay() + "/" + d.getFullYear() + ", "  + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "";
			current.current = convert(json.main.temp);
			current.high = convert(json.main.temp_max);
			current.low = convert(json.main.temp_min);
			current.clouds = json.weather[0].description;
			current.pressure = json.main.pressure; 
			current.humidity = json.main.humidity;

		});
	fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+ lat  +"&lon="+ lon + "&appid=" + weatherKey)
		.then(response => response.json())
		.then(json => {
			var tempList = [];
			for (entry in json.list){
				tempList.push({dateTime: json.list[entry].dt_txt, temperature: convert(json.list[entry].main.temp), clouds: json.list[entry].weather[0].description, pressure: json.list[entry].main.pressure, likely: "neutral"});
			}
			forecast.guesses = tempList;
			forecast.neutral = tempList.length;
		});
	}


fetch("http://api.ipstack.com/check?access_key=" + ipKey)
	.then(response => response.json())
	.then(json => { 
		this.position.position = "You are located in " + json.city + ", " + json.region_name + ", " + json.country_name + " at coordinates (" +  json.latitude + " , " + json.longitude +")";
		weather(json.latitude, json.longitude);
	});



