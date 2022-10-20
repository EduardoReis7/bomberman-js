kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1]
});

const MOVE_SPEED = 120;
const ENEMY_SPEED = 60;

loadRoot('./assets/sprites/');

loadSprite('wall-steel', 'wall-steel.png');
loadSprite('brick-red', 'brick-red.png');
loadSprite('door', 'door.png');
loadSprite('bomb', 'bomb.png');
loadSprite('bg', 'bg.png');

loadSprite('wall-gold', 'wall-gold.png');
loadSprite('brick-wood', 'brick-wood.png');
loadSprite('bomberman', 'bomberman.png', {
    sliceX: 7,
    sliceY: 4,
    anims: {
        //stopped
        idleLeft: {from: 21, to: 21},
        idleRight: {from: 7, to: 7},
        idleUp: {from: 0, to: 0},
        idleDown: {from: 14, to: 14},
        
        //move
        moveLeft: {from: 22, to: 27},
        moveRight: {from: 8, to: 13},
        moveUp: {from: 1, to: 6},
        moveDown: {from: 15, to: 20}
    }
});

loadSprite('bomb', 'bomb.png', {
    sliceX: 3,
    anims: {
        move: {from: 0, to: 2}
    }
});

loadSprite('explosion', 'explosion.png', {
    sliceX: 5,
    sliceY: 5
})

loadSprite('baloon', 'baloon.png', {sliceX: 3});
loadSprite('ghost', 'ghost.png', {sliceX: 3});
loadSprite('slime', 'slime.png', {sliceX: 3});

