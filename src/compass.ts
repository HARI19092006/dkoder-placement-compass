import type { Destination } from './data'

export const COMPASS = {
  cameraZ: 9.2,
  fov: 38,
  tilt: -0.32,
  nodeRadius: 1.6,
  discRadius: 2.25,
}

export const NODE_ANGLE: Record<Destination, number> = {
  practise: Math.PI / 2,
  explore: (Math.PI * 7) / 6,
  interview: (Math.PI * 11) / 6,
}

export function project(x: number, y: number): { left: number; top: number } {
  const { cameraZ, fov, tilt } = COMPASS
  const y1 = y * Math.cos(tilt)
  const z1 = y * Math.sin(tilt)
  const half = (cameraZ - z1) * Math.tan(((fov / 2) * Math.PI) / 180)
  return { left: 50 + (x / half) * 50, top: 50 - (y1 / half) * 50 }
}

export function nodePosition(d: Destination, radius = COMPASS.nodeRadius) {
  const a = NODE_ANGLE[d]
  return project(Math.cos(a) * radius, Math.sin(a) * radius)
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}