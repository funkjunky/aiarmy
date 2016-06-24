function GameMap(tiledMap, blockedTag) {
    this.tiledMap = tiledMap;
    this.blockedTag = blockedTag;
    console.log('created a new GameMap', this.tiledMap);
};

//TODO: I think this should be in TopDownLayer instead...
//Speed is in pixels per second
GameMap.prototype.move = function(character, loc, speed, howClose, cb) {
    if(pointsEqual(this.getCoords(character), this.getCoords(loc)))
        return null;
    if(character.aMoveAction && !character.aMoveAction.isDone())
        character.stopAction(character.aMoveAction);
    //console.log('from, to: ', this.getCoords(character), this.getCoords(loc));
    var path = this.getAStar(this.getCoords(character), this.getCoords(loc), howClose);
    //console.log('path: ', path);
    if(!path.length)
        return null;

    //setup all the things
    var moves = [];
    var orientations = [];
    var animations = [];

    var lastPoint = path.splice(0,1)[0];   //remove the starting point from the path.
    var lastOrientation = character.orientation;
    var durationCarryOver = 0;
    path.forEach(function(point, index) {
        //calculate duration for movement and duration
        var duration = (MathHelper.dist(point, lastPoint)*64) / speed;

        //push move
        moves.push(cc.MoveTo.create(duration, this.adjustedScreenCoords(point)));

        var orientation = getOrientation(point, lastPoint, lastOrientation);
        if(orientation == lastOrientation)
            durationCarryOver += duration;
        else {
            //push animation
            //First iteration we only bank.
            if(durationCarryOver) {
                //TODO: make a left animation. I guess we'll do the flipping outselves as extras.
                var adjustedOrientation = (lastOrientation == 'left')?'right':lastOrientation;
                //TODO: animation needs to run until we switch orientations, currently we run it once. Also below.
                //TODO: don't hardcode the speed of the walk...
                var frames = (Animations.frames[character.name].walking.all)
                    ? Animations.frames[character.name].walking.all
                    : Animations.frames[character.name].walking[adjustedOrientation];
                //console.log('frames: ', frames);
                animations.push(Animations.getAnimation(frames, 0.5, duration + durationCarryOver));
            }

            //push orientation
            orientations = orientations.concat([cc.DelayTime.create(durationCarryOver), cc.CallFunc.create(function(newOrientation) {
                this.orientation = newOrientation;
            }.bind(character, orientation))]);
            durationCarryOver = duration;
        }
        
        lastOrientation = orientation;
        lastPoint = point;
    }, this);
    //because animations is always lagged by one iteration. (so if orientation doesn't change we keep building up the move animation duration)
    //TODO: way too much code duplication... also this is getting crazy complicated... too much code.
    var frames = (Animations.frames[character.name].walking.all)
        ? Animations.frames[character.name].walking.all
        : Animations.frames[character.name].walking[lastOrientation];
    //console.log('last frames: ', frames, character.name, lastOrientation);
    animations.push(Animations.getAnimation(frames, 0.5, 1));

    if(cb)
        moves.push(cc.CallFunc.create(cb));
    //NOTE: sequence gobbles up the move. So moves well be empty after giving it to sequence.
    character.aMoveAction = cc.sequence(moves);

    if(orientations.length)
        character.runAction(cc.sequence(orientations));
    character.runAction(cc.sequence(animations));
    return character.runAction(character.aMoveAction);
};

function getOrientation(point, lastPoint, lastOrientation) {
    var deltax = point.x - lastPoint.x;
    var deltay = point.y - lastPoint.y;

    //Note: this is complicated because if we were going up, and now we're going up-left, then there is no point switchin to left... just keep doing up
    var orientation;
    if(deltax > 0 && (deltay == 0 || lastOrientation == 'right' || lastOrientation == 'left'))
        orientation = 'right';
    else if(deltax < 0 && (deltay == 0 || lastOrientation == 'right' || lastOrientation == 'left'))
        orientation = 'left';
    else if(deltay > 0 && (deltax == 0 || lastOrientation == 'down' || lastOrientation == 'up'))
        orientation = 'up';
    else if(deltay < 0 && (deltax == 0 || lastOrientation == 'up' || lastOrientation == 'down'))
        orientation = 'down';
    else
        throw "orientation code screwed up... this shouldn't happen";

    return orientation;
}

GameMap.prototype.getCoords = function(screenLoc) {
    return {
        x: Math.floor((screenLoc.x + 2) / this.tiledMap.tileWidth),
        y: Math.floor((screenLoc.y + 2) / this.tiledMap.tileHeight),
    };
};

GameMap.prototype.screenCoords = function(mapLoc) {
    return {
        x: mapLoc.x * this.tiledMap.tileWidth + (this.tiledMap.tileWidth / 2),
        y: mapLoc.y * this.tiledMap.tileHeight + (this.tiledMap.tileHeight / 2),
    };
};

GameMap.prototype.adjustedScreenCoords = function(mapLoc) {
    return {
        x: mapLoc.x * this.tiledMap.tileWidth,
        y: mapLoc.y * this.tiledMap.tileHeight,
    };
};

