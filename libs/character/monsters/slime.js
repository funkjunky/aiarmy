var Slime = Monster.extend({
    exp: 5,
    name: 'slime',
    ctor: function() {
        this._super(null, ['slime', 'liquid']);
        var spriteframe = cc.spriteFrameCache.getSpriteFrame('slime.png');
        this.initWithSpriteFrame(spriteframe);

        this.maxHp = this.hp = 30;

        this.speed = 192; //pixels per second

        this.registerAttack(new BasicAttack(this, {
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
        }));

        var seekMethods = MethodSeek();
        this.seek = seekMethods.seek;
        this.cancelSeek = seekMethods.cancelSeek;
        this.doNewSeek = seekMethods.doNewSeek;

        var fullAttackMethods = MethodFullAttack();
        this.fullAttack = fullAttackMethods.fullAttack;
        //TODO: is cancelFullAttack necessary when I have cancel attack? Perhaps I should simply replace cancel attack to include additional code for also canceling full attack?
        this.cancelFullAttack = fullAttackMethods.cancelFullAttack;

        AttacksBack(this, this.attacks[0]);
        //this.modules.push(SeekToEngage());
    },
});
