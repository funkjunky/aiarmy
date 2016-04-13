var BasicAttack = function(props, attrs) {
  this.prototype = Attack.prototype;  
  Attack.call(this, props, attrs); 
};

BasicAttack.prototype.finishAttack = function(theAttack, victim) {
    //TODO: how do i pass this to modules?
    victim.takeDamage(theAttack.attrs.baseDamage);
    Attack.prototype.finishAttack.call(this, theAttack, victim);
};
