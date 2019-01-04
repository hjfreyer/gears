

export function getGear(n: number, module: number,
    pressureAngle: number, backlash: number) {
  const fullToothAngle = Math.PI*2/n;
  let pitchRadius = n * module / 2;

  let rootRadius = pitchRadius - module * 1.25
  let outerRadius = pitchRadius + module;
  let baseRadius = pitchRadius * Math.cos(pressureAngle);

  const angularBacklash = Math.atan2(backlash, baseRadius);

  let inv = getInvolute(baseRadius, outerRadius, 0.01);

  let angleToPitchIntersection = null;
  for (const [r, theta] of inv) {
    if (pitchRadius < r) {
      angleToPitchIntersection = theta;
      break;
    }
  }
  // fullToothAngle == 2 * toothPitchAngle + angularBacklash.
  // secondInvoluteStart == toothPitchAngle + 2*angleToPitchIntersection

  const toothPitchAngle = (fullToothAngle - angularBacklash) / 2;
  const secondInvoluteStart = toothPitchAngle + 2*angleToPitchIntersection;

  const bound = r => Math.max(Math.min(r, outerRadius), rootRadius);

  const gearCurve : [number, number][] = [];

  gearCurve.push([rootRadius, 0]);
  for (let tn = 0; tn < n; tn++) {
    let t0 = tn * fullToothAngle;
    let t1 = secondInvoluteStart + t0;
    //ctx.moveTo(baseRadius*Math.cos(t0), baseRadius*Math.sin(t0));
    for (const [r, theta] of inv) {
      if (secondInvoluteStart/2 < theta) {
        break;
      }
      gearCurve.push([bound(r), theta+t0]);
    }
    inv.reverse()
    for (const [r, theta] of inv) {
      if (secondInvoluteStart/2 < theta) {
        continue;
      }
      gearCurve.push([bound(r), t1-theta]);
    }
    inv.reverse()
    gearCurve.push([rootRadius, t1]);
    gearCurve.push([rootRadius, t0 + fullToothAngle]);
  }
  return gearCurve;
}

function getInvolute(baseRadius: number, maxRadius: number, resolution: number): [number, number][] {
  const res = [];
  let t = 0;
  while (true) {
    let x = baseRadius * (Math.cos(t)+t*Math.sin(t));
    let y = baseRadius * (Math.sin(t)-t*Math.cos(t));
    let r = Math.sqrt(x*x + y*y);
    let theta = Math.atan2(y, x);
    if (maxRadius < r) {
      break;
    }
    res.push([r, theta]);
    t += resolution;
  }
  return res;
}
