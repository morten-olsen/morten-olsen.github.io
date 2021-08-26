// https://redstapler.co/cool-nebula-background-effect-three-js/

import * as THREE from 'three';
import React, { useEffect } from 'react';

const setup = () => {
  let scene, camera, renderer;
  let cloudParticles = [];

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight,1,1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;
    let ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    scene.fog = new THREE.FogExp2(0x03544e, 0.001);
    renderer.setClearColor(scene.fog.color);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = -1;
    renderer.domElement.style.opacity = 1;

    document.body.appendChild(renderer.domElement);
    addParticles();
    addLights();
    render();
  }

  const addParticles = () => {
    let loader = new THREE.TextureLoader();
    loader.load("/images/smoke.png", (texture) => {
      const cloudGeo = new THREE.PlaneBufferGeometry(500,500);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map:texture,
        transparent: true
      });
      for(let p=0; p<50; p++) {
        let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
          Math.random()*800 -400,
          500,
          Math.random()*500-500
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random()*2*Math.PI;
        cloud.material.opacity = 0.55;
        cloudParticles.push(cloud);
        scene.add(cloud);
      }
    });
  }

  const addLights = () => {
    let directionalLight = new THREE.DirectionalLight(0xff8c19);
    directionalLight.position.set(0,0,1);
    scene.add(directionalLight);

    let orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
    orangeLight.position.set(200,300,100);
    scene.add(orangeLight);
    let redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
    redLight.position.set(100,300,100);
    scene.add(redLight);
    let blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
    blueLight.position.set(300,300,200);
    scene.add(blueLight);
  };

  function render() {
    cloudParticles.forEach(p => {
      p.rotation.z -=0.001;
    });
    renderer.render(scene,camera);
    requestAnimationFrame(render);
  }

  init();
};

const Background: React.FC<{}> = () => {
  useEffect(() => {
    setup();
  }, []);
  return <></>  
};

export default Background;