//Note: this only gets the inside rect of the tile. This is to avoid constant collisions. It makes the math easier, etc as well.
GameMap.prototype.getRectFromMapLoc = function(mapLoc) {
    return {
        x: (mapLoc.x * this.tiledMap.tileWidth) + 1,
        y: (mapLoc.y * this.tiledMap.tileHeight) + 1,
        width: this.tiledMap.tileWidth - 2,
        height: this.tiledMap.tileHeight - 2,
    };
};

GameMap.prototype.getScreenTileCoords = function(screenLoc) {
    var mapCoords = this.getCoords(screenLoc);
    return {
        x: mapCoords.x * this.tiledMap.tileWidth,
        y: mapCoords.y * this.tiledMap.tileHeight,
    };
};

//g --- calculated distance from start
//h --- calculated estimated length of path
GameMap.prototype.getAStar = function(mapLocBegin, mapLocEnd, howClose) {
    //console.log('pathing: ', mapLocBegin, mapLocEnd, howClose);
    //TODO: use a clone function
    mapLocBegin = {
        x: mapLocBegin.x,
        y: mapLocBegin.y,
    };
    mapLocEnd = {
        x: mapLocEnd.x,
        y: mapLocEnd.y,
    };
    mapLocBegin.g = mapLocBegin.f = 0;
    var closedList = [];
    var openList = [mapLocBegin];

    var count = 0;
    var maxCount = 300
    while(openList.length > 0) {
        if(++count > maxCount) {
            console.error('AStar went over '+maxCount+', too complicated of a path'); break;
        }
        //grab cheapest estimated node to process next
        var currentIndex = 0;
        for(var i = 1; i < openList.length; ++i)
            if(openList[i].f < openList[currentIndex].f)
                currentIndex = i;
        var currentNode = openList[currentIndex];

        //end case -> result has been found
        if((howClose && (MathHelper.dist(currentNode, mapLocEnd) * 64) <= howClose) || pointsEqual(currentNode, mapLocEnd)) {
            var curr = currentNode;
            var ret = [];
            while(curr) {
                ret.push(curr);
                curr = curr.parent;
            }
            return ret.reverse();
        }

        //normal case -> move currentNode from open to closed, process each of its neighbors
        openList.splice(currentIndex, 1);
        closedList.push(currentNode);
        var neighbors = this.getNeighbors(currentNode, closedList);
        
        for(var i = 0; i < neighbors.length; ++i) {
            //this may be a source of slow down... calculating sqrt often.
            var distanceFromNeighbor = MathHelper.dist(currentNode, neighbors[i]);
            var shortestDistance = currentNode.g + distanceFromNeighbor;   //1 is one more space
            var gScoreIsBest = false;

            //calculate distance from start
            neighbors[i].g = currentNode.g + distanceFromNeighbor;
            //calculate estimated length of path
            neighbors[i].f = neighbors[i].g + MathHelper.dist(neighbors[i], mapLocEnd);
            //set parent
            neighbors[i].parent = currentNode;

            //!foundIndex means it's the first time visiting the node.
            var foundIndex = openList.findIndex(pointsEqual.bind(null, neighbors[i]));
            //console.log('foundIndex: ', foundIndex);
            if(foundIndex == -1 || neighbors[i].f < openList[foundIndex].f) {
                //console.log('new openList node: ', neighbors[i]);
                openList.push(neighbors[i]);
                //if found, but our node was simply better, then we need to remove the old worst node.
                if(foundIndex != -1)
                    openList.splice(foundIndex, 1);
            }
            //neighbors[i].debug = "F: " + neighbors[i].f + "<br />G: " + neighbors[i] + "<br />h: " + neighbors[i].h;
        }
    }

    console.log('found no path.');
    return [];
};

GameMap.prototype.getNeighbors = function(point, closedList) {
    var circleOfPoints = [
        {x: point.x + 1 , y: point.y + 1},
        {x: point.x + 1 , y: point.y    },
        {x: point.x + 1 , y: point.y - 1},
        {x: point.x     , y: point.y - 1},
        {x: point.x - 1 , y: point.y - 1},
        {x: point.x - 1 , y: point.y    },
        {x: point.x - 1 , y: point.y + 1},
        {x: point.x     , y: point.y + 1},
    ];

    return circleOfPoints.filter(function(neighbor) {
        return closedList.findIndex(pointsEqual.bind(null, neighbor)) == -1
            && !this.isBlocked(neighbor);
    }.bind(this));
}

//TODO: Code specific to cocos2D and Tiled. it'd be nice if I could plug this into my AStar toolkit
GameMap.prototype.isBlocked = function(mapLoc) {
    //off the map.
    if(mapLoc.x < 0 || mapLoc.y < 0 || mapLoc.x >= this.tiledMap.mapWidth || mapLoc.y >= this.tiledMap.mapHeight)
        return true;

    for(var k=0; k!=this.tiledMap.objectGroups.length; ++k) {
        var objGroup = this.tiledMap.objectGroups[k];
        //TODO: I should use properties instead of the groupName. So it's more generic and i can have multiple object layers blocking. Or maybe doing other things as well.
        if(objGroup.groupName == this.blockedTag)
            for(var i=0; i!=objGroup._objects.length; ++i)
                if(MathHelper.areRectsIntersecting(this.getRectFromMapLoc(mapLoc), objGroup._objects[i]))
                    return true;
    }

    return false;
};

function pointsEqual(a, b) {
    return a.x == b.x && a.y == b.y;
}
