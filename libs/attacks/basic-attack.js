var BasicAttack = function(props, attrs) {
    Attack.call(this, props, attrs); 
};

BasicAttack.prototype = Object.create(Attack.prototype);
BasicAttack.prototype.constructor = BasicAttack;

BasicAttack.prototype.finishAttack = function(theAttack, victim) {
    //TODO: how do i pass this to modules?
    victim.takeDamage(theAttack.attrs.baseDamage);
    Attack.prototype.finishAttack.call(this, theAttack, victim);
};
