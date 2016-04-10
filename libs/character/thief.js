var Thief = Leveler.extend({
    modules: [BasicAttack],
    ctor: function(resource, level) {
        this._super(resource, ['thief'], 100, level);
    },
});
