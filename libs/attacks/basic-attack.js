//TODO: do i even need the constructor? Perhaps I can have a blank function, then set the constructor to the Attack function?
var BasicAttack = function(owner, props, attrs) {
    Attack.call(this, owner, props, attrs); 
};

BasicAttack.prototype = Object.create(Attack.prototype);
BasicAttack.prototype.constructor = BasicAttack;

BasicAttack.prototype.finishAttack = function() {
    this.currentTarget.trigger('takeAttack', {dmg: this.attrs.baseDamage}, this)
    Attack.prototype.finishAttack.call(this);
};
