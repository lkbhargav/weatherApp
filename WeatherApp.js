var searchBoxIsFocused = true;
var weatherUnit;
var speedUnit;
var compassDirections = [{"Key":"348.75", "Value":"North"},
                        {"Key":"11.25", "Value":"North NorthEast"},
                        {"Key":"33.75", "Value":"NorthEast"},
                        {"Key":"56.25", "Value":"East NorthEast"},
                        {"Key":"78.75", "Value":"East"},
                        {"Key":"101.25", "Value":"East SouthEast"},
                        {"Key":"123.75", "Value":"SouthEast"},
                        {"Key":"146.25", "Value":"South SouthEast"},
                        {"Key":"168.75", "Value":"South"},
                        {"Key":"191.25", "Value":"South SouthWest"},
                        {"Key":"213.75", "Value":"SouthWest"},
                        {"Key":"236.25", "Value":"West SouthWest"},
                        {"Key":"258.75", "Value":"West"},
                        {"Key":"281.25", "Value":"West NorthWest"},
                        {"Key":"303.75", "Value":"NorthWest"},
                        {"Key":"326.25", "Value":"North NorthWest"}];

function DateFormatter(millis) {
    return new Date(millis*1000).toLocaleString();
}

function GetCurrentMillis() {
    return parseInt(new Date().getTime());
}

function getDirection(wind) {
    if(wind < 0 || wind > 360 || !wind) return "Invalid";
    wind = parseFloat(wind.toPrecision(2));
    let direction = "";
    for(let i=compassDirections.length-1; i>=0; i--) {
        if(i===0) {
            direction = compassDirections[0].Value;
            break;
        }

        if(parseFloat(wind) > parseFloat(compassDirections[i].Key) && parseFloat(wind) < parseFloat(compassDirections[i].Key)+22.5) {
            direction = compassDirections[i].Value;
            break;
        }
    }
    return direction;
}

function detectmob() {
   if(window.innerWidth <= 737 && window.innerHeight <= 600) {
     return true;
   } else {
     return false;
   }
}

function DisplayWeather(data) {
    let degree;
    if(detectmob()) {
        $(".submitButtonEnter").val("Get weather");
        $(".submitButtonEnter").css("display","none");
    }
    if(data.wind.deg !== undefined && data.wind.deg !== null) {
        degree = getDirection(data.wind.deg)+" / "+data.wind.deg + " degree";
    } else {
        degree = "Unknown";
    }

    let html = "<h2>"+data.main.temp+" &#x2103;</h2>";
    html += "<h3>"+data.weather[0].main+"</h3>";
    html += "<img class='weatherImageAlignment' src='http://openweathermap.org/img/w/"+data.weather[0].icon+".png' />";
    html += "<h4> "+data.weather[0].description+" </h4>"
    html += "<div class='leftDiv'> <h4> Sunrise: " +DateFormatter(data.sys.sunrise)+ "</h4><h4> Sunset: " +DateFormatter(data.sys.sunset)+ "</h4><h4> Humidity: " +data.main.humidity+ "%</h4></div>";
    html += "<div class='leftDiv'> <h4> Pressure: " +data.main.pressure+ "</h4><h4> Wind direction: " +degree+ " </h4><h4> Wind speed: " +data.wind.speed+ " kilometer(s)/hour</h4></div>";
    $(".actualWeatherData").empty().append(html);

    $("h1.mainHead").text(data.name+" ("+data.sys.country+")");
}

function suggestCityNames(cityname){
    $.ajax({
      url: "http://autocompletecity.geobytes.com/AutoCompleteCity?callback=?&sort=size&q=" + cityname,
      dataType : "json",
      success : getCityNames
    })
}

function getCityNames(results){
  console.log("get city names");
  $("#city").empty();
  var i;
  var myArray = [];
  for(i=0; i < results.length; i++){
    var inp = results[i].split(",")[0];
    myArray.push(inp);
  }
  var j = 0;
  var mySet = new Set();
  var k = 0;
  while (j<myArray.length) {
    if(!mySet.has(myArray[j])) {
      $("#city").append("<div class='cityName'>" + myArray[j] + "</div>");
      mySet.add(myArray[j]);
      k++;
    }
    if(k===5){
      break;
    }
    j++;
  }
}

function GetWeatherInfo(cityName) {
    if(!CheckDataFromButtons(cityName))
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid=45b059433bebd3ff4885be4bf7e59a7c&units=metric", function(data) {
            if(data.cod === 200) {
                let cityData = JSON.parse(localStorage.getItem("queryedCityData"));
                let city = data.name;
                if(!IsAlreadyAdded(cityData, city)) {
                    GenerateSingleButton(city);
                    cityData.push({"city": city, "data": data, "time": GetCurrentMillis()});
                    localStorage.setItem("queryedCityData", JSON.stringify(cityData));
                }
                DisplayWeather(data);
                $(".messageLabel").text("(Successful query)").css("color","green");
            }
        }).fail(function(data) {
            $(".actualWeatherData").empty();
            $(".messageLabel").text("("+data.responseJSON.message+")").css("color","red");
        });
    }

