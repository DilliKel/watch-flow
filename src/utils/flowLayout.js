const COLS = 4
const NODE_W = 160
const NODE_H = 240
const GAP_X = 60
const GAP_Y = 80

export function buildLayout(movies) {
  return movies.map((_, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    return {
      x: col * (NODE_W + GAP_X),
      y: row * (NODE_H + GAP_Y),
    }
  })
}
