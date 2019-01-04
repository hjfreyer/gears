import * as THREE from 'three'
import * as two from 'two'

import * as shapes from './shapes';

const boxWidth = 100
const boxHeight = 20
const boxDepth = 50

interface Punchout {
  shapes: THREE.Shape[]
  thickness: number
}

interface Point {
  x: number
  y: number
}

interface Axle {
  point: Point
  items: Punchout[]
  startingHeight: number
}

interface Assembley {
  axles: Axle[]
}

const axleRadius = 0.125
const punchoutThickness = 0.25

const modulez = 1/4
const n1 = 19
const n2 = 21

const arm1Radius = modulez*(n1+n2)/2
const arm1Padding = 3
const axleClearing = 0.1
const arm2OutsideCircleRadius = 0.375

const arm2Radius = arm1Radius - axleRadius - axleClearing -arm2OutsideCircleRadius;

const innerGearRadius = 7.5;

const gear1 : Punchout = {
  shapes: [gearShape(n1)],
  thickness: punchoutThickness,
}

const gear2 : Punchout = {
  //shapes: [gear22(arm1Radius -innerGearRadius, 17)],
shapes: [gearShape(n2)],
  thickness: punchoutThickness,
}
// const gear2 : Punchout = {
//   shapes: [gear(arm1Radius -innerGearRadius, 2, 17)],
//   thickness: 1,
// }

const arm1 : Punchout = {
  shapes: getArm(arm1Radius, axleRadius, 0.5, 0.5, 0.75),
  thickness: punchoutThickness,
}

const arm2 : Punchout = {
  shapes: getArm(arm2Radius, axleRadius, 0.5, 0.25, arm2OutsideCircleRadius),
  thickness: punchoutThickness,
}


const assembley : Assembley = {
  axles: [
    // {
    //   point: {x: 0, y: 0},
    //   startingHeight: 0,
    //   items: [gear1, gear1, gear1, arm1],
    // },
    // {
    //   point: {x: -arm1Radius, y: 0},
    //   startingHeight: 0,
    //   items: [gear2],
    // },
    // {
    //   point: {x: arm1Radius, y: 0},
    //   startingHeight: 2,
    //   items: [gear2, {shapes: [], thickness: 1}, arm2],
    // },
  ],
};

export interface Scene3D {
  driveGear: THREE.Object3D
  transferGear: THREE.Object3D
  innerArm: THREE.Object3D
  outerArm: THREE.Object3D
}

const theScene: Scene3D = {
  driveGear: new THREE.Group(),
  transferGear: new THREE.Group(),
  innerArm: new THREE.Group(),
  outerArm: new THREE.Group(),
};

let obj = punchOut(arm2);
obj.position.y = 1;
theScene.outerArm.add(obj);
obj = punchOut(gear2);
obj.position.y = 0.5;
theScene.outerArm.add(obj);
obj = getAxle(3);
obj.position.y = 3.5;
theScene.outerArm.add(obj);
theScene.outerArm.position.x = arm1Radius;

obj = punchOut(arm1);
obj.position.y=0.75;
theScene.innerArm.add(obj);
theScene.innerArm.add(theScene.outerArm);

for (let i = 0; i < 3; i++) {
  let o = punchOut(gear1);
  o.position.y = i/4;
  o.rotation.z=Math.PI;
  theScene.transferGear.add(o);
}

obj = punchOut(gear2);
theScene.driveGear.add(obj);
theScene.driveGear.position.x=-arm1Radius;

export function updateRotation(s: Scene3D, alpha: number, beta: number) {
  s.innerArm.rotation.y = alpha;
  s.outerArm.rotation.y = alpha * n1 / n2 - beta;
  s.transferGear.rotation.y = beta * n2 / n1;
  s.driveGear.rotation.y = -beta;
}

function getArm(width: number, ir1: number, or1: number, ir2: number, or2: number): THREE.Shape[] {
  let res : THREE.Shape[] = [];
  let s = new THREE.Shape();
  s.moveTo(width, or2);
  s.lineTo(0, or1);
  s.absarc(0, 0, or1, Math.PI/2, -Math.PI/2, false);
  s.lineTo(width, -or2);
  s.absarc(width, 0, or2, -Math.PI/2, Math.PI/2, false);
/*  s.lineTo(width, holeRadius1+ holePadding);
  s.absarc(width, 0, holeRadius1 + holePadding, Math.PI/2, -Math.PI/2, true);
  s.closePath();*/
  res.push(s);

  s = new THREE.Shape();
  s.moveTo(ir1, 0);
  s.absarc(0, 0, ir1, 0, 2*Math.PI, false);
  res.push(s);

  s = new THREE.Shape();
  s.moveTo(ir2, 0);
  s.absarc(width, 0, ir2, 0, 2*Math.PI, false);
  res.push(s);
  return res;
}

