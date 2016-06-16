var DoubleAttack = function(character, attack, chance) {
    //doubled, is necessary, so we don't triple, qudruple, etc. An attack can only happen a second time.
    var doubled = false;
    //TODO: proper way: new tag event system. Pass an array, and any can match.
    Event.subscribe('attackFinished', attack, function(data) {
        Event.subscribeOnce('preparingAttack', attack, function(data) {
            if(Math.random() < chance && !doubled) {      //if chance has it...
                doubled = true;
                data.attackInstance.attackCooldown = 0; //instantly prepared!
            } else
                doubled = false;
        });
    });

    return {};
};
