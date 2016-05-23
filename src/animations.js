var Animations = {
    frames: {
        thief: {
            walking: {
                up: [
                    'walk-back-1.png',
                    'walk-back-2.png',
                    'walk-back-3.png',
                    'back.png',
                    'walk-back-5.png',
                    'walk-back-6.png',
                    'walk-back-5.png',
                    'back.png',
                ],
                right: [
                    'walk-right-1.png',
                    'walk-right-2.png',
                    'walk-right-3.png',
                    'walk-right-4.png',
                    'walk-right-5.png',
                    'walk-right-6.png',
                    'right.png',
                ],
                //TODO: make left frames.Copy, paste, rename, flip
                left: [
                    'walk-left-1.png',
                    'walk-left-2.png',
                    'walk-left-3.png',
                    'walk-left-4.png',
                    'walk-left-5.png',
                    'walk-left-6.png',
                    'left.png',
                ],
                down: [
                    'walkfront1.png',
                    'walkfront2.png',
                    'walkfront3.png',
                    'thief.png',
                    'walkfront5.png',
                    'walkfront6.png',
                    'walkfront5.png',
                    'thief.png',
                ],
            },
            attacking: {
                up: [
                    'basicattack-back-1.png',
                    'basicattack-back-2.png',
                    'basicattack-back-3.png',
                    'basicattack-back-2.png',
                    'back.png',
                ],
                right: [
                    'basicattack-right-1.png',
                    'basicattack-right-2.png',
                    'basicattack-right-3.png',
                    'basicattack-right-2.png',
                    'right.png',
                ],
                left: [
                    'basicattack-left-1.png',
                    'basicattack-left-2.png',
                    'basicattack-left-3.png',
                    'basicattack-left-2.png',
                    'left.png',
                ],
                down: [
                    'basicattack-front-1.png',
                    'basicattack-front-2.png',
                    'basicattack-front-3.png',
                    'basicattack-front-4.png',
                    'basicattack-front-3.png',
                    'basicattack-front-2.png',
                    'thief.png',
                ],
            },
        },
        slime: {
            walking: {
                all: [
                    'walk-1.png',
                    'walk-2.png',
                    'walk-3.png',
                    'walk-2.png',
                    'walk-1.png',
                    'slime.png',
                ],
            },
            attacking: {
                all: [
                    'slime.png',
                    'attack-1.png',
                    'attack-2.png',
                    'attack-3.png',
                    'attack-4.png',
                    'attack-3.png',
                    'attack-2.png',
                ],
            },
        },
    },

    //if iterations is null, then repeat
    getAnimation: function(frames, duration, iterations) {
        var cachedFrames = frames.map(function(frame) {
            return cc.spriteFrameCache.getSpriteFrame(frame);
        });

        var animation;
        //TODO: if animations don't appear to be animating, then that may be because I need to compute the second parameter instead
        //If, then: (frames, duration / frames.length)
        //console.log('stuff: ', cachedFrames);
        animation = cc.Animate.create(cc.Animation.create(cachedFrames, duration/frames.length, iterations));

        return animation;
    },
};
