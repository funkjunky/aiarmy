var AttacksBack = function(character, attack) {
    Event.subscribe('attackTaken', character, function(data) {
        attack.fullAttack(data.attacker);
    });
    return {};
};
