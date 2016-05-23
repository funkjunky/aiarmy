var Thief = Leveler.extend({
    name: 'thief',
    ctor: function(level) {
        this._super(null, ['thief'], level); //TODO: need a better resource manager than 'res'
        var spriteframe = cc.spriteFrameCache.getSpriteFrame('thief.png');
        this.initWithSpriteFrame(spriteframe);
        this.hp = 200;

        this.attacks = [
            new BasicAttack(this, {
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
            }),
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
        ];
        this.modules.push(EngageFirst(this));
        this.modules.push(SeekToEngage());
        this.modules.push(DoubleAttack(0.5));
        this.modules.push(MutuallyExclusiveAttacks(this.attacks, function comp(a, b) {
            //console.log('dps: ', a.getDps(), b.getDps());
            return a.getDps() > b.getDps();
        }));
    },
});
