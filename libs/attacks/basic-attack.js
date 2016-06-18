//TODO: do i even need the constructor? Perhaps I can have a blank function, then set the constructor to the Attack function?
var BasicAttack = function(owner, props, attrs) {
    Attack.call(this, owner, props, attrs); 
};

BasicAttack.prototype = Object.create(Attack.prototype);
BasicAttack.prototype.constructor = BasicAttack;

BasicAttack.prototype.createAttackInstance = function(target, attrs) {
    var attackInstance = Attack.prototype.createAttackInstance.call(this, target, attrs);
    Event.subscribeOnce('attackFinished', attackInstance, function(data) {
        data.victim.takeAttack({dmg: this[0].attrs.baseDamage}, this[0].attack.owner);
    });

    return attackInstance;
};
