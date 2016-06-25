var __stopPropagation = false; //TODO: eventually get rid of this global.

var TopDownLayer = cc.Layer.extend({
    gameMap: null,
    _stopPropagation: false,
    ctor: function() {
        this._super();

        LiveDebugger.setLayer(this);
        //LiveDebugger.set('test', 'HELLO WORLD');
    },
    onClick: function(cb) {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded: function(touches, event) {
                //allows selects to not bubble to global clicks.
                if(__stopPropagation) {
                    __stopPropagation = false;
                    return;
                }
                cb.bind(this)(touches, event);
            }.bind(this),
        }, this);
    },
    onHold: function(enterFnc, exitFnc, delay, holdFnc) {
        var holdHappened = holdEnded = false;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touches, event) {
                //allows selects to not bubble to global clicks.
                if(__stopPropagation) {
                    __stopPropagation = false;
                    return;
                }
                delay = delay || 0;
                holdEnded = false;
                setTimeout(function() {
                    if(holdEnded) //hold ended prematurely
                        return;
                    holdHappened = true;
                    if(enterFnc)
                        enterFnc.bind(this)(touches, event);
                }.bind(this), delay);
            }.bind(this),
            onTouchesEnded: function(touches, event) {
                holdEnded = true;
                if(holdHappened) {
                    holdHappened = false;
                    if(exitFnc)
                        exitFnc.bind(this)(touches, event);
                    __stopPropagation = true;
                }
            }.bind(this),
        }, this);
    },
    createGraphic: function(resource, opacity) {
        var graphic = new cc.Sprite(resource);

        graphic.setAnchorPoint(0,0);

        if(opacity)
            graphic.setOpacity(opacity);

        return graphic;
    },
    addOnHoverEffect: function() {
        var cursor = this.createGraphic(res.cursor, 75);
        cursor.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.5), cc.TintTo.create(0.3, 255, 128, 128), cc.TintTo.create(0.3, 255,255,255))));
        this.addChild(cursor);

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event) {
                screenLoc = event.getLocation();
                cursor.setPosition(this.gameMap.getScreenTileCoords(screenLoc));
            }.bind(this),
        }, this);
    },
});
