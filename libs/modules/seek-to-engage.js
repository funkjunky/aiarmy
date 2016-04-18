var SeekToEngage = function() {
    return {
        engage: function(theAttack, enemy) {
            console.log('theAttack, enemy: ', arguments);
            this.seek(enemy);
        },
    };
};
