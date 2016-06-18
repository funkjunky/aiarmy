var InteractiveTopDownLayer = TopDownLayer.extend({
    interactives: [],
    interactivesByTag: {},
    ctor: function() {
        this._super();

        this.scheduleUpdate();
    },
    update: function(dt) {
        //TODO: if lag becomes an issue, I could limit these to every x seconds.
        this.handleInteractions();
        this.handleZIndex();
    },

    handleInteractions: function(interactiveExiting) {
        this.interactives.forEach(function(interactive) {
            interactive.fenceEvents.forEach(function(event) {
                var interactives = (event.interactive)
                    ?   [event.interactive]
                    :   this.interactivesByTag[event.tag] || [];

                interactives.reduceRight(function(col, otherInteractive) { //reduceRight, because i splice in checkEvent.
                    if(interactive != otherInteractive)
                        this.checkEvent(event, interactive, otherInteractive, interactiveExiting == otherInteractive || interactiveExiting == interactive);
                }.bind(this), true);
            }, this);
        }, this);
    },

    handleZIndex: function() {
        var verticallyOrdered = this.interactives.sort(function(a, b) {
            return a.y < b.y;
        });

        var zIndex = 10;
        verticallyOrdered.forEach(function(interactive) {
            interactive.zIndex = ++zIndex;
        });
    },

    //Called: when we check fence events and object isn't in the layer.
    removeInteractive: function(interactive) {
        if(this.interactives.indexOf(interactive) == -1) //just in case this gets called twice in the same update.
            return;

        console.log('handling final interactions...' + interactive.__instanceId);
        //first call handleInteractions with the object to assume out of range, so we exit all events
        this.handleInteractions(interactive);
        console.log('done handling final interactions!');

        //then we remove the interactive from everywhere.
        this.interactives.splice(this.interactives.indexOf(interactive), 1);
        interactive.tags.forEach(function(tag) {
            this.interactivesByTag[tag].splice(this.interactivesByTag[tag].indexOf(interactive), 1);
        }, this);
    },

    checkEvent: function(event, subject, object, assumeOutOfRange) {
        var objectIndex = subject.eventsInteractivesInRange[event.id].indexOf(object);
        var distance = MathHelper.dist(subject, object);

        var consideredInRange = objectIndex != -1; //object is "inRange" because it's in the array
        var inRange = distance <= event.range && !assumeOutOfRange;

        if(!(consideredInRange ^ inRange)) //if inRange state is valid, then no need to do anything.
            return;

        if(inRange)
            subject.eventsInteractivesInRange[event.id].push(object);
        else
            subject.eventsInteractivesInRange[event.id].splice(objectIndex, 1);

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

        interactive.onRemove(function(character) {
            this.removeInteractive(character);
        }.bind(this));

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
