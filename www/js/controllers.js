angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    })

    .controller('DropsCtrl', function ($scope, $ionicLoading, Drops) {
        $scope.drops = {};

        // show loading
        $ionicLoading.show({
            template: 'Loading...'
        });

        // get all drops
        var promise = Drops.all();

        // set drops to view
        promise.then(function (data) {
            $scope.drops = data;
            $ionicLoading.hide();
        });
    })

    .controller('DropCtrl', function ($scope, $ionicLoading, $stateParams, Drops) {
        $scope.drop = {};

        // show loading
        $ionicLoading.show({
            template: 'Loading...'
        });

        // get drop by id
        var promise = Drops.getById($stateParams.dropId);

        // set drops to view
        promise.then(function (data) {
            $scope.drop = data;

            $ionicLoading.hide();
        });
    })

    .controller('GoCtrl', function ($scope, $ionicLoading, $stateParams, Drops) {
        $scope.drop = {};
        $scope.distance = null;
        $scope.degrees = null;
        localStorage.removeItem("lastMarker");

        var markers = {};

        // show loading
        $ionicLoading.show({
            template: 'Loading...'
        });

        // get drop by id
        var promise = Drops.getById($stateParams.dropId);

        // set drops to view
        promise.then(function (data) {
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
//            var optionsCompass = {
//                frequency: 1
//            };
//            navigator.compass.watchHeading(onSuccessCompass, onErrorCompass, optionsCompass);

            // simulate compass
            setInterval(function () {
                var degrees = randomFromTo(0 , 360);
                $scope.$apply(function () {
                    $scope.compass = {
                    '-moz-transform':'rotate(-' + degrees + 'deg)',
                    '-webkit-transform':'rotate(-' + degrees + 'deg)',
                    '-o-transform':'rotate(-' + degrees + 'deg)',
                    '-ms-transform':'rotate(-' + degrees + 'deg)',
                    'transform':'rotate(-' + degrees + 'deg)'
                    };
                });
            }, 1000);

            $ionicLoading.hide();
        });

        /**
         * Check the position against the markers
         *
         * @param params
         */
        function onSuccessGeo(position) {
            var lastmarker = localStorage.getItem("lastMarker");
            var firstLat = localStorage.getItem("firstLat");
            var firstLng = localStorage.getItem("firstLng");
            var distance = 0;
            var totalDistance = 0;
            var percentDistance = 0;
            var amountMarkers = markers.length;
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;

            // check if it's the first marker
            if (lastmarker == -1 || lastmarker == 0) {
                lastmarker = 0;
                localStorage.setItem("lastMarker", lastmarker);

                if (localStorage.getItem("firstLat") === null) firstLat = currentLat;
                if (localStorage.getItem("firstLng") === null) firstLng = currentLng;

                nextLat = markers[0].lat;
                nextLng = markers[0].lng;

                totalDistance = roundDistance(getDistanceFromLatLonInKm(firstLat, firstLng, nextLat, nextLng));
            }
            else {
                nextLat = markers[lastmarker].lat;
                nextLng = markers[lastmarker].lng;
                prevLat = markers[lastmarker-1].lat;
                prevLng = markers[lastmarker-1].lng;

                totalDistance = roundDistance(getDistanceFromLatLonInKm(prevLat, prevLng, nextLat, nextLng));
            }

            // get distance
            distance = roundDistance(getDistanceFromLatLonInKm(currentLat, currentLng, nextLat, nextLng));
            percentDistance = 100-(100*distance/totalDistance);

            //$('.drop-info').html('<p>Please go to marker: ' + markers[0].name + '</p>');
            $scope.$apply(function () {
                $scope.distance = distance + '<span>km</span>';
                $scope.percent = percentDistance;
                if(percentDistance < 5) $scope.classPercent = "per0";
                else if(percentDistance < 10) $scope.classPercent = "per5";
                else if(percentDistance < 15) $scope.classPercent = "per10";
                else if(percentDistance < 20) $scope.classPercent = "per15";
                else if(percentDistance < 25) $scope.classPercent = "per20";
                else if(percentDistance < 30) $scope.classPercent = "per25";
                else if(percentDistance < 35) $scope.classPercent = "per30";
                else if(percentDistance < 40) $scope.classPercent = "per35";
                else if(percentDistance < 45) $scope.classPercent = "per40";
                else if(percentDistance < 50) $scope.classPercent = "per45";
                else if(percentDistance < 55) $scope.classPercent = "per50";
                else if(percentDistance < 60) $scope.classPercent = "per55";
                else if(percentDistance < 65) $scope.classPercent = "per60";
                else if(percentDistance < 70) $scope.classPercent = "per65";
                else if(percentDistance < 75) $scope.classPercent = "per70";
                else if(percentDistance < 80) $scope.classPercent = "per75";
                else if(percentDistance < 85) $scope.classPercent = "per80";
                else if(percentDistance < 90) $scope.classPercent = "per85";
                else if(percentDistance < 95) $scope.classPercent = "per90";
                else if(percentDistance < 100) $scope.classPercent = "per95";
                else if(percentDistance >= 100) $scope.classPercent = "per100";
            });

            if (distance < 0.02) {
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
            var degrees = heading.magneticHeading + 90;
            if (degrees > 360) {
                degrees = degrees - 360;
            }

            var bearing = getBearingFromLatLon(currentLat, currentLng, nextLat, nextLng);
            var degreesCompass = toInteger(degrees + bearing);
            if (degreesCompass > 360) {
                degreesCompass = degreesCompass - 360;
            }

            $scope.$apply(function () {
                $scope.degrees = degreesCompass;
                $scope.compass = {
                    '-moz-transform':'rotate(-' + degreesCompass + 'deg)',
                    '-webkit-transform':'rotate(-' + degreesCompass + 'deg)',
                    '-o-transform':'rotate(-' + degreesCompass + 'deg)',
                    '-ms-transform':'rotate(-' + degreesCompass + 'deg)',
                    'transform':'rotate(-' + degreesCompass + 'deg)'
                };
            });
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