function getPlate(width: number, height: number): THREE.Mesh {
  let g = new THREE.BoxGeometry(width, punchoutThickness, height);
  return new THREE.Mesh(g, new THREE.MeshPhongMaterial({color: 0, transparent: true, opacity: 0.2}));
}

export function getAxle(height: number): THREE.Mesh {
  let g = new THREE.CylinderGeometry( axleRadius, axleRadius, height, 32 );
  let o = new THREE.Mesh(g, new THREE.MeshStandardMaterial( { color: 0x2194CE } ));
  return o;
}

// export function getBox(): THREE.Mesh[] {
//   let top = getPlate(boxWidth, boxDepth);
//   top.position.y = boxHeight + punchoutThickness/2;
//
//   let bottom = getPlate(boxWidth, boxDepth);
//   bottom.position.y = -punchoutThickness/2;
//
//   return [bottom//, top
//   ];
// }

export function gear(radius: number, delta: number, teeth: number): THREE.Shape {
  let res = new THREE.Shape();

  let numPoints = teeth * 2;

  res.moveTo( 0, 0 + radius -delta/2 );
  for (let ptNum = 1; ptNum < numPoints; ptNum++) {
    let angle = Math.PI * 2 / numPoints * ptNum;
    let r2 = radius - delta / 2 + ((ptNum%2)*delta);
    res.lineTo(r2 * Math.sin(angle),  r2 * Math.cos(angle));
  }
  return res;
}

function gear22(n: number, pitchRadius: number, pressureAngle: number): THREE.Shape {
  let module = 2 * pitchRadius / n;

  let fullToothAngle = 2 * Math.PI / n;

  let rootRadius = pitchRadius - module * 1.157
  let outerRadius = pitchRadius + module;
  let baseRadius = pitchRadius * Math.cos(pressureAngle);

  let res = new THREE.Shape();
  res.moveTo(0, pitchRadius);
  res.absarc(0, 0, pitchRadius, 0, 2*Math.PI, false);
  res.moveTo(0, baseRadius);
  res.absarc(0, 0, baseRadius, 0, 2*Math.PI, false);
  res.moveTo(0, rootRadius);
  res.absarc(0, 0, rootRadius, 0, 2*Math.PI, false);
  res.moveTo(0, outerRadius);
  res.absarc(0, 0, outerRadius, 0, 2*Math.PI, false);


  for (let tn = 0; tn < n; tn++) {
    let t0 = tn * fullToothAngle;
    let t1 = t0 + fullToothAngle/2;
    res.moveTo(baseRadius*Math.cos(t0), baseRadius*Math.sin(t0));
    for (let i = 0; i < 200; i++) {
      const t = i / 100;
      let x = baseRadius * (Math.cos(t)+t*Math.sin(t));
      let y = baseRadius * (Math.sin(t)-t*Math.cos(t));
      let r = Math.sqrt(x*x + y*y);
      let theta = Math.atan2(y, x);
      // if (r > 1+2) {
      //   r = 1+2;
      // }

      res.lineTo(r*Math.cos(theta-t0), r* Math.sin(theta-t0));
    }
    res.moveTo(baseRadius*Math.cos(t0), baseRadius*Math.sin(t0));
    res.moveTo(baseRadius*Math.cos(t1), baseRadius*Math.sin(t1));
    for (let i = 0; i < 200; i++) {
      const t = i / 100;
      let x = baseRadius * (Math.cos(t)+t*Math.sin(t));
      let y = baseRadius * (Math.sin(t)-t*Math.cos(t));
      let r = Math.sqrt(x*x + y*y);
      let theta = Math.atan2(y, x);
      // if (r > 1+2) {
      //   r = 1+2;
      // }

      res.lineTo(r*Math.cos(t1-theta), r* Math.sin(t1-theta));
    }
    res.moveTo(baseRadius*Math.cos(t1), baseRadius*Math.sin(t1));
  }

  return res;
}
//
// export function gear3d(radius: number, delta: number, teeth: number): THREE.Mesh {
//   var g = gear(radius, delta, teeth);
//
//   // Create a new geometry by extruding the triangleShape
//   // The option: 'amount' is how far to extrude, 'bevelEnabled: false' prevents beveling
//   var extrudedGeometry = new THREE.ExtrudeGeometry(g, {depth: thickness, bevelEnabled: false});
//   return new THREE.Mesh(extrudedGeometry, new THREE.MeshPhongMaterial({color: 0xff0000}));
// }

function circle(radius: number): THREE.Shape {
  let res = new THREE.Shape();
  res.absarc(0, 0, radius, 0, 2*Math.PI, false);
  return res;
}

