// main functions
/**
 * Search the CSSOM for a specific -webkit-keyframe rule
 *
 * @param rule
 * @returns {*}
 */
function findKeyframesRule(rule)
{
    // gather all stylesheets into an array
    var ss = document.styleSheets;

    // loop through the stylesheets
    for (var i = 0; i < ss.length; ++i) {

        // loop through all the rules
        for (var j = 0; j < ss[i].cssRules.length; ++j) {

            // find the -webkit-keyframe rule whose name matches our passed over parameter and return that rule
            if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule)
                return ss[i].cssRules[j];
        }
    }

    // rule not found
    return null;
}

/**
 * remove old keyframes and add new ones
 *
 * @param anim
 * @param degrees
 */
function changeAnim(anim, degrees)
{
    // find our -webkit-keyframe rule
    var keyframes = findKeyframesRule(anim);

    // remove the existing from and to rules
    keyframes.deleteRule("from");
    keyframes.deleteRule("to");

    // init local storage
    if (localStorage.getItem("lastPosition") === null) {
        localStorage.setItem("lastPosition", 90);
    }

    var lastPosition = localStorage.getItem("lastPosition");

    // create new from and to rules with random numbers
    keyframes.insertRule("from { -webkit-transform: rotate(" + lastPosition + "deg) translate(-95px) rotate(-" + lastPosition + "deg); }");
    keyframes.insertRule("to { -webkit-transform: rotate(" + degrees + "deg) translate(-95px) rotate(-" + degrees + "deg); }");

    localStorage.setItem("lastPosition", degrees);

    // assign the animation to our element (which will cause the animation to run)
    document.getElementById('drop-compass').style.webkitAnimationName = anim;
}

/**
 * Change Compass
 *
 * @param degrees
 */
function changeCompass(degrees)
{
    // remove the old animation from our object
    document.getElementById('drop-compass').style.webkitAnimationName = "none";

    // call the change method, which will update the keyframe animation
    setTimeout(function(){changeAnim("rot", degrees);}, 0);
}

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