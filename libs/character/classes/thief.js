var Thief = Leveler.extend({
    name: 'thief',
    ctor: function(level) {
        this._super(null, ['thief', 'player'], level); //TODO: need a better resource manager than 'res'
        var spriteframe = cc.spriteFrameCache.getSpriteFrame('thief.png');
        this.initWithSpriteFrame(spriteframe);
        this.maxHp = this.hp = 200;

        this.speed = 320;   //travels this.speed pixels per second

        this.registerAttack(new BasicAttack(this, {
            range: 32 * 2,
            attackCooldown: 1,
            attackAnimationCooldown: 0.5,
            animationFrames: {
                baseName: 'basicattack',
                noOrientation: false,
                frames: 3,
            },
        }, {
            baseDamage: 5,
        }));

        this.fx = {
            animations: Animations.frames[this.name],
            sounds: {attackFinished: res[this.name + '_sfx']},
            fxFnc: function(attackInstance, victim) {
                var effect = new cc.ParticleFlower();
                effect.texture = cc.textureCache.addImage("res/particle-stars.png");
                effect.setShapeType(cc.ParticleSystem.STAR_SHAPE);
                effect.initWithTotalParticles(200);
                effect.setDuration(0.4);
                effect.setStartColor(new cc.Color(1,0,0,1));
                effect.setPosition(victim.y, victim.y);
                effect.setAnchorPoint(0, 0);
                victim.addChild(effect);
            },
        };

        var seekMethods = MethodSeek();
        this.seek = seekMethods.seek;
        this.cancelSeek = seekMethods.cancelSeek;
        this.doNewSeek = seekMethods.doNewSeek;

        var fullAttackMethods = MethodFullAttack();
        this.fullAttack = fullAttackMethods.fullAttack;
        //TODO: is cancelFullAttack necessary when I have cancel attack? Perhaps I should simply replace cancel attack to include additional code for also canceling full attack?
        this.cancelFullAttack = fullAttackMethods.cancelFullAttack;

        RelentlessAttack(this, this.attacks[0]);
        //AttackSelected(this, this.attacks[0]); //TODO: handled in src/app.js
        DoubleAttack(this, this.attacks[0], 0.5);
        this.attackClosest = AttackClosest(this, 'monster');
    },
});
