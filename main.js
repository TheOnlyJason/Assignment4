import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, -8);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);


class Texture_Rotate {
    vertexShader() {
        return `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `;
    }

    fragmentShader() {
        return `
        uniform sampler2D uTexture;
        uniform float animation_time;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            // TODO: 2.c Rotate the texture map around the center of each face at a rate of 8 rpm.


            // TODO: 1.b Load the texture color from the texture map
            // Hint: Use texture2D function to get the color of the texture at the current UV coordinates

            // vec4 tex_color = vec4(1.0, 0.0, 0.0, 1.0);
            // vec4 texColor = texture2D(uTexture, vUv); // Sample the texture color
            
            // TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
            // Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
            //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)
            
            float angle =-animation_time * 4.0 * 3.14159 / 15.0; // 8 RPM = 4π/15 rad/sec
            vec2 centeredUV = vUv - vec2(0.5, 0.5);
            vec2 rotatedUV;
            rotatedUV.x = centeredUV.x * cos(angle) - centeredUV.y * sin(angle);
            rotatedUV.y = centeredUV.x * sin(angle) + centeredUV.y * cos(angle);
            rotatedUV += vec2(0.5, 0.5);
            // vec4 texColor = texture2D(uTexture, rotatedUV);

            float u = mod(rotatedUV.x, 1.0);
            float v = mod(rotatedUV.y, 1.0);


            vec4 texColor = texture2D(uTexture, rotatedUV);
            
            if(v < 0.85 && v > .15 && u < 0.85 && u > 0.75){
                texColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
            if(v < 0.85 && v > .15 && u < 0.25 && u > 0.15){
                texColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
            if(v < 0.25 && v > .15 && u < 0.85 && u > 0.15){
                texColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
            if(v < 0.85 && v > .75 && u < 0.85 && u > 0.15){
                texColor = vec4(0.0, 0.0, 0.0, 1.0);
            }

            gl_FragColor = texColor;
        }
        `;
    }
}


class Texture_Scroll_X {
    vertexShader() {
        return `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `;
    }

    fragmentShader() {
        return `
        uniform sampler2D uTexture;
        uniform float animation_time;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            // TODO: 2.a Shrink the texuture by 50% so that the texture is repeated twice in each direction
            vec2 scaledUV = vUv * 2.0; // Scale to shrink the texture by 50%


            // TODO: 2.b Translate the texture varying the s texture coordinate by 4 texture units per second,
            float scroll_speed = -4.0;
            scaledUV.x += animation_time * scroll_speed; // Apply horizontal scrolling



            // TODO: 1.b Load the texture color from the texture map
            // Hint: Use texture2D function to get the color of the texture at the current UV coordinates
            // vec4 tex_color = vec4(0.0, 1.0, 0.0, 1.0);
            // vec4 texColor = texture2D(uTexture, vUv); // Sample the texture color

            // TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
            // Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
            //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)
            // Offset the UV coordinates for scrolling

            

            float u = mod(scaledUV.x, 1.0);
            float v = mod(scaledUV.y, 1.0);


            vec4 texColor = texture2D(uTexture, scaledUV);
            
            if(v < 0.85 && v > .15 && u < 0.85 && u > 0.75){
                texColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
            if(v < 0.85 && v > .15 && u < 0.25 && u > 0.15){
                texColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
            if(v < 0.25 && v > .15 && u < 0.85 && u > 0.15){
                texColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
            if(v < 0.85 && v > .75 && u < 0.85 && u > 0.15){
                texColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
        

            // Set the fragment color
            gl_FragColor = texColor;
        }
        `;
    }
}

let animation_time = 0.0;

const cube1_geometry = new THREE.BoxGeometry(2, 2, 2);

const textureLoader = new THREE.TextureLoader();

// TODO: 1.a Load texture map
const cube1_texture = textureLoader.load('assets/stars.png');
// cube1_texture 

// TODO: 1.c Apply Texture Filtering Techniques to Cube 1
// Nearest Neighbor Texture Filtering
// e.g. cube1_texture.minFilter = ...

cube1_texture.magFilter = THREE.NearestFilter;
cube1_texture.minFilter = THREE.NearestFilter;

