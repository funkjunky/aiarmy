var Slime = Monster.extend({
    hp: 30,
    exp: 5,
    ctor: function() {
        this._super(res.mouse, ['rat', 'beast']);
        this.attacks = [new BasicAttack(this, {
                range: 32 * 2,
                attackCooldown: 2,
                attackAnimationCooldown: 1,
            }, {
                baseDamage: 2,
            }
        )];

        this.modules.push(AttacksBack());
        this.modules.push(SeekToEngage());
    },
});
