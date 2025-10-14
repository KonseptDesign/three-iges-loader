import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { IGESLoader } from "../src/IGESLoader";
import "./main.css";

let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let gui: GUI;

interface GUIData {
  currentURL: string;
}

const guiData: GUIData = {
  currentURL: "/point.iges",
};

THREE.Object3D.DEFAULT_UP = new THREE.Vector3(0, 0, -1);

init();

function init(): void {
  const container = document.getElementById("container");
  if (!container) return;

  // Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 200, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  controls.screenSpacePanning = true;

  // Window resize
  window.addEventListener("resize", onWindowResize, false);

  // Load initial IGES file
  loadIGES(guiData.currentURL);

  // Create GUI
  createGUI();
}

function createGUI(): void {
  if (gui) gui.destroy();

  gui = new GUI({ width: 350 });

  gui
    .add(guiData, "currentURL", {
      point: "/point.iges",
      line: "/line.iges",
    })
    .name("IGES File")
    .onChange(update);

  function update(): void {
    loadIGES(guiData.currentURL);
  }
}

function loadIGES(url: string): void {
  console.log("Loading IGES file:", url);

  // Create new scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb0b0b0);

  // Add grid helper
  const helper = new THREE.GridHelper(160, 10);
  scene.add(helper);

  // Loading manager
  const manager = new THREE.LoadingManager();
  manager.onProgress = (item, loaded, total) => {
    console.log("Loading:", item, `${loaded}/${total}`);
  };

  // Load IGES
  const loader = new IGESLoader(manager);

  loader.load(
    url,
    (geometry) => {
      scene.add(geometry);
      render();
    },
    undefined,
    (error) => {
      console.error("Error loading IGES file:", error);
    }
  );
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function render(): void {
  renderer.render(scene, camera);
}
