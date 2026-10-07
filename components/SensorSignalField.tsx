"use client";

import { useEffect, useRef } from "react";

const CHANNELS = ["Sensor X", "Sensor Y", "Sensor Z"];
const SIGNAL_START = 78;
type WalkerAction = "run" | "jump" | "wave-right" | "stretch";
const ACTIONS: WalkerAction[] = ["run", "jump", "wave-right", "stretch"];
const ACTION_DURATION: Record<WalkerAction, number> = { run: 1350, jump: 1000, "wave-right": 1800, stretch: 2400 };

type Movement = {
  action: WalkerAction;
  startedAt: number;
  duration: number;
};

type Point = [number, number];
type Pose = { hip: Point; shoulder: Point; head: Point; feet: [Point, Point]; hands: [Point, Point]; lift: number };
const TAU = Math.PI * 2;

// Keep the feet on the ground during support, then lift each foot for its return.
function gaitPose(phase: number, running: boolean): Pose {
  const bounce = Math.abs(running ? Math.cos(phase) : Math.sin(phase));
  const hip: Point = [32, (running ? 37 : 35) - bounce * (running ? 2.2 : 1)];
  const shoulder: Point = [32 + (running ? 5 : 1.5), hip[1] - 14];
  const feet = [0, Math.PI].map(offset => {
    const cycle = ((phase + offset) / TAU) % 1;
    const support = running ? .48 : .6;
    const stride = running ? 14 : 11;
    if (cycle < support) return [32 + stride * (1 - 2 * cycle / support), 61] as Point;
    const swing = (cycle - support) / (1 - support);
    const eased = swing * swing * (3 - 2 * swing);
    return [32 + stride * (2 * eased - 1), 61 - Math.sin(Math.PI * swing) * (running ? 15 : 9)] as Point;
  }) as [Point, Point];
  const hands = [0, Math.PI].map(offset => {
    const swing = Math.cos(phase + offset);
    return [shoulder[0] - swing * (running ? 11 : 8), shoulder[1] + (running ? 11 : 18)] as Point;
  }) as [Point, Point];
  return { hip, shoulder, head: [shoulder[0] + 1, shoulder[1] - 11], feet, hands, lift: 0 };
}

function jumpPose(walking: Pose, progress: number): Pose {
  const airborne = Math.max(0, Math.min(1, (progress - .18) / .64));
  const jumpHeight = 19;
  const lift = Math.sin(airborne * Math.PI) * jumpHeight;
  const crouch = progress < .18 ? Math.sin(progress / .18 * Math.PI) * 4
    : progress > .82 ? Math.sin((progress - .82) / .18 * Math.PI) * 3 : 0;
  const hip: Point = [32, 35 + crouch - lift];
  const shoulder: Point = [34, hip[1] - 14];
  const height = lift / jumpHeight;
  const target: Pose = {
    hip, shoulder, head: [35, shoulder[1] - 11], lift,
    feet: [[24, 61 - lift - height * 4], [40, 61 - lift - height * 4]],
    hands: [[shoulder[0] - 13, shoulder[1] + 14 - height * 24], [shoulder[0] + 13, shoulder[1] + 14 - height * 24]]
  };
  const weight = Math.max(0, Math.min(1, progress / .14, (1 - progress) / .15));
  const blend = weight * weight * (3 - 2 * weight);
  const mix = (a: Point, b: Point): Point => [a[0] + (b[0] - a[0]) * blend, a[1] + (b[1] - a[1]) * blend];
  return {
    hip: mix(walking.hip, target.hip), shoulder: mix(walking.shoulder, target.shoulder), head: mix(walking.head, target.head),
    feet: [mix(walking.feet[0], target.feet[0]), mix(walking.feet[1], target.feet[1])],
    hands: [mix(walking.hands[0], target.hands[0]), mix(walking.hands[1], target.hands[1])], lift: lift * blend
  };
}

