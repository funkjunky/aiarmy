var DoubleAttack = function(character, attack, chance) {
    var doubled = false;
    //TODO: proper way: new tag event system. Pass an array, and any can match.
    Event.subscribe('preparingAttack', attack, function(data) {
        if(Math.random() < chance && !doubled) {      //if chance has it...
            doubled = true;
            data.attackInstance.attackCooldown = 0; //instantly prepared!
        } else
            doubled = false;
    });

    return {};
};
