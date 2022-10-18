kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1]
});

loadRoot('./assets/sprites/');

loadSprite('wall-steel', 'wall-steel.png');
loadSprite('brick-red', 'brick-red.png');
loadSprite('door', 'door.png');
loadSprite('kaboom', 'kaboom.png');
loadSprite('bg', 'bg.png');

loadSprite('wall-gold', 'wall-gold.png');
loadSprite('brick-wood', 'brick-wood.png');

scene('game', () => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const maps = [
        [
            'aaaaaaaaaaaaaaa',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'aaaaaaaaaaaaaaa',
        ]
    ];

    const levelCfg = {
        width: 26,
        height: 26,
        a: [sprite('wall-steel'), 'wall-steel', solid(), 'wall'],
        z: [sprite('brick-red'), 'wall-brick', solid(), 'wall'],
        d: [sprite('brick-red'), 'wall-brick-dool', solid(), 'wall'],
        b: [sprite('wall-gold'), 'wall-gold', solid(), 'wall'],
        w: [sprite('brick-wood'), 'wall-brick', solid(), 'wall'],
        p: [sprite('brick-wood'), 'wall-brick-dool', solid(), 'wall'],
        t: [sprite('door'), 'door', 'wall'],
    }

    const gameLevel = addLevel(maps[0], levelCfg);
})

go('game');