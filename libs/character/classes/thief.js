var Thief = Leveler.extend({
    modules: [DoubleAttack(0.5)],
    ctor: function(level) {
        this._super(res.jane, ['thief'], level); //TODO: need a better resource manager than 'res'
        this.hp = 100;

        this.attacks = [
            new BasicAttack({
                range: 32 * 2,
                attackCooldown: 1,
                attackAnimationCooldown: 1,
            }, {
                baseDamage: 2,
            }),
            new BasicAttack({
                range: 32 * 6,
                attackCooldown: 2,
                attackAnimationCooldown: 2,
            }, {
                baseDamage: 2,
            }),
        ];
        this.modules.push(MutuallyExclusiveAttacks(this.attacks, function comp(a, b) {
            return (a.baseDamage > b.baseDamage) ? a : b;
        });
    },
});
