function RelentlessAttack(character, attack) {
    Event.subscribe('preparingAttack', attack, function(data) {
        console.log('relenentless preparing');
        Event.subscribeOnce('attackFinished', data.attackInstance, function(data) {
            console.log('relenentless FINISHED', data.victim.hp);
            if(data.victim.hp > 0) //as long as target is still alive, then do another full attack
                attack.fullAttack(data.victim);
        });
    });
    return {};
};
