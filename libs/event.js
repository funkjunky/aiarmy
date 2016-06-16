//Super simple event system
//can subscribe to events and trigger events.
//subscriptions and triggering can be done in general or on an object
//event subscriptions can be turned off and back on again. They start on.

var Event = (function() {
    var events = {};

    var methods = {
        //Note: object can be an array, and it must match the same objects if an array.
        subscribe: function(event, object, callback) {
            if(!events[event])
                events[event] = [];

            events[event].push({
                object: object,
                callback: callback,
            });
        },
        //Note: trigger well return an array of all return values from subscription callbacks
        //Second note: if object is false-y, then all events for all objects well be triggered.
        //Third note: object can be an array, and it must match the same objects if an array.
        trigger: function(event, object, data) {
            console.log('trigger: ', event, events[event]);
            if(!events[event])
                return [];

            var result = events[event].filter(function(subscription) {
                return !subscription.off && objectsMatch(subscription.object, object);
            }).map(function(subscription) {
                var ret = subscription.callback.call(object, data);

                if(subscription.once)
                    subscription.toBeDeleted = true;

                return ret;
            });

            //clean up 'once' subscriptions
            var oldLength = events[event].length;
            events[event] = events[event].filter(function(subscription) {
                return !subscription.toBeDeleted;
            });
            if(oldLength > events[event].length)
                console.log('cleaned events: ', event, events[event].length, oldLength);

            return result;
        },
        subscribeOnce: function(event, object, callback) {
            if(!events[event])
                events[event] = [];

            events[event].push({
                object: object,
                callback: callback,
                once: true,
            });
        },

        turnOff: function(event, object) {
            events[event].filter(function(subscription) {
                return !object || subscription.object === object;
            }).forEach(function(subscription) {
                subscription.off = true;
            });
        },
        turnOn: function(event, object) {
            events[event].filter(function(subscription) {
                return !object || subscription.object === object;
            }).forEach(function(subscription) {
                subscription.off = false;
            });
        },
    };

    function objectsMatch(object1, object2) {
        //console.log('mathing: ', object1, object2);
        if(!object1 || object1 === object2)
            return true;

        if(object1.length && object1.length == object2.length)
            return !object1.some(function(object, index) {
                return object != object2[index];
            });
        else
            return object2 === object1;
            
    }

    return methods;
})();
