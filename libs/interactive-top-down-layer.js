var InteractiveTopDownLayer = TopDownLayer.extend({
    interactives: [],
    interactivesByTag: {},
    ctor: function() {
        this._super();

        this.scheduleUpdate();
    },
    update: function(dt) {
        this.handleInteractions();
    },
    handleInteractions: function() {
        this.interactives.forEach(function(interactive) {
            interactive.fenceEvents.forEach(function(event) {
                var interactives = (event.interactive)
                    ?   [event.interactive]
                    :   this.interactivesByTag[event.tag] || [];

                interactives.reduceRight(function(col, otherInteractive) { //reduceRight, because i splice in checkEvent.
                    if(interactive != otherInteractive)
                        this.checkEvent(event, interactive, otherInteractive);
                }.bind(this), true);
            }, this);
        }, this);
    },

    //Called: when we check fence events and object isn't in the layer.
    removeInteractive: function(interactive) {
        if(nodeIndex(this.interactives, interactive) == -1) //just in case this gets called twice in the same update.
            return;

        console.log('removing interactive: ', interactive.tags);
        this.interactives.splice(nodeIndex(this.interactives, interactive), 1);
        //Remove from each interactivesByTag
        interactive.tags.forEach(function(tag) {
            this.interactivesByTag[tag].splice(nodeIndex(this.interactivesByTag[tag], interactive), 1);
        }, this);
    },

    checkEvent: function(event, subject, object) {
        var objectIndex = nodeIndex(subject.eventsInteractivesInRange[event.id], object);
        var distance = MathHelper.dist(subject, object);

        var consideredInRange = objectIndex != -1; //object is "inRange" because it's in the array
        var inRange = distance <= event.range && object.parent != null; //object.parent checks whether the node exists anymore. If not call exit function.

        //if the object is no longer int he layer, then we need to remove it from fences.
        if(!object.parent) {
            this.removeInteractive(object);
        }

        if(!(consideredInRange ^ inRange)) //if inRange state is valid, then no need to do anything.
            return;

            console.log('inRange: ', inRange, object.__instanceId);

        if(inRange)
            subject.eventsInteractivesInRange[event.id].push(object);
        else
            subject.eventsInteractivesInRange[event.id].splice(objectIndex);

        if(inRange && event.type == 'onEnter' || !inRange && event.type == 'onExit')
            event.cb(object, distance);
    },

    removeChild: function(child, cleanup) {
        this._super(child, cleanup);
    },

    createInteractive: function(Character, location) {
        var interactive = new Character();

        this.interactives.push(interactive);
        interactive.tags.forEach(function(tag) {
            //TODO: add an array helper to do this in on function. (create array if necessary)
            if(!this.interactivesByTag[tag])
                this.interactivesByTag[tag] = [];

            this.interactivesByTag[tag].push(interactive);
        }, this);

        if(location)
            interactive.attr(this.gameMap.getScreenTileCoords(location));

        return interactive;
    }, 
});

function objInArray(arr, obj) {
    return arr.some(function(item) {
        for(var k in item)
            if(!obj[k] || item[k] != obj[k])
                return false;

        return true;
    });
}

function nodeIndex(arr, node) {
    return arr.findIndex(function(item) {
        return nodesEqual(item, node);
    });
}

function nodesEqual(a, b) {
    return a.__instanceId === b.__instanceId;
}
