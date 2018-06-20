const lightOn = 'https://cdn.glitch.com/a87d11b5-8636-4309-8e45-d8e25846124b%2FlightOn.jpg?1529461977680';
const lightOff = 'https://cdn.glitch.com/a87d11b5-8636-4309-8e45-d8e25846124b%2FlightOff.jpg?1529461977861';


var app = new Vue({
  el: '#app',
  data: {
    status: false
  },
  computed: {
    light: function() { return this.status ? lightOn : lightOff }
  },
  methods: {
    loadData: function () {
      $.get('/status', function (response) {
        this.status = response.status;
      }.bind(this));
    },
    toggle: function() {
      $.get('/toggle', function (response) {
        this.status = response.status;
      }.bind(this));
    }
  },
  mounted: function () {
    this.loadData();

    setInterval(function () {
      this.loadData();
    }.bind(this), 5000); 
  }
})