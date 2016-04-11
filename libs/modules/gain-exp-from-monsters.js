var GainExpFromMonsters = function() {
    return {
        enemyDefeated: function(enemy) {
            if(enemy.exp)
                this.gainExp(enemy.exp);
        },
    };
};