function gesturePose(walking: Pose, progress: number, stretching = false): Pose {
  const weight = Math.max(0, Math.min(1, progress / .18, (1 - progress) / .2));
  const blend = stretching ? Math.pow(Math.sin(progress * Math.PI), .8) : weight * weight * (3 - 2 * weight);
  const shoulder: Point = [walking.shoulder[0] - (stretching ? 2 : 0), walking.shoulder[1] - (stretching ? 2 : 0)];
  const swing = Math.sin(progress * TAU * 3);
  const target: Pose = {
    ...walking,
    shoulder,
    head: stretching ? [shoulder[0], shoulder[1] - 11] : walking.head,
    hands: stretching
      ? [[shoulder[0] + 9, shoulder[1] - 17], [shoulder[0] - 9, shoulder[1] - 17]]
      : [[shoulder[0] + 12 + swing * 5, shoulder[1] - 11 + swing * 2], walking.hands[1]]
  };
  const mix = (a: Point, b: Point): Point => [a[0] + (b[0] - a[0]) * blend, a[1] + (b[1] - a[1]) * blend];
  return {
    hip: mix(walking.hip, target.hip), shoulder: mix(walking.shoulder, target.shoulder), head: mix(walking.head, target.head),
    feet: [mix(walking.feet[0], target.feet[0]), mix(walking.feet[1], target.feet[1])],
    hands: [mix(walking.hands[0], target.hands[0]), mix(walking.hands[1], target.hands[1])], lift: 0
  };
}

// Solve a two-segment limb so the knee or elbow bends without stretching it.
function limbPath(root: Point, end: Point, length: number, bend: number, foot = false) {
  const dx = end[0] - root[0], dy = end[1] - root[1];
  const distance = Math.max(.01, Math.hypot(dx, dy));
  const reach = Math.min(distance, length * 2 - .01);
  const target: Point = [root[0] + dx / distance * reach, root[1] + dy / distance * reach];
  const flex = Math.sqrt(length * length - reach * reach / 4) * bend;
  const joint: Point = [(root[0] + target[0]) / 2 + dy / distance * flex, (root[1] + target[1]) / 2 - dx / distance * flex];
  return `M${root.join(" ")} L${joint.join(" ")} L${target.join(" ")}${foot ? ` l4 0` : ""}`;
}

const WALK_SPEED = .027;
const RUN_SPEED = .114;
const SAMPLE_SPACING = 1;
const ACTIVE_TRAIL_LENGTH = 190;

