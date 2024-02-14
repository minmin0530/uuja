class Game {
    constructor(socket) {

        let roomid = null;
        let currentPlayerColor = null;
        let currentPlayerPositionZ = 0;
        let currentPlayerId = null;
        let memberColor = [];
        let memberMesh = [];
        let memberSpeed = [];
        let memberId = [];
        let z = -2;

        socket.on('connected', data => {
            console.log("connected" + data);
        });

        socket.on('getUserId', data => {
            console.log(data);
        });

        socket.on('updateRoomData', data => {
            console.log('updateRoomData');
            console.log(data);
            let i = 0;
            roomid = data._id;
            for (const color of data.membercolor) {
                let exist = false;
                for (const existColor of memberColor) {
                    if (color == existColor) {
                        exist = true;
                        break;
                    }
                }
                if (exist == false) {
                    memberId.push( data.memberid[i] );
                    if (currentPlayerColor == color) {
                        currentPlayerId = data.memberid[i]
                        currentPlayerPositionZ = z;
                        camera.position.set(-110, 4, currentPlayerPositionZ);
                        camera.lookAt(-100, 4, currentPlayerPositionZ);
                        player     = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: color } ) );
                        player.position.set(-100, 1, z);
                        scene.add(player);
                        memberColor.push(color);                    
                        memberMesh.push(player);
                        memberSpeed.push(0);
                    } else {

                        const enemy     = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: color } ) );
                        enemy.position.set(-100, 1, z);
                        scene.add(enemy);
                        memberColor.push(color);
                        memberMesh.push(enemy);
                        memberSpeed.push(0);
                    }
                    z -= 2;
                    i += 1;
                }
            }
        });
        socket.on('pushUpKey', data => {
            let i = 0;
            for (const id of memberId) {
                if (data.id == id) {
                    memberSpeed[i] += 0.01;
                    memberMesh[i].position.x += memberSpeed[i];
                }
                // if (data.id == currentPlayerId) {
                //     camera.position.x = memberMesh[i].position.x - 10;
                //     camera.lookAt.x = memberMesh[i].position.x;

                // }
                i += 1;
            }
        });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    const starttime = document.createElement("time");
    var START_TIME;// = (new Date("2022-08-30 22:30:00")).getTime();
    var playerColor;
    var player;
    starttime.innerHTML = "";
    starttime.style.color = "#00ff00";
    starttime.style.position = "absolute";
    starttime.style.top = "150px";
    starttime.style.textAlign = "center";
    starttime.style.width = "100%";
    starttime.style.fontSize = "60px"
    document.body.appendChild( starttime );

    fetch("/gametime").then(res => res.json()).then(data => {
        START_TIME = new Date(data.time.substring(0, 10) + " " + data.time.substring(10, 18)).getTime();
        currentPlayerColor = data.color;
        // player     = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: data.color } ) );
        // player.position.set(-100, 1, -10);
        // scene.add( player );
        console.log(data);
        socket.emit('getUserId', data);
    });

    // const datetime = document.createElement("time");
    // datetime.innerHTML = Date.now();
    // datetime.style.color = "red";
    // datetime.style.position = "absolute";
    // datetime.style.top = "200px";
    // datetime.style.textAlign = "center";
    // datetime.style.width = "100%";
    // datetime.style.fontSize = "60px"
    // document.body.appendChild( datetime );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const backgroundMaterials = [
        new THREE.MeshBasicMaterial( { color: 0xbbbbbb } ),
        new THREE.MeshBasicMaterial( { color: 0xaaaaaa } ),
        new THREE.MeshBasicMaterial( { color: 0x999999 } ),
        new THREE.MeshBasicMaterial( { color: 0x888888 } ),
        new THREE.MeshBasicMaterial( { color: 0x777777 } ),
        new THREE.MeshBasicMaterial( { color: 0x666666 } ),
        new THREE.MeshBasicMaterial( { color: 0x555555 } ),
        new THREE.MeshBasicMaterial( { color: 0x444444 } ),
    ];
    const hardleMaterials = [
        new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
        new THREE.MeshBasicMaterial( { color: 0x00dd00 } ),
        new THREE.MeshBasicMaterial( { color: 0x00bb00 } ),
        new THREE.MeshBasicMaterial( { color: 0x009900 } ),
    ];
    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set(100, 100, 100);
    scene.add( light );

    const floor = [];
    const wall = [];

    // const enemy1 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );
    // const enemy2 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) );
    // const hardle  = [];
    // for (let i = 0; i < 25; ++i) {
    //     hardle.push( new THREE.Mesh( geometry, hardleMaterials[ Math.floor(Math.random() * 4) ] ) );
    // }
    // enemy1.position.set(-100, 1, -4);
    // enemy2.position.set(-100, 1, -7);

    // let xx = 0;
    // let yy = 0;
    // for (const h of hardle) {
    //     h.position.set(-80 - xx * 1.2, 1 + yy * 1.2, -10);
    //     xx += 1;
    //     if (xx >= 5) {
    //         yy += 1;
    //         xx = 0;
    //     }
    //     scene.add( h );
    // }

    // scene.add( enemy1 );
    // scene.add( enemy2 );

    for (let z = -10; z < 0; ++z) {
    for (let x = -100; x < 500; ++x) {
        const cube = new THREE.Mesh( geometry, backgroundMaterials[ Math.floor(Math.random() * 8) ] );
        cube.position.set(x * 1.2, 0, z * 1.2);
        scene.add( cube );
        floor.push( cube )
    }
    }

    for (let y = 0; y < 15; ++y) {
    for (let x = -100; x < 500; ++x) {
        const cube = new THREE.Mesh( geometry, backgroundMaterials[ Math.floor(Math.random() * 8) ] );
        cube.position.set(x * 1.2, y * 1.2, -10 * 1.2);
        scene.add( cube );
        wall.push( cube )
    }
    }
    

    let jumpSpeed = 0;



    let playerBottomHitPosition = 1;

    let enemy1Speed = 0.0;
    let enemy2Speed = 0.0;
    let enemy2SpeedSpeed = 0.009;
    let playerSpeed = 0.0;
    let isGroundHit = true;
    let isBottomHit = false;
    let isLeftHit = false;
    let isRightHit = false;
    let isLeftKey = false;
    let isRightKey = false;
    document.addEventListener('keydown', event => onDocumentKeyDown(event), false);
    document.addEventListener('keyup', event => onDocumentKeyUp(event), false);
    window.addEventListener('resize', event => onWindowResize(event), false);

    function onDocumentKeyUp(event) {
        switch (event.keyCode) {
    
        case 16: break;
        case 40:
          isLeftKey = false;
          break;
        case 38: 
          isRightKey = false;
          break;

        case 37:  break; //left
        case 39:  break; //right
        }
    }
    function onDocumentKeyDown(event) {
      
        switch (event.keyCode) {
    
        case 16: break; 
        case 40:
            isLeftKey = true;
            break;
        case 38:
            isRightKey = true;
            break;
        case 37:  break; //left
        case 39:  break; //right

        case 90: //z
            if (isGroundHit) {
                jumpSpeed = 1;
                player.position.y += jumpSpeed;
                isGroundHit = false;
            }
            break;
        }
    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize(window.innerWidth, window.innerHeight);    
    }

    function hitcheckRight() {
        for (const h of hardle) {
            if (h.position.x - 0.5 >= player.position.x && player.position.x + 0.5 >= h.position.x - 0.5 &&
                h.position.y + 0.5 >= player.position.y - 0.5 && player.position.y >= h.position.y - 0.5) {
                isRightHit = true;
                break;
            }
        }
    }

    function hitcheckLeft() {
        for (const h of hardle) {
            if (h.position.x + 0.5 >= player.position.x - 0.5 && player.position.x >= h.position.x + 0.5 &&
                h.position.y + 0.5 >= player.position.y - 0.5 && player.position.y >= h.position.y - 0.5) {
                isLeftHit = true;
                break
            }
        }
    }

    function hitcheckBottom() {
        for (const h of hardle) {
            if (h.position.x + 0.5 >= player.position.x - 0.5 && player.position.x + 0.5 >= h.position.x - 0.5 &&
                h.position.y + 0.5 >= player.position.y - 0.5 && player.position.y >= h.position.y - 0.5) {
                isBottomHit = true;

                playerBottomHitPosition = h.position.y + 1.01;
                player.position.y = playerBottomHitPosition;
                jumpSpeed = 0;
                isGroundHit = true;
                break;
            }
        }

    }
    function animate() {
        requestAnimationFrame( animate );

        let t = String(START_TIME - Date.now());
        starttime.innerHTML = "スタートまで<br>" + t.substring(0, t.length - 3) + "." + t.substring(t.length - 3, t.length) + "秒";

        if (true) {
            // isBottomHit = false;
            // isLeftHit = false;
            // isRightHit = false;
            // if ( player.position.y > 1) {
            //     jumpSpeed -= 0.05;
            //     player.position.y += jumpSpeed;
            // }
            // if (jumpSpeed < 0) {
            //     hitcheckBottom();
            // }

            // if ( player.position.y < 1 ) {
            //     player.position.y = 1;
            //     jumpSpeed = 0;
            //     isGroundHit = true;
            // }

            if ( isLeftKey ) {
//                hitcheckLeft();
                // playerSpeed -= 0.01;
                // if (isLeftHit == false) {
                    // camera.position.x -= playerSpeed;
                    // camera.lookAt.x -= playerSpeed;
                    // player.position.x -= playerSpeed;
                // }
                // player.rotation.x += 0.04;
                // player.rotation.y += 0.04;
            }

            if ( isRightKey ) {
                socket.emit('pushUpKey', {roomid: roomid, id: currentPlayerId, color: currentPlayerColor});
//                hitcheckRight();
                // playerSpeed += 0.01;
                // if (isRightHit == false) {
                // }
                // player.rotation.x += 0.04;
                // player.rotation.y += 0.04;
            }
            camera.position.x = player.position.x - 10;
            camera.lookAt.x = player.position.x;
            // player.position.x += playerSpeed;

            // enemy1Speed += 0.007;
            // enemy1.position.x += enemy1Speed;
            // enemy2Speed += enemy2SpeedSpeed;
            // enemy2.position.x += enemy2Speed;
            // enemy2SpeedSpeed -= 0.00002;
        }
        renderer.render( scene, camera );
    };

    animate();

    }
}