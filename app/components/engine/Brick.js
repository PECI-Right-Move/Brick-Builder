import v4 from 'uuid';

import { mergeMeshes } from 'utils/threejs';
import { CSSToHex, shadeColor } from 'utils';
import { width, height, depth, base } from 'utils/constants';


const knobSize = 7;


export default class Brick extends THREE.Mesh {
  constructor(intersect, color) {
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: CSSToHex(color),
      // specular: CSSToHex(shadeColor(color, -20)),
      // shininess: 5,
      metalness: 0.4,
      roughness: 0.5,
    });
    const props = createMesh(cubeMaterial);
    super(...props);

    this.position.copy( intersect.point ).add( intersect.face.normal );
    this.position.divide( new THREE.Vector3(base, height, base) ).floor()
      .multiply( new THREE.Vector3(base, height, base) )
      .add( new THREE.Vector3( base, height / 2, base ) );
    this.castShadow = true;
    this.receiveShadow = true;
    this.customId = v4();
    this.defaultColor = cubeMaterial.color;
  }

  updateColor(color) {
    this.material.setValues({ color: CSSToHex(color) });
    this.defaultColor = this.material.color;
  }
}


function createMesh(material) {
  let meshes = [];
  const cubeGeo = new THREE.BoxGeometry( width, height, depth );
  const cylinderGeo = new THREE.CylinderGeometry( knobSize, knobSize, knobSize, 20);

  const mesh = new THREE.Mesh(cubeGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const positions = [
    {x: 13, y: 25 / 1.5, z: - 13},
    {x: - 13, y: 25 / 1.5, z: 13},
    {x: - 13, y: 25 / 1.5, z: - 13},
    {x: 13, y: 25 / 1.5, z: 13}
  ];

  // const positions = [
  //   {x: (width / 4) - knobSize, y: 25 / 1.5, z: depth / 4},
  //   {x: (width / 4) - knobSize, y: 25 / 1.5, z: - depth / 4},
  //   // {x: width / 4, y: 25 / 1.5, z: width / 4},
  //   // {x: width / 4, y: 25 / 1.5, z: - width / 4},
  // ];

  for (var i = 0; i < positions.length; i++) {
    const cylinder = new THREE.Mesh(cylinderGeo, material);

    cylinder.position.x = positions[i].x;
    cylinder.position.y = positions[i].y;
    cylinder.position.z = positions[i].z;

    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    meshes.push( cylinder );
  }

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}
