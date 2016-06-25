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
        var thief2 = this.createInteractive(Thief, {
            x: 128,
            y: 128,
        });
        thief2.setColor(new cc.Color(255,0,255,1));

        //TODO: separate this code up... it's all the code that represents the base game... it'll end up being a lot... time to split it up a little
        var selectedCharacter = thief;
        cc.director.getScheduler().pauseTarget(thief.attackClosest);
        this.onClick(function(touches, event) {
            if(selectedCharacter.attacks[0].activeAttack)
                selectedCharacter.cancelAttack(selectedCharacter.attacks[0].activeAttack)

            gameMap.move(selectedCharacter, touches[0].getLocation(), selectedCharacter.speed); //speed is seconds per tile
        });
        this.onHold(function() {
            selectedCharacter.onHoldEnter.call(selectedCharacter);
        }, function() {
            selectedCharacter.onHoldExit.call(selectedCharacter);
        }, 500);

        var selectedEnemy = null;
        this.onCreateAttackable(function(attackableCharacter) {
            //console.log('creating on select... ', attackableCharacter);
            attackableCharacter.onSelect(function(point) {
                if(selectedEnemy == attackableCharacter && selectedCharacter.attacks[0].activeAttack && !selectedCharacter.attacks[0].activeAttack.done())
                    return;

                selectedEnemy = attackableCharacter;

                selectedCharacter.fullAttack(selectedCharacter.attacks[0], selectedEnemy);
            }, true);

            attackableCharacter.onHold(
                selectedCharacter.onEnemyHoldEnter.bind(attackableCharacter),
                selectedCharacter.onEnemyHoldExit.bind(attackableCharacter),
                500,
                true
            );

            attackableCharacter.onExit(function() {
                selectedEnemy = null;
                this._super(); //TODO: god this is ugly... if this is actually how you do it, the perhaps make a wrapper to hide the code
            });
        });

        thief.onSelect(function(point) {
            selectedCharacter = thief;
            cc.director.getScheduler().pauseTarget(thief.attackClosest);

            cc.director.getScheduler().resumeTarget(thief2.attackClosest);
        });

        thief2.onSelect(function(point) {
            selectedCharacter = thief2;
            cc.director.getScheduler().pauseTarget(thief2.attackClosest);

            cc.director.getScheduler().resumeTarget(thief.attackClosest);
        });


        var monster = this.createAttackable(Slime, {
            x: 32*15,
            y: 32*1,
        });

        var monster2 = this.createAttackable(Slime, {
            x: 32*1,
            y: 32*15,
        });

        var self = this;
        var respawnAfterDeath = function() {
            setTimeout(function() {
                var max = 18 * 32;
                var margins = 32;
                
                var newMonster = self.createAttackable(Slime, {
                    x: Math.random() * (max - (margins * 2)) + margins,
                    y: Math.random() * (max - (margins * 2)) + margins,
                });
                //console.log('added new rat: ', newMonster);
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

        this.addChild(this.gameMap.tiledMap);
        this.addChild(thief);
        this.addChild(thief2);
        this.addChild(monster);
        this.addChild(monster2);

        //console.log('monster locations: ', monster.x, monster.y, monster2.x, monster2.y);

        this.addOnHoverEffect();

            //TODO: When im ready to put in particle effects, this works, but ill need to learn more about it.
            /*
            var effect = new cc.ParticleFlower();
            effect.texture = cc.textureCache.addImage("res/particle-stars.png");
            effect.setShapeType(cc.ParticleSystem.STAR_SHAPE);
            effect.initWithTotalParticles(1000);
            effect.setDuration(5);
            effect.setStartColor(new cc.Color(1,0,0,1));
            effect.x = 0;
            effect.y = 0;
            effect.setPosition(150, 0);
            this.addChild(effect);
            */

        //cc.audioEngine.playMusic(res.bg_music, true);
        //cc.audioEngine.setMusicVolume(0.6);

        return true;
    },
    createAttackable: function(Character, location) {
        var attackableCharacter = this.createInteractive(Character, location);
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

