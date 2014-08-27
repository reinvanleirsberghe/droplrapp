//// main functions
/**
*
* @param from
* @param to
* @returns {number}
*/
function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

/**
 * Get distance between two lats and longs
 *
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number}
 */
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = _toRad(lat2-lat1);  // deg2rad below
    var dLon = _toRad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(_toRad(lat1)) * Math.cos(_toRad(lat2)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

/**
 * Calculate the bearing between two positions as a value from 0-360
 *
 * @param lat1 - The latitude of the first position
 * @param lng1 - The longitude of the first position
 * @param lat2 - The latitude of the second position
 * @param lng2 - The longitude of the second position
 *
 * @return int - The bearing between 0 and 360
 */
function getBearingFromLatLon(lat1,lng1,lat2,lng2) {
    var dLon = (lng2-lng1);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = _toDeg(Math.atan2(y, x));
    return 360 - ((brng + 360) % 360);
}

/**
 * Since not all browsers implement this we have our own utility that will
 * convert from degrees into radians
 *
 * @param deg - The degrees to be converted into radians
 * @return radians
 */
function _toRad(deg) {
    return deg * Math.PI / 180;
}

/**
 * Since not all browsers implement this we have our own utility that will
 * convert from radians into degrees
 *
 * @param rad - The radians to be converted into degrees
 * @return degrees
 */
function _toDeg(rad) {
    return rad * 180 / Math.PI;
}

/**
 * Round the distance up to 2 decimals
 *
 * @param num
 * @returns {number}
 */
function roundDistance(num){
    return (Math.round(num * 100) / 100);
}

/**
 * To integer
 *
 * @param number
 * @returns {number}
 */
function toInteger(number){
    return Math.round(  // round to nearest integer
        Number(number)    // type cast your input
    );
};