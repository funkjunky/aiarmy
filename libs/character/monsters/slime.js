var Slime = Monster.extend({
    hp: 30,
    exp: 5,
    name: 'slime',
    ctor: function() {
        this._super(null, ['slime', 'liquid']);
        var spriteframe = cc.spriteFrameCache.getSpriteFrame('slime.png');
        this.initWithSpriteFrame(spriteframe);
        this.attacks = [new BasicAttack(this, {
                range: 32 * 2,
                attackCooldown: 2,
                attackAnimationCooldown: 1,
                animationFrames: {
                    baseName: 'basicattack',
                    noOrientation: true,
                    frames: 3,
                },
            }, {
                baseDamage: 2,
            }
        )];

        this.modules.push(AttacksBack());
        this.modules.push(SeekToEngage());
    },
});