export function SensorSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvasRef.current;
    const drawing = element?.getContext("2d");
    const parent = element?.parentElement;
    if (!element || !drawing || !parent) return;
    const canvas = element;
    const context = drawing;
    const zone = parent;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const noiseSeed = Math.random() * 10000;
    const walker = zone.querySelector<SVGSVGElement>(".intro-walker");
    const head = walker?.querySelector<SVGCircleElement>(".intro-walker-head");
    const shadow = walker?.querySelector<SVGEllipseElement>(".intro-walker-shadow");
    const parts = Object.fromEntries(["torso", "front-leg", "back-leg", "front-arm", "back-arm"].map(part => [part, walker?.querySelector<SVGPathElement>(`[data-walker-part="${part}"]`)]));
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let walkerX = 0;
    let signalCenter = 0;
    let lastDrawAt = performance.now();
    let simulationTime = 0;
    let activeAction: Movement | null = null;
    let actionBag: WalkerAction[] = [];
    let lastAction: WalkerAction | null = null;
    let gaitPhase = 0;
    let positioned = false;
    let history = CHANNELS.map(() => new Float32Array(0));

    function laneY(lane: number) {
      const center = height * .52;
      const spacing = Math.min(88, height * .20);
      return center + (lane - 1) * spacing;
    }

    function signalNoise(lane: number, time: number, interval: number, salt: number) {
      const position = time / interval;
      const cell = Math.floor(position);
      const fraction = position - cell;
      const blend = fraction * fraction * (3 - 2 * fraction);
      const sample = (index: number) => {
        const value = Math.sin((index + noiseSeed) * 12.9898 + lane * 78.233 + salt * 39.425) * 43758.5453;
        return (value - Math.floor(value)) * 2 - 1;
      };
      const left = sample(cell);
      return left + (sample(cell + 1) - left) * blend;
    }

    function walkingSignal(lane: number, time: number) {
      // Smooth, seeded noise varies each pass while keeping recorded samples stable.
      const phase = time / (780 + lane * 200) * TAU + lane * 1.4
        + signalNoise(lane, time, 2300, 1) * .6;
      const amplitude = 1 + signalNoise(lane, time, 1400, 2) * .23;
      const jitter = signalNoise(lane, time, 65 + lane * 25, 3) * [1.8, 1.3, 1][lane];
      const drift = signalNoise(lane, time, 1700, 4) * 1.2;
      return (Math.sin(phase) * [8, 6, 4.5][lane]
        + Math.sin(phase * 2 + .7) * [2.3, 1.8, 1.2][lane]) * amplitude + jitter + drift;
    }

    function sensorValue(lane: number, time: number, movement: Movement | null) {
      const ordinary = walkingSignal(lane, time);
      if (!movement) return ordinary;
      const progress = (time - movement.startedAt) / movement.duration;
      if (progress < 0 || progress > 1) return ordinary;
      if (movement.action === "run") {
        const envelope = Math.min(1, progress / .035, (1 - progress) / .035);
        const phase = progress * TAU;
        // Dense, irregular vibration is recorded as a fixed trace of the run.
        const vibration = Math.sin(phase * 18) * .65
          + Math.sin(phase * 31 + 1.7) * .25
          + Math.sin(phase * 47 + .4) * .1;
        return ordinary * (1 - envelope * .85) + vibration * [27, 19, 13][lane] * envelope;
      }
      const envelope = Math.sin(progress * Math.PI);
      if (movement.action === "stretch") {
        const swell = envelope * envelope;
        return ordinary * (1 - swell * .65) + swell * [38, 7, 40][lane];
      }
      if (movement.action === "wave-right") {
        const amplitude = [5, 8, 32];
        const wave = Math.sin(progress * TAU * 3) * envelope;
        return wave * amplitude[lane];
      }
      const spike = Math.exp(-Math.pow((progress - .5) / .065, 2));
      return ordinary * (1 - envelope * .7) + spike * [56, 40, 52][lane];
    }

    function drawWalker(elapsed: number) {
      const running = activeAction?.action === "run";
      if (!reducedMotion.matches) gaitPhase = (gaitPhase + elapsed / (running ? 450 : 1200) * TAU) % TAU;
      let pose = gaitPose(reducedMotion.matches ? .3 : gaitPhase, running);
      if (activeAction?.action === "jump" && !reducedMotion.matches) {
        pose = jumpPose(pose, Math.min(1, (simulationTime - activeAction.startedAt) / activeAction.duration));
      } else if (activeAction?.action === "wave-right" && !reducedMotion.matches) {
        pose = gesturePose(pose, Math.min(1, (simulationTime - activeAction.startedAt) / activeAction.duration));
      } else if (activeAction?.action === "stretch" && !reducedMotion.matches) {
        pose = gesturePose(pose, Math.min(1, (simulationTime - activeAction.startedAt) / activeAction.duration), true);
      }
      parts["torso"]?.setAttribute("d", `M${pose.head[0]} ${pose.head[1] + 5} L${pose.shoulder.join(" ")} L${pose.hip.join(" ")}`);
      for (let i = 0; i < 2; i++) {
        const side = i === 0 ? "front" : "back";
        parts[`${side}-leg`]?.setAttribute("d", limbPath(pose.hip, pose.feet[i], 15, 1, true));
        parts[`${side}-arm`]?.setAttribute("d", limbPath(pose.shoulder, pose.hands[i], 10, -1));
      }
      head?.setAttribute("cx", String(pose.head[0]));
      head?.setAttribute("cy", String(pose.head[1]));
      shadow?.setAttribute("rx", String(12 - pose.lift * .2));
      shadow?.setAttribute("opacity", String(.15 - pose.lift * .004));
      return (pose.head[0] - 32) * 56 / 64;
    }

    function historyValue(lane: number, x: number) {
      const position = Math.max(0, Math.min(history[lane].length - 1, x / SAMPLE_SPACING));
      const left = Math.floor(position);
      const right = Math.min(history[lane].length - 1, left + 1);
      return history[lane][left] + (history[lane][right] - history[lane][left]) * (position - left);
    }

    function recordRange(start: number, end: number, endTime: number, speed: number, movement: Movement | null) {
      if (end < start) return;
      // Samples stay at these x positions until the next pass writes over them.
      const first = Math.max(0, Math.floor(start / SAMPLE_SPACING));
      const last = Math.min(history[0].length - 1, Math.ceil(end / SAMPLE_SPACING));
      for (let cell = first; cell <= last; cell++) {
        const sampleTime = endTime - Math.max(0, end - cell * SAMPLE_SPACING) / speed;
        for (let lane = 0; lane < CHANNELS.length; lane++) history[lane][cell] = sensorValue(lane, sampleTime, movement);
      }
    }

    function draw(time: number) {
      if (!width || !height) return;
      const elapsed = Math.min(50, Math.max(0, time - lastDrawAt));
      lastDrawAt = time;
      if (!reducedMotion.matches) simulationTime += elapsed;
      const movement = activeAction;
      const speed = movement?.action === "run" ? RUN_SPEED : WALK_SPEED;
      const previousCenter = signalCenter;
      const minX = Math.max(SIGNAL_START + 12, -canvas.offsetLeft + 32);
      const signalEnd = Math.min(width, Math.max(minX + 80, zone.clientWidth - canvas.offsetLeft - 28));
      const headOffset = drawWalker(elapsed);
      const maxX = signalEnd - headOffset;
      const previousX = walkerX;
      if (!reducedMotion.matches) walkerX += elapsed * speed;
      const wrapped = walkerX > maxX;
      if (wrapped) walkerX = minX + (walkerX - minX) % (maxX - minX);
      if (reducedMotion.matches) walkerX = zone.clientWidth / 2 - canvas.offsetLeft;
      signalCenter = walkerX + headOffset;
      zone.style.setProperty("--walker-x", `${walkerX + canvas.offsetLeft - 28}px`);
      // Expose the physical alignment for inspection without using a separate animation clock.
      zone.style.setProperty("--signal-center-x", `${signalCenter + canvas.offsetLeft}px`);
      if (!reducedMotion.matches) {
        if (wrapped) {
          recordRange(previousCenter, signalEnd, simulationTime - (walkerX - minX) / speed, speed, movement);
          recordRange(minX + headOffset, signalCenter, simulationTime, speed, movement);
        } else {
          recordRange(Math.min(previousCenter || previousX, signalCenter), signalCenter, simulationTime, speed, movement);
        }
      }
      if (activeAction && simulationTime - activeAction.startedAt >= activeAction.duration) {
        activeAction = null;
        delete zone.dataset.walkerAction;
      }

      context.clearRect(0, 0, width, height);
      const night = document.body.dataset.textMode === "night";
      const quiet = night ? "rgba(128, 200, 213, .3)" : "rgba(45, 105, 130, .28)";
      const baseline = night ? "rgba(128, 200, 213, .09)" : "rgba(45, 105, 130, .08)";
      const active = night ? "rgba(129, 226, 234, .8)" : "rgba(28, 111, 150, .72)";
      const label = night ? "rgba(169, 212, 218, .72)" : "rgba(49, 94, 111, .72)";
      context.font = "600 11px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textBaseline = "middle";
      context.lineCap = "round";
      context.lineJoin = "round";

      for (let lane = 0; lane < CHANNELS.length; lane++) {
        const y = laneY(lane);
        context.beginPath();
        context.setLineDash([2, 8]);
        context.strokeStyle = baseline;
        context.lineWidth = 1;
        context.moveTo(SIGNAL_START, y);
        context.lineTo(signalEnd, y);
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = label;
        context.fillText(CHANNELS[lane], 18, y - 16);

        context.beginPath();
        context.strokeStyle = quiet;
        context.lineWidth = 1.35;
        for (let x = SIGNAL_START; x <= signalEnd; x += SAMPLE_SPACING) {
          const pointY = y - historyValue(lane, x);
          if (x === SIGNAL_START) context.moveTo(x, pointY);
          else context.lineTo(x, pointY);
        }
        context.lineTo(signalEnd, y - historyValue(lane, signalEnd));
        context.stroke();

        // The head leads the live signal; all highlighted samples trail behind it.
        const start = Math.max(SIGNAL_START, signalCenter - ACTIVE_TRAIL_LENGTH);
        const end = Math.min(signalEnd, signalCenter);
        const gradient = context.createLinearGradient(signalCenter - ACTIVE_TRAIL_LENGTH, 0, signalCenter, 0);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(.4, active);
        gradient.addColorStop(1, active);
        context.beginPath();
        context.strokeStyle = gradient;
        context.lineWidth = 2;
        context.shadowColor = active;
        context.shadowBlur = 5;
        for (let x = start; x <= end; x += SAMPLE_SPACING) {
          const value = historyValue(lane, x);
          const pointY = y - value;
          if (x === start) context.moveTo(x, pointY);
          else context.lineTo(x, pointY);
        }
        context.lineTo(end, y - historyValue(lane, end));
        context.stroke();
        context.shadowBlur = 0;
      }
    }

    function tick(time: number) {
      frame = 0;
      if (mobile.matches || !visible || document.hidden) return;
      draw(time);
      if (!reducedMotion.matches) frame = requestAnimationFrame(tick);
    }

    function schedule() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (!mobile.matches && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }

    function resize() {
      if (mobile.matches) {
        activeAction = null;
        delete zone.dataset.walkerAction;
        schedule();
        return;
      }
      lastDrawAt = performance.now();
      const bounds = canvas.getBoundingClientRect();
      const resized = width !== bounds.width;
      width = bounds.width;
      height = bounds.height;
      if (resized || !history[0].length) {
        const cells = Math.ceil(width / SAMPLE_SPACING) + 1;
        history = CHANNELS.map((_, lane) => Float32Array.from({ length: cells }, (_, cell) => walkingSignal(lane, cell * SAMPLE_SPACING * 9)));
      }
      if (!positioned) {
        walkerX = Math.max(SIGNAL_START + 12, -canvas.offsetLeft + 32);
        signalCenter = walkerX;
        positioned = true;
      }
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      schedule();
    }

    function triggerMovement() {
      if (mobile.matches) return;
      // Shuffle complete rounds so each action appears equally often.
      if (!actionBag.length) {
        actionBag = [...ACTIONS];
        for (let i = actionBag.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [actionBag[i], actionBag[j]] = [actionBag[j], actionBag[i]];
        }
        const next = actionBag.length - 1;
        if (actionBag[next] === lastAction) {
          const other = Math.floor(Math.random() * next);
          [actionBag[next], actionBag[other]] = [actionBag[other], actionBag[next]];
        }
      }
      const action = actionBag.pop()!;
      lastAction = action;
      activeAction = { action, startedAt: simulationTime, duration: ACTION_DURATION[action] };
      zone.dataset.walkerAction = action;
      schedule();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      triggerMovement();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    intersectionObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      if (reducedMotion.matches) schedule();
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-text-mode"] });
    zone.addEventListener("click", triggerMovement);
    canvas.addEventListener("keydown", onKeyDown);
    reducedMotion.addEventListener("change", schedule);
    mobile.addEventListener("change", resize);
    document.addEventListener("visibilitychange", schedule);
    resize();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      zone.style.removeProperty("--walker-x");
      zone.style.removeProperty("--signal-center-x");
      delete zone.dataset.walkerAction;
      zone.removeEventListener("click", triggerMovement);
      canvas.removeEventListener("keydown", onKeyDown);
      reducedMotion.removeEventListener("change", schedule);
      mobile.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, []);

  return <canvas ref={canvasRef} className="intro-signal-field" role="button" tabIndex={0} aria-label="Trigger a random stick figure movement and sensor response" />;
}