function IsAlreadyAdded(cityData, city) {
    if(!cityData || !city) return false;
    for(let j=0; j<cityData.length; j++) {
        if(cityData[j].city === city) {
            return true;
        }
    }
    return false;
}

function CheckDataFromButtons(city) {
    let cityData = JSON.parse(localStorage.getItem("queryedCityData"));
    if(cityData === null) return true;
    for(let j=0; j<cityData.length; j++) {
        if(cityData[j].city === city) {
            if((GetCurrentMillis() - parseInt(cityData[j].time)) > 600000) {
                cityData.splice(j,1);
                $("a.noAnchorStyles:contains('"+city+"')").parents("span.quickButtonOverall").remove();
                localStorage.setItem("queryedCityData", JSON.stringify(cityData));
                return false;
            } else {
                DisplayWeather(cityData[j].data);
                return true;
            }
        }
    }
}

function GenerateSingleButton(city) {
    let html = "<span class='quickButtonOverall'>";
    html += "<span class='quickCityButton'><a class='noAnchorStyles' href='#' title='click for "+city+" weather information'>"+city+"</a></span>";
    html += "<span class='quickCloseButton'><a class='closeAnchorStyles' title='Clear link' href='#'>x</a></span>";
    html += "</span>";
    $(".quickButtonsPlaceHolder").append(html);
}

function GenerateQuickButtons(item) {
    if(!item || !item.city) return false;
    GenerateSingleButton(item.city);
}

function localStorageFunction(){
  if(!typeof(localStorage)) {
    $(".messageLabel").text("(Sorry local storage is not supported by your browser)").css("color","orange");
  } else {
    if(!localStorage.getItem("queryedCityData")) {
      localStorage.setItem("queryedCityData", JSON.stringify([]));
    } else {
      let cityData = JSON.parse(localStorage.getItem("queryedCityData"));
      cityData.forEach(GenerateQuickButtons);
    }
  }
}

$(document).ready(function() {
    if(detectmob()) {
        $(".searchLabel").text("Enter city name: ");
        $("<input type='submit' value='Get weather' class='submitButtonEnter'/>").insertAfter("input#searchBox");
        $(".messageLabel").remove();
    }

    localStorageFunction();

    $("input#searchBox").on("focus",function() {
        searchBoxIsFocused = true;
    });

    $("input#searchBox").on("keydown",function(event) {
        if(event.keyCode === 13 && searchBoxIsFocused) {
            GetWeatherInfo($(this).val());
            $(this).val("");
        }
    });

    $("input#searchBox").on("keyup", function(event){
      console.log($(this).val());
      if($(this).val().length < 3) return;
      suggestCityNames($(this).val());
    })

    $("body").on("click", ".cityName" , function(event){
        GetWeatherInfo($(this).text());
        $("#searchBox").val($(this).text());
        $("#city").empty();
    })

    $(".quickButtonsPlaceHolder").on("keydown", "a.noAnchorStyles", function(event) {
        if(event.keyCode === 13) {
            GetWeatherInfo($(this).text());
        }
    });

    $(".quickButtonsPlaceHolder").on("click", "span.quickCityButton", function(event) {
        GetWeatherInfo($(this).find("a.noAnchorStyles").text());
    });

    $(".clearAllButton").on("click",function() {
        localStorage.removeItem("queryedCityData");
        $(".quickButtonsPlaceHolder").empty();
        localStorageFunction();
    });

    $("div.searchBoxDiv").on("click", "input.submitButtonEnter", function() {
        GetWeatherInfo($(this).prev("input#searchBox").val());
        $(this).prev("input#searchBox").val("").focus();
    });

    $("input#searchBox").on("input", function() {
        if(detectmob()) {
            if($(this).val() === "") {
                $(".submitButtonEnter").css("display","none");
            } else {
                $(".submitButtonEnter").val("Get "+$(this).val()+" weather").css("display","block");
            }
        }
    });

    $(".quickButtonsPlaceHolder").on("click", "a.closeAnchorStyles", function() {
        let cityData = JSON.parse(localStorage.getItem("queryedCityData"));
        let city = $(this).parent("span.quickCloseButton").prev("span.quickCityButton").find("a.noAnchorStyles").text();
        for(let j= 0; j<cityData.length; j++) {
            if(cityData[j].city === city) {
                cityData.splice(j, 1);
                break;
            }
        }
        $(this).parents("span.quickButtonOverall").remove();
        localStorage.setItem("queryedCityData", JSON.stringify(cityData));
    });
});

$(window).on("keydown",function(event) {
   if(event.keyCode === 65 && event.ctrlKey) {
       $("input#searchBox").focus();
   }
});
