var TestAttack = function(props, attrs) {
  this.prototype = Attack.prototype;  
  Attack.call(this, props, attrs); 
};

TestAttack.prototype.finishAttack = function(victim) {
    console.log('TEST ATTACK FINISHED. Test: ', this.attrs.test);
    victim.takeDamage(this.modifyDamage(2));
};
