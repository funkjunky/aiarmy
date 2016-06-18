var eventIncrement = 0;
var Interactive = cc.Sprite.extend({
    orientation: 'down',
    eventsInteractivesInRange: {},
    onRemoveFncs: null,
    speed: 0.5,
    ctor: function(resource, tags) {
        this._super(resource);

        this.ignoreAnchorPointForPosition(true);
        this.setAnchorPoint(cc.p(0.5,0.5));
        console.log('anchors: ', this.ignoreAnchor, this.anchorX, this.anchorY);

        this.tags = [];
        this.selectEvents = [];
        this.fenceEvents = []; //Note: Handled by interactive-top-down-layer
        this.onRemoveFncs = [];

        if(tags)
            this.tags = tags;

        this.scheduleUpdate();

        //TODO: find a simpler way to do events, or make my own event wrapper.
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touches, event) {
                for(var i=0; i!=this.selectEvents.length; ++i)
                    this.selectEvents[i](touches[0].getLocation());
            }.bind(this),
        }, this);
    },

    onSelect: function(cb, stopPropagation) {
        this.selectEvents.push(function(point) {
            if(MathHelper.isPointInsideRect(point, this)) {
                cb(point);
                if(stopPropagation)
                    __stopPropagation = true;
            }
        }.bind(this));
    },
    onFenceEnter: function(tagOrInteractive, range, cb) {
        var event = {type: 'onEnter', range: range, cb: cb, id: ++eventIncrement};
        if(typeof tagOrInteractive == 'string')
            event.tag = tagOrInteractive;
        else
            event.interactive = tagOrInteractive;

        this.fenceEvents.push(event);
        this.eventsInteractivesInRange[eventIncrement] = [];
        return event;
    },
    onFenceExit: function(tagOrInteractive, range, cb) {
        var event = {type: 'onExit', range: range, cb: cb, id: ++eventIncrement};
        if(typeof tagOrInteractive == 'string')
            event.tag = tagOrInteractive;
        else
            event.interactive = tagOrInteractive;

        this.fenceEvents.push(event);
        this.eventsInteractivesInRange[eventIncrement] = [];
        return event;
    },

    removeAsInteractive: function() {
        //console.log('removing this from parent.' + this.__instanceId);
        this.onRemoveFncs.forEach(function(fnc) {
            fnc(this);
        }, this);
        this.removeFromParent();
    },

    onRemove: function(cb) {
        this.onRemoveFncs.push(cb);
    },
});
