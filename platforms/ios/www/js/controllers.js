angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('DropsCtrl', function($scope, $ionicLoading, Drops) {
    $scope.drops = {};

    // show loading
    $ionicLoading.show({
        template: 'Loading...'
    });

    // get all drops
    var promise = Drops.all();

    // set drops to view
    promise.then(function(data) {
        $scope.drops = data;
        $ionicLoading.hide();
    });
})

.controller('DropCtrl', function($scope, $ionicLoading, $stateParams, Drops) {
    $scope.drop = {};

    // show loading
    $ionicLoading.show({
        template: 'Loading...'
    });

    // get drop by id
    var promise = Drops.getById($stateParams.dropId);

    // set drops to view
    promise.then(function(data) {
        $scope.drop = data;

        $ionicLoading.hide();
    });
})

.controller('GoCtrl', function($scope, $ionicLoading, $stateParams, Drops) {
    $scope.drop = {};
    $scope.distance = null;
    $scope.degrees = null;

    var markers = {};

    // show loading
    $ionicLoading.show({
        template: 'Loading...'
    });

    // get drop by id
    var promise = Drops.getById($stateParams.dropId);

    // set drops to view
    promise.then(function(data) {
        markers = data.markers;

        // init local storage
        if (localStorage.getItem("lastMarker") === null) {
            localStorage.setItem("lastMarker", -1);
        }

        // check positions
        setInterval(function () {
                navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);
        }, 3000);

        // check orientation
        var optionsCompass = {
            frequency: 500 // Update every half second
        };
        navigator.compass.watchHeading(onSuccessCompass, onErrorCompass, optionsCompass);

        $ionicLoading.hide();
    });

    /**
     * Check the position against the markers
     *
     * @param params
     */
    function onSuccessGeo(position) {
        var lastmarker = localStorage.getItem("lastMarker");
        var distance = 0;
        var amountMarkers = markers.length;
        currentLat = position.coords.latitude;
        currentLng = position.coords.longitude;

        // check if it's the first marker
        if (lastmarker == -1 || lastmarker == 0) {
            lastmarker = 0;
            localStorage.setItem("lastMarker", lastmarker);

            nextLat = markers[0].lat;
            nextLng = markers[0].lng;
        }
        else {
            nextLat = markers[lastmarker].lat;
            nextLng = markers[lastmarker].lng;
        }

        // get distance
        distance = roundDistance(getDistanceFromLatLonInKm(currentLat, currentLng, nextLat, nextLng));

        //$('.drop-info').html('<p>Please go to marker: ' + markers[0].name + '</p>');
        $scope.$apply(function () {
            $scope.distance = distance + '<span>km</span>';
        });

        if (distance < 0.01) {
            lastMarker++;
            if (lastMarker <= amountMarkers) {
                localStorage.setItem("lastMarker", lastmarker);
            }
            else {
                alert('Your there mate! Good job!');
                localStorage.removeItem("lastMarker");
            }
        }
    };

    /**
     * Get the current orientation of the device
     *
     * @param heading
     */
    function onSuccessCompass(heading) {
        var degrees = heading.magneticHeading;
        var bearing = getBearingFromLatLon(currentLat, currentLng, nextLat, nextLng);
        var degreesCompass = toInteger(degrees + bearing);

        $scope.$apply(function () {
            $scope.degrees = degrees;
        });

        changeCompass(degreesCompass);
    }

    /**
     * Error geo
     *
     * @param data
     */
    function onErrorGeo(data) {
        alert("Can not get the geolocation. Check if your device supports this feature.");
        console.log("Error callback: " + data);
    }

    /**
     * Error Compass
     *
     * @param data
     */
    function onErrorCompass(data) {
        alert("Can not get the orientation of the device. Check if your device supports this feature.");
        console.log("Error callback: " + data);
    }
});
