var _globals = {};
var HelloWorldLayer = _globals.game = InteractiveTopDownLayer.extend({
    customEvents: {onCreateAttackable: []},
    ctor:function () {
        this._super();
        _globals.game = this;

        //TODO: where should i put this strange global cache thing?
        _globals.spriteCache = cc.spriteFrameCache;
        cc.spriteFrameCache.addSpriteFrames(res.thief);
        cc.spriteFrameCache.addSpriteFrames(res.slime);


        var gameMap = this.gameMap = new GameMap(new cc.TMXTiledMap(res.smallMap), "obstructions");
        _globals.gameMap = gameMap;

        var thief = this.createInteractive(Thief, {
            x: 32,
            y: 32,
        });

        var monster = this.createAttackable(Slime, {
            x: 32*15,
            y: 32*1,
        }, thief);

        var monster2 = this.createAttackable(Slime, {
            x: 32*1,
            y: 32*15,
        }, thief);

        var self = this;
        var respawnAfterDeath = function() {
            setTimeout(function() {
                var max = 18 * 32;
                var margins = 32;
                
                var newMonster = self.createAttackable(Slime, {
                    x: Math.random() * (max - (margins * 2)) + margins,
                    y: Math.random() * (max - (margins * 2)) + margins,
                }, thief);
                console.log('added new rat: ', newMonster);
                newMonster.onRemove(respawnAfterDeath);
                self.addChild(newMonster);
            }, 2000);
        };

        monster.onRemove(respawnAfterDeath);
        monster2.onRemove(respawnAfterDeath);

//            BubbleText.quickPrint('Hello!', character, {panOffset: {x: 0, y: 64}});
        thief.onFenceEnter('monster', 64*10, function(monster, distance) {
            BubbleText.quickPrint('Hey look! A monster!', thief, {panOffset: {x: 0, y: 64}});
        });

        thief.onFenceExit('monster', 128, function(monster, distance) {
            BubbleText.quickPrint('I just wanted hugs...', monster, {panOffset: {x: 0, y: 64}});
        });

        this.onClick(function(touches, event) {
            thief.attacks.forEach(function(attack) {
                if(attack.currentTarget)
                    attack.disengage(thief, attack.currentTarget);
            });
            gameMap.move(thief, touches[0].getLocation(), thief.speed); //speed is seconds per tile
            console.log('point', MathHelper.isPointInsideRect(touches[0], monster), touches[0]);
        });

        this.addChild(this.gameMap.tiledMap);
        this.addChild(thief);
        this.addChild(monster);
        this.addChild(monster2);

        console.log('monster locations: ', monster.x, monster.y, monster2.x, monster2.y);

        this.addOnHoverEffect();

/*
            //TODO: When im ready to put in particle effects, this works, but ill need to learn more about it.
            var effect = new cc.ParticleFlower();
            effect.texture = cc.textureCache.addImage("res/particle-stars.png");
            effect.setShapeType(cc.ParticleSystem.STAR_SHAPE);
            effect.x = 300;
            effect.y = 300;
            effect.initWithTotalParticles(1000);
            effect.setDuration(5);
            effect.setStartColor(new cc.Color(1,0,0,1));
            this.addChild(effect);
*/

        //cc.audioEngine.playMusic(res.bg_music, true);
        //cc.audioEngine.setMusicVolume(0.6);

        return true;
    },
    createAttackable: function(Character, location, thief) {
        var attackableCharacter = this.createInteractive(Character, location);
        /*
        attackableCharacter.onSelect(function() {
            thief.attacks.forEach(function(attack) {
                if(attack.currentTarget)
                    attack.disengage(thief, attack.currentTarget);
            });
            thief.attacks.forEach(function(attack) {
                attack.engage(thief, attackableCharacter);
            });
        }, true);
        */
        this.customEvents.onCreateAttackable.forEach(function(cb) { cb(attackableCharacter) }); 
        return attackableCharacter;
    },
    onCreateAttackable: function(cb) {
        this.customEvents.onCreateAttackable.push(cb);
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

