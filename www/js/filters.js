angular.module('starter.filters', [])

/**
 * nl2br function
 */
.filter("nl2br", function($filter) {
    return function(data) {
        var breakTag = '<br>';

        if (!data) return data;
        return (data + '')
            .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, breakTag);
    };
});