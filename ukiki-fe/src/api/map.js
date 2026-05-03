//지도 api 요청

export const GetCoordinatesCity = async({city, apiKey}) => {
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;

    try {
        const response =  await fetch(url);
        const data = await response.json();
        console.log('지도 api data:', data);
        if (data.status === 'OK') {
            const { lat, lng } = data.results[0].geometry.location;
            return {lat, lng};
          } else {
            console.error('Geocoding API 오류:', data.status);
          }
    } catch(error) {
        console.log('지도api 요청 실패:' , error)
    }
}
