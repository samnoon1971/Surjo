function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude });
          },
          error => {
            reject(error.message);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }


  function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateObj = new Date(dateStr);
    const formattedDate = dateObj.toLocaleString('en-US', options);
    return formattedDate;
  }
  function convertToAMPM(time24) {
    const timeArr = time24.split(':');
    const hours = parseInt(timeArr[0], 10);
    const minutes = parseInt(timeArr[1], 10);
  
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const time12 = new Date(0, 0, 0, hours, minutes).toLocaleString('en-US', options);
  
    return time12;
  }
  // Usage
  getCurrentLocation()
    .then(location => {
      API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
      fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Process the retrieved data
            const tableBody = document.getElementById('table-body');
            let html = '';
            for(let index=0; index<7; index++) {
                const sunrise = data.daily.sunrise[index];
                const date = data.daily.time[index];
                const sunset = data.daily.sunset[index];
                const sunriseDate = new Date(sunrise);
                // Get the time from the Date object
                const sunriseHours = sunriseDate.getHours().toString().length === 1? '0' + sunriseDate.getHours(): sunriseDate.getHours();
                const sunriseMinutes = sunriseDate.getMinutes().toString().length === 1? '0' + sunriseDate.getMinutes(): sunriseDate.getMinutes();
                const sunriseSeconds = sunriseDate.getSeconds().toString().length === 1? '0' + sunriseDate.getSeconds(): sunriseDate.getSeconds();

                // Format the time as a string
                const formattedSunriseTime = `${sunriseHours}:${sunriseMinutes}:${sunriseSeconds}`;



                const sunsetDate = new Date(sunset);
                // Get the time from the Date object
                const sunsetHours = sunsetDate.getHours().toString().length === 1? '0' + sunsetDate.getHours(): sunsetDate.getHours();
                const sunsetMinutes = sunsetDate.getMinutes().toString().length === 1? '0' + sunsetDate.getMinutes(): sunsetDate.getMinutes();
                const sunsetSeconds = sunsetDate.getSeconds().toString().length === 1? '0' + sunsetDate.getSeconds(): sunsetDate.getSeconds();

                // Format the time as a string
                const formattedSunsetTime = `${sunsetHours}:${sunsetMinutes}:${sunsetSeconds}`;
                const finalDate = formatDate(date);
                const finalSunrise = convertToAMPM(formattedSunriseTime);
                const finalSunset = convertToAMPM(formattedSunsetTime);
                html += `
                <tr>
                  <td>${finalDate}</td>
                  <td><i class="fas fa-sun"></i> ${finalSunrise}</td>
                  <td><i class="fas fa-moon"></i> ${finalSunset}</td>
                </tr>
              `;
            }
            tableBody.innerHTML = html;

            // Access the hourly temperature forecast
        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error:', error);
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  


