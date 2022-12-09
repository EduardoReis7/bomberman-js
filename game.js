kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1]
});

const MOVE_SPEED = 120;
const ENEMY_SPEED = 60;

loadRoot('./assets/');

loadSprite('wall-steel', 'sprites/wall-steel.png');
loadSprite('brick-red', 'sprites/brick-red.png');
loadSprite('door', 'sprites/door.png');
loadSprite('bomb', 'sprites/bomb.png');
loadSprite('bg', 'sprites/bg.png');

loadSprite('wall-gold', 'sprites/wall-gold.png');
loadSprite('brick-wood', 'sprites/brick-wood.png');
loadSprite('bomberman', 'sprites/bomberman.png', {
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

loadSprite('bomb', 'sprites/bomb.png', {
    sliceX: 3,
    anims: {
        move: {from: 0, to: 2}
    }
});

loadSprite('explosion', 'sprites/explosion.png', {
    sliceX: 5,
    sliceY: 5
})

loadSprite('baloon', 'sprites/baloon.png', {sliceX: 3});
loadSprite('ghost', 'sprites/ghost.png', {sliceX: 3});
loadSprite('slime', 'sprites/slime.png', {sliceX: 3});

loadSound("boom", "sounds/boom.ogg");
loadSound('ost', 'sounds/ost.wav');
loadSound('ost-win', 'sounds/ost-win.mp3');

function rankingControl(s) {
    const rankList = JSON.parse(localStorage.getItem("rank"));
    rankList.push(s);

    let result = rankList
        .filter((value, index, array) => array.indexOf(value) === index)
        .sort((s1, s2) => {
            if (s1 > s2) return -1;
            if (s1 < s2) return 1;
            return 0;
        }
    );

    localStorage.setItem("rank", JSON.stringify(result));
}

const ost = play('ost', {volume: 0.4, loop: true});

scene('game', ({level, score}) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    ost.play();

    if (!localStorage.getItem("rank")) {
        localStorage.setItem("rank", JSON.stringify([]));
    }

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
        ],
        [
            'aaaaaaaaaaaaaaa',
            'awwww  *wwwwwwa',
            'awa awawawawawa',
            'aww}w  &wwwpwwa',
            'awbwbwbwbwbwb a',
            'awwwwwwwwwwww}a',
            'awawawawawawawa',
            'a  wwwww * wwwa',
            'a bwbwbwbwbwbwa',
            'a  wwww wwwww a',
            'awawawa}wwawa}a',
            'awww  *bwbbbbba',
            'awbWbwbbwww wwa',
            'aww & wbwww}wpa',
            'aaaaaaaaaaaaaaa',
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

    const gameLevel = addLevel(maps[level > 2 ? level - 1 : level], levelCfg);

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
        play('boom', {volume: 0.1, loop: false})
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
        level++;
        if (level > 2) {
            go("win", {score: scoreLabel.value});
        } else {
            go("game", {
                level: level,
                score: scoreLabel.value
            });
        }
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
    rankingControl(score);
    ost.pause();
    add([text('Score: ' + score, 32), origin('center'), pos(width() / 2, height() / 2)]);

    add([text('Pressione SPACE para reiniciar o jogo.', 10), origin('center'), pos(400, 400)]);
    add([text('Pressione ENTER para visualizar o rank.', 10), origin('center'), pos(400, 375)]);

    keyPress('enter', () => go('ranking', {score: score}));
    keyPress('space', () => go('game', {level: 0, score: 0}));
});

//TODO scene ranking
scene('ranking', ({score}) => {
    add([text('Ranking '), origin('center'), pos(400, 100)]);

    const rankList = JSON.parse(localStorage.getItem("rank"));
    let posX = 385;
    let posY = 125;
    for (let i = 0; i < 5; i++) {
        if (rankList[i] === undefined) {
            break;
        }
        add([text(i + 1 + '. ' + rankList[i]), origin('center'), pos(posX, posY += 25)]);
    }

    add([text('Pressione SPACE para reiniciar o jogo.', 10), origin('center'), pos(400, 400)]);

    keyPress('space', () => go('game', {level: 0, score: 0}));
});

scene('win', ({score}) => {
    ost.pause();
    play('ost-win');
    rankingControl(score);
    add([text('Voce ganhou!!!', 40), origin('center'), pos(400, 100)]);
    add([text('Score: ' + score, 28), origin('center'), pos(400, 175)]);

    add([text('Pressione SPACE para reiniciar o jogo.', 10), origin('center'), pos(400, 375)]);
    add([text('Pressione ENTER para visualizar o rank.', 10), origin('center'), pos(400, 350)]);

    keyPress('enter', () => go('ranking', {score: score}));
    keyPress('space', () => go('game', {level: 0, score: 0}));
});

go('game', {level: 0, score: 0});