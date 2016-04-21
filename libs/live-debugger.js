var LiveDebugger;
(function() {
    var layer;
    var keyedText = {};
    var count = 0;
    
    LiveDebugger = {
        setLayer: function(theLayer) {
            layer = theLayer;
        },
        set: function(key, text) {
            if(!keyedText[key])
                LiveDebugger._createNode(key);
            keyedText[key].setString(text);
        },

        _createNode: function(key) {
            keyedText[key] = new cc.LabelTTF('.', 'Verdana', 24);
            keyedText[key].attr({x: 0, y: ++count * 25});
            keyedText[key].setAnchorPoint(0,0);
            layer.addChild(keyedText[key], 999);
        },
    };
}());