cube1_texture.wrapS = THREE.RepeatWrapping;
cube1_texture.wrapT = THREE.RepeatWrapping;


// TODO: 2.a Enable texture repeat wrapping for Cube 1

const cube1_uniforms = {
    uTexture: { value: cube1_texture },
    animation_time: { value: animation_time }
};
const cube1_shader = new Texture_Rotate();
const cube1_material = new THREE.ShaderMaterial({
    uniforms: cube1_uniforms,
    vertexShader: cube1_shader.vertexShader(),
    fragmentShader: cube1_shader.fragmentShader(),
});

const cube1_mesh = new THREE.Mesh(cube1_geometry, cube1_material);
cube1_mesh.position.set(2, 0, 0)
scene.add(cube1_mesh);

const cube2_geometry = new THREE.BoxGeometry(2, 2, 2);

// TODO: 1.a Load texture map
const cube2_texture = textureLoader.load('assets/earth.gif');;
// cube2_texture =

// TODO: 1.c Apply Texture Filtering Techniques to Cube 2
// Linear Mipmapping Texture Filtering
// e.g. cube2_texture.minFilter = ...
cube2_texture.wrapS = THREE.RepeatWrapping;
cube2_texture.wrapT = THREE.RepeatWrapping;

cube2_texture.magFilter = THREE.LinearFilter;
cube2_texture.minFilter = THREE.LinearMipmapLinearFilter;

// TODO: 2.a Enable texture repeat wrapping for Cube 2


const cube2_uniforms = {
    uTexture: { value: cube2_texture },
    animation_time: { value: animation_time }
};
const cube2_shader = new Texture_Scroll_X();
const cube2_material = new THREE.ShaderMaterial({
    uniforms: cube2_uniforms,
    vertexShader: cube2_shader.vertexShader(),
    fragmentShader: cube2_shader.fragmentShader(),
});

const cube2_mesh = new THREE.Mesh(cube2_geometry, cube2_material);
cube2_mesh.position.set(-2, 0, 0)
scene.add(cube2_mesh);

const clock = new THREE.Clock();
let lastElapsedTime = 0;


let isRotating = false; // Initially, the cubes are not rotating
let cube1RotationTime = 0; // Accumulated rotation time for Cube #1
let cube2RotationTime = 0; // Accumulated rotation time for Cube #2


function animate() {
    controls.update();

    // TODO: 2.b&2.c Update uniform values
    // e.g. cube1_uniforms.animation_time.value = ...
    const elapsedTime = clock.getElapsedTime();

    const deltaTime = elapsedTime - lastElapsedTime; // Time since last frame
    lastElapsedTime = elapsedTime;


    cube1_uniforms.animation_time.value = elapsedTime; // Update Cube #1
    cube2_uniforms.animation_time.value = elapsedTime; // Update Cube #2

    // TODO: 2.e Rotate the cubes if the key 'c' is pressed to start the animation
    // Cube #1 should rotate around its own X-axis at a rate of 15 rpm.
    // Cube #2 should rotate around its own Y-axis at a rate of 40 rpm
    if (isRotating) {
        // Cube #1: Rotate around X-axis at 15 RPM (convert RPM to radians/sec)
        const cube1Speed = (15 * 2 * Math.PI) / 60; // radians per second
        cube1RotationTime += deltaTime;
        cube1_mesh.rotation.x = -1 * cube1RotationTime * cube1Speed;

        // Cube #2: Rotate around Y-axis at 40 RPM
        const cube2Speed = (40 * 2 * Math.PI) / 60; // radians per second
        cube2RotationTime += deltaTime;
        cube2_mesh.rotation.y = cube2RotationTime * cube2Speed;
    }


    renderer.render(scene, camera);
}



renderer.setAnimationLoop(animate);

// TODO: 2.e Keyboard Event Listener
// Press 'c' to start and stop the rotating both cubes
window.addEventListener('keydown', onKeyPress);
function onKeyPress(event) {
    switch (event.key) 
    {
        case 'c': // Toggle cube rotation
            isRotating = !isRotating;
            break;
        // Add other cases if needed
        default:
            break;
    }
}

