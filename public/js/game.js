// var fbRef = new firebase ("https://devchata-1410d-default-rtdb.firebaseio.com");
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { Player } from "./player"
var otherPlayers = {};

var playerID;
var player;

function loadGame() {
	// load the environment
	// loadEnvironment();
	// load the player
	initMainPlayer();

	listenToOtherPlayers();

	loadWorld(); 

	window.onunload = function() {
		fbRef.child( "Playerzz/" + playerID ).remove();
	};

	window.onbeforeunload = function() {
		fbRef.child( "Playerzz/" + playerID ).remove();
	};
}

function listenToPlayer( playerData ) {
	if ( playerData.val() ) {
		otherPlayers[playerData.key].setOrientation( playerData.val().orientation.position, playerData.val().orientation.rotation );
	}
}

function listenToOtherPlayers() {
	// when a player is added, do something
	fbRef.child( "Playerzz" ).on( "child_added", function( playerData ) {
		if ( playerData.val() ) {
			if ( playerID != playerData.key && !otherPlayers[playerData.key] ) {
				otherPlayers[playerData.key] = new Player( playerData.key );
				otherPlayers[playerData.key].init();
				fbRef.child( "Playerzz/" + playerData.key ).on( "value", listenToPlayer );
			}
		}
	});

	// when a player is removed, do something

	fbRef.child( "Playerzz" ).on( "child_removed", function( playerData ) {
		if ( playerData.val() ) {
			fbRef.child( "Playerzz/" + playerData.key ).off( "value", listenToPlayer );
			scene.remove( otherPlayers[playerData.key].mesh );
			delete otherPlayers[playerData.key];
		}
	});
}

function initMainPlayer() {

	fbRef.child( "Playerzz/" + playerID ).set({
		isOnline: true,
		orientation: {
			position: {x: 0, y:0, z:0},
			rotation: {x: 0, y:0, z:0}
		}
	});

	

	player = new Player( playerID );
	player.isMainPlayer = true;
	player.init();
}

function loadEnvironment() {



}

function loadWorld() {
	  
	  {
		const planeSize = 10;
	
		var loader = new THREE.TextureLoader();
		var texture = loader.load(public/js/textures/grass.jpg');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		var repeats = planeSize / 1;
		texture.repeat.set(repeats, repeats);
	
		var planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
		var planeMat = new THREE.MeshPhongMaterial({
		  map: texture,
		  side: THREE.DoubleSide,
		});
		var mesh = new THREE.Mesh(planeGeo, planeMat);
		mesh.rotation.x = Math.PI * -.5;
		scene.add(mesh);
	  }
	  
}




	

	
