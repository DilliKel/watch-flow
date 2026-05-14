/**
 * Gera icon-192.png e icon-512.png em /public usando apenas módulos nativos.
 * Executa com: node scripts/generate-icons.mjs
 */
import { writeFileSync } from 'fs'
import { deflateSync } from 'zlib'

// CRC32 (exigido pelo formato PNG)
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}

/**
 * Cria um PNG RGB sólido com cantos arredondados.
 * Pixels fora do raio recebem a cor de fundo `bg`; dentro, a cor `fg`.
 */
function roundedPng(size, radius, bg, fg) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // color type: RGB

  // Monta pixel a pixel com cantos arredondados
  const rows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3) // filter byte + RGB
    for (let x = 0; x < size; x++) {
      const dx = Math.min(x, size - 1 - x)
      const dy = Math.min(y, size - 1 - y)
      let [r, g, b] = bg
      if (dx >= radius || dy >= radius) {
        // área central ou borda reta → cor do ícone
        ;[r, g, b] = fg
      } else {
        const dist = Math.sqrt((radius - dx - 1) ** 2 + (radius - dy - 1) ** 2)
        ;[r, g, b] = dist <= radius ? fg : bg
      }
      row[1 + x * 3] = r
      row[2 + x * 3] = g
      row[3 + x * 3] = b
    }
    rows.push(row)
  }

  const raw = Buffer.concat(rows)
  const idat = deflateSync(raw)

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// WatchFlow: fundo escuro #0D0D0F, ícone roxo #7C3AED
const bg = [0x0D, 0x0D, 0x0F]
const fg = [0x7C, 0x3A, 0xED]

writeFileSync('public/icon-192.png', roundedPng(192, 32, bg, fg))
writeFileSync('public/icon-512.png', roundedPng(512, 80, bg, fg))

console.log('✓ public/icon-192.png e public/icon-512.png gerados.')
