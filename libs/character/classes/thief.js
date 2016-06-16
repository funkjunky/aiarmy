var Thief = Leveler.extend({
    name: 'thief',
    ctor: function(level) {
        this._super(null, ['thief'], level); //TODO: need a better resource manager than 'res'
        var spriteframe = cc.spriteFrameCache.getSpriteFrame('thief.png');
        this.initWithSpriteFrame(spriteframe);
        this.hp = 200;

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
            /*
            new BasicAttack(this, {
                range: 32 * 6,
                attackCooldown: 3,
                attackAnimationCooldown: 0.5,
                animationFrames: {
                    baseName: 'basicattack',
                    noOrientation: false,
                    frames: 3,
                },
            }, {
                baseDamage: 8,
            }),
            */

        //this.modules.push(EngageFirst(this));
        //this.modules.push(SeekToEngage());
        this.modules.push(MethodSeek(this));
        this.modules.push(FullAttack(this, this.attacks[0]));
        this.modules.push(RelentlessAttack(this, this.attacks[0]));
        this.modules.push(AttackSelected(this, this.attacks[0]));
        this.modules.push(DoubleAttack(this, this.attacks[0], 0.5));
        /*
        this.modules.push(MutuallyExclusiveAttacks(this.attacks, function comp(a, b) {
            //console.log('dps: ', a.getDps(), b.getDps());
            return a.getDps() > b.getDps();
        }));
        */
    },
});
