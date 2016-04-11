var Monster = Battler.extend({
    exp: 1,
    ctor: function(resource, tags) {
        tags.push('monster');
        this._super(resource, tags);
    },
});