function punchOut(p: Punchout): THREE.Object3D {
  let group = new THREE.Group();
  for (const shape of p.shapes) {
  var g = new THREE.ExtrudeGeometry(shape, {depth: p.thickness, bevelEnabled: false});
  //const mesh = new THREE.Mesh(g, new THREE.MeshPhongMaterial({color: 0xff0000}));
  const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({color: 0xff0000}));

  var geo = new THREE.EdgesGeometry( g, 1); // or WireframeGeometry

  var wireframe = new THREE.LineSegments( geo, new THREE.LineBasicMaterial({color: 0xff0000}) );
  group.add(wireframe);
}
  group.rotation.x = -Math.PI/2;

  return group;
}
//
// export function disc(radius): THREE.Mesh {
//   var g = new THREE.CylinderGeometry(radius, radius, thickness, 32);
//
//     // Create a new geometry by extruding the triangleShape
//     // The option: 'amount' is how far to extrude, 'bevelEnabled: false' prevents beveling
//     const mesh = new THREE.Mesh(g, new THREE.MeshPhongMaterial({color: 0xff0000}));
//     mesh.rotation.x = -Math.PI/2;
//     return mesh;
// }

function gearShape(n: number):THREE.Shape {
  let res = new THREE.Shape();
  let pts = [];
  for (let [r, theta] of shapes.getGear(n, modulez, Math.PI/9, 0.01)) {
    pts.push({x: r*Math.cos(theta), y: r*Math.sin(theta)})
  }
  res.setFromPoints(pts);
  return res;
}

function addAssembleyToScene(a: Assembley, scene: THREE.Scene) {
  let base = punchOut({
    shapes: [circle(arm1Radius + arm2Radius + arm2OutsideCircleRadius)],
    thickness: punchoutThickness,
  });
  base.position.y = -punchoutThickness/2;

  scene.add(base);
  // for (const o of getBox()) {
  //   scene.add(o);
  // }
  // for (const axle of a.axles) {
  //   let height = axle.startingHeight;
  //   for (const item of axle.items) {
  //     if (item.shapes.length > 0) {
  //       const mesh = punchOut(item);
  //       mesh.position.x = axle.point.x;
  //       mesh.position.z = axle.point.y;
  //       mesh.position.y = height;
  //       scene.add(mesh);
  //     }
  //     height += item.thickness;
  //   }
  //   const ah = height - axle.startingHeight;
  //   const ag = getAxle(ah);
  //   ag.position.y = ah/2 - 1 + axle.startingHeight;
  //   ag.position.x = axle.point.x;
  //   ag.position.z = axle.point.y;
  //   scene.add(ag);
  // }

//  let s = gear22(6, 2, Math.PI/9);
  //var geometry = new THREE.BufferGeometry().setFromPoints(s.getPoints());
  // let pts = [];
  // for (let [r, theta] of shapes.getGear(18, 1/3, Math.PI/9, 0.01)) {
  //   pts.push({x: r*Math.cos(theta), y: r*Math.sin(theta)})
  // }
  // var geometry = new THREE.BufferGeometry().setFromPoints(pts);

//  let m = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } ) );
  // let m = punchOut(gear1);
  // m.rotation.x = Math.PI/2;
  // m.position.y = 2;
  // scene.add( m);


      scene.add(theScene.driveGear);
  scene.add(theScene.transferGear);
  scene.add(theScene.innerArm);

  let qg = new THREE.CylinderGeometry(0.955 / 2,  0.955 / 2, 0.069, 32);
  let qm = new THREE.Mesh(qg, new THREE.MeshStandardMaterial( { color: 0xDDDDDD } ));
  qm.position.x = 5;
  qm.position.z = 5;
  qm.position.y = 0.069/2;
  scene.add(qm);
  /*
    var grr = gear3d(10, 6, 12);
    grr.rotation.x = -Math.PI/2;
    grr.position.y = 1;
    scene.add( grr);
    grr = grr.clone();
    grr.position.y = 2;
    scene.add( grr);
    grr = grr.clone();
    grr.position.y = 3;
    scene.add( grr);
    grr = gear3d(4, 2, 12)
    grr.position.x = -14;
    grr.rotation.x = -Math.PI/2;
    grr.position.y = 1;
    scene.add( grr);


      scene.add(getAxle(0, 0));

  //      scene.add(getAxle(-10, 0));

    let discz = disc(15);
    discz.position.y=4.5;
    scene.add(discz);
    discz = disc(14);
    discz.position.y=5.5;
    discz.position.x = 14;
    scene.add(getAxle(14, 0));

    scene.add(discz);*/
}

export function buildScene(scene: THREE.Scene): Scene3D {
  addAssembleyToScene(assembley, scene)
  return theScene;
}