scene('game', ({level, score}) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const maps = [
        [
            'aaaaaaaaaaaaaaa',
            'azzzz  *zzzzzda',
            'azazazazazazaza',
            'azzzzzzzzzzzzza',
            'azazazazazaza a',
            'azzzz* zzzzzz}a',
            'azazazazazaza a',
            'a zzzzzzzzzzz a',
            'a azazazazazaza',
            'a  zzzdzzzzzzza',
            'a azazazazazaza',
            'azzzzzzzzzzzzza',
            'azazazazazazaza',
            'azzzzz   &   za',
            'aaaaaaaaaaaaaaa',
          ],
          [
            'bbbbbbbbbbbbbbb',
            'bwwww  *wwwwwpb',
            'bwbwbwbwbwbwbwb',
            'b      *      b',
            'bwbwbwbwbwbwb b',
            'bwwww* wwwwwwwb',
            'bwbwbwbwb bwb b',
            'b wwwpwww}www b',
            'b bwbwbwb bwbwb',
            'b  wwwwwwwwwwwb',
            'b bwbwbwbwbwbwb',
            'bwww  &   wwwwb',
            'bwbwbwbwbwbwbwb',
            'bwwwww   &   wb',
            'bbbbbbbbbbbbbbb',
          ]
    ];

    const levelCfg = {
        width: 26,
        height: 26,
        a: [sprite('wall-steel'), 'wall-steel', solid(), 'wall'],
        z: [sprite('brick-red'), 'wall-brick', solid(), 'wall'],
        d: [sprite('brick-red'), 'wall-brick-door', solid(), 'wall'],
        b: [sprite('wall-gold'), 'wall-gold', solid(), 'wall'],
        w: [sprite('brick-wood'), 'wall-brick', solid(), 'wall'],
        p: [sprite('brick-wood'), 'wall-brick-door', solid(), 'wall'],
        t: [sprite('door'), 'door', 'wall'],
        '}': [sprite('ghost'), 'ghost', 'dangerous', {dir: -1, time: 0}],
        '&': [sprite('slime'), 'slime', 'dangerous', {dir: -1, time: 0}],
        '*': [sprite('baloon'), 'baloon', 'dangerous', {dir: -1, time: 0}]
    }

    const gameLevel = addLevel(maps[level], levelCfg);

add([sprite('bg'), layer('bg')])

    const scoreLabel = add([
        text('Score: ' + score),
        pos(400, 30),
        layer('ui'),
        {
            value: score
        },
        scale(1)
    ]);

    add([text('Level: ' + parseInt(level + 1)), pos(400, 60), scale(1)])

    const player = add([
        sprite('bomberman', {
            animeSpeed: 0.1,
            frame: 14
        }),
        pos(20, 190),
        { dir: vec2(1,0)}
    ]);

    // Action player
    player.action(() => {
        player.pushOutAll();
    });

    // Movimento do personagem
    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0),
        player.dir = vec2(-1, 0)
    });

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0),
        player.dir = vec2(1, 0)
    });

    keyDown('up', () => {
        player.move(0, -MOVE_SPEED),
        player.dir = vec2(0, -1)
    });

    keyDown('down', () => {
        player.move(0, MOVE_SPEED),
        player.dir = vec2(0, 1)
    });


    //Troca de sprites do personagem principal durante movimento
    keyPress('left', () => {
        player.play('moveLeft')
    });

    keyPress('right', () => {
        player.play('moveRight')
    });

    keyPress('up', () => {
        player.play('moveUp')
    });

    keyPress('down', () => {
        player.play('moveDown')
    });


    //Troca de sprite para estado "parado", quando jogador soltar a tecla
    keyRelease('left', () => {
        player.play('idleLeft');
    });

    keyRelease('right', () => {
        player.play('idleRight');
    });

    keyRelease('up', () => {
        player.play('idleUp');
    });

    keyRelease('down', () => {
        player.play('idleDown');
    });

    keyPress('space', () => {
        spawnBomb(player.pos.add(player.dir.scale(0)));
    })

    // Actions inimigos
    action('baloon', (s) => {
        s.pushOutAll();
        s.move(s.dir * ENEMY_SPEED, 0);
        s.time -= dt();
        if (s.timer <= 0) {
            s.dir = -s.dir;
            s.time = rand(5)
        }
    });

    action('slime', (s) => {
        s.pushOutAll();
        s.move(s.dir * ENEMY_SPEED, 0);
        s.time -= dt();
        if (s.timer <= 0) {
            s.dir = -s.dir;
            s.time = rand(5)
        }
    });

    action('ghost', (s) => {
        s.pushOutAll();
        s.move(0, s.dir * ENEMY_SPEED);
        s.time -= dt();
        if (s.timer <= 0) {
            s.dir = -s.dir;
            s.time = rand(5)
        }
    });

    // Functions

    function spawnExplosion(p, frame) {
        const obj = add([
            sprite('explosion', {
                animeSpeed: 0.1,
                frame: frame
            }),
            pos(p),
            scale(1.5),
            'explosion'
        ])

        obj.pushOutAll();
        wait(0.5, () => {
            destroy(obj);
        })
    }

    function spawnBomb(p) {
        const obj = add([sprite('bomb'), ('move'), pos(p), scale(1.5), 'bomb']);
        obj.pushOutAll();
        obj.play('move');

        wait(4, () => {
            destroy(obj);

            obj.dir = vec2(1, 0);
            spawnExplosion(obj.pos.add(obj.dir.scale(0)), 12) // center

            obj.dir = vec2(0, -1);
            spawnExplosion(obj.pos.add(obj.dir.scale(20)), 2) // up

            obj.dir = vec2(0, 1);
            spawnExplosion(obj.pos.add(obj.dir.scale(20)), 22) // down

            obj.dir = vec2(-1, 0);
            spawnExplosion(obj.pos.add(obj.dir.scale(20)), 10) // left

            obj.dir = vec2(1, 0);
            spawnExplosion(obj.pos.add(obj.dir.scale(20)), 14) // right

        })
    }

    // Colisoes
    player.collides('door', (d) => {
        go("game", {
            level: (level + 1) % maps.length,
            score: scoreLabel.value
        })
    });

    collides('explosion', 'dangerous', (k, s) => {
        camShake(4);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);
        scoreLabel.value++;
        scoreLabel.text = "Score: " + scoreLabel.value;
    });

    collides('explosion', 'wall-brick', (k, s) => {
        camShake(4);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);
    });

    collides('baloon', 'wall', (s) => {
        s.dir = -s.dir;
    });
    
    collides('slime', 'wall', (s) => {
        s.dir = -s.dir;
    });

    collides('ghost', 'wall', (s) => {
        s.dir = -s.dir;
    });

    collides('explosion', 'wall-brick-door', (k, s) => {
        camShake(4);
        wait(1, () => {
            destroy(k);
        });
        destroy(s);
        gameLevel.spawn('t', s.gridPos.sub(0, 0));
    });

    player.collides('dangerous', () => {
        go('lose', {score: scoreLabel.value});
    });

    player.collides('explosion', () => {
        wait(0.25, () => {
            go('lose', {score: scoreLabel.value});
        });
        
    });

});

scene('lose', ({score}) => {
    add([text('Score: ' + score, 32), origin('center'), pos(width() / 2, height() / 2)]);

    keyPress('space', () => {
        go('game', {level: 0, score: 0});
    })
})

go('game', {level: 0, score: 0});