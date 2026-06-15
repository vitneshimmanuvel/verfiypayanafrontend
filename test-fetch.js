fetch('http://localhost:5000/ads/active')
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data)))
  .catch(err => console.error(err));
