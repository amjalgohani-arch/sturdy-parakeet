/**
 * Pure TypeScript ISO/IEC 18004 QR Code Matrix Generator (Byte Mode, Error Correction Level L)
 * Generates 100% real, camera-scannable QR codes on the client with zero external dependencies.
 */

// Capacities for Byte Mode at Error Correction Level L (Versions 1 to 6)
const VERSION_CAPACITIES_L = [0, 17, 32, 53, 78, 106, 134];
const TOTAL_CODEWORDS = [0, 26, 44, 70, 100, 134, 172];
const EC_CODEWORDS_PER_BLOCK = [0, 7, 10, 15, 20, 26, 18];
const NUM_BLOCKS = [0, 1, 1, 1, 1, 1, 2];

const ALIGNMENT_POSITIONS: number[][] = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
];

// GF(256) exponent and log tables for Reed-Solomon
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function getGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function computeReedSolomon(data: Uint8Array, ecLength: number): Uint8Array {
  const gen = getGeneratorPoly(ecLength);
  const msg = new Uint8Array(data.length + ecLength);
  msg.set(data, 0);

  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msg.slice(data.length);
}

export function generateQRMatrix(text: string): boolean[][] {
  const utf8Bytes = new TextEncoder().encode(text);
  let version = 1;
  while (version <= 6 && utf8Bytes.length > VERSION_CAPACITIES_L[version]) {
    version++;
  }
  if (version > 6) {
    // Truncate gracefully if exceeding version 6 capacity (134 bytes)
    version = 6;
  }
  const maxBytes = VERSION_CAPACITIES_L[version];
  const payload = utf8Bytes.slice(0, maxBytes);

  const totalCodewords = TOTAL_CODEWORDS[version];
  const ecPerBlock = EC_CODEWORDS_PER_BLOCK[version];
  const numBlocks = NUM_BLOCKS[version];
  const dataCodewordsCount = totalCodewords - ecPerBlock * numBlocks;

  // Build bit stream: Mode 0100 (Byte), 8-bit character count, data bytes, terminator
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  pushBits(0b0100, 4);
  pushBits(payload.length, 8);
  for (let i = 0; i < payload.length; i++) {
    pushBits(payload[i], 8);
  }

  const maxBits = dataCodewordsCount * 8;
  const terminatorLen = Math.min(4, maxBits - bits.length);
  pushBits(0, terminatorLen);

  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  const dataBytes = new Uint8Array(dataCodewordsCount);
  for (let i = 0; i < dataCodewordsCount; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j];
    }
    dataBytes[i] = b;
  }

  // Split into blocks and compute EC
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  const blockSize = Math.floor(dataCodewordsCount / numBlocks);

  for (let b = 0; b < numBlocks; b++) {
    const blockData = dataBytes.slice(b * blockSize, (b + 1) * blockSize);
    dataBlocks.push(blockData);
    ecBlocks.push(computeReedSolomon(blockData, ecPerBlock));
  }

  // Interleave data and EC codewords
  const finalCodewords: number[] = [];
  for (let i = 0; i < blockSize; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(dataBlocks[b][i]);
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(ecBlocks[b][i]);
    }
  }

  const size = version * 4 + 17;
  const modules: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );
  const isFunction: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // Place finder patterns
  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inOuter = r >= 0 && r <= 6 && (c === 0 || c === 6);
        const inTopBot = c >= 0 && c <= 6 && (r === 0 || r === 6);
        const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        modules[rr][cc] = inOuter || inTopBot || inCenter;
        isFunction[rr][cc] = true;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    modules[6][i] = i % 2 === 0;
    isFunction[6][i] = true;
    modules[i][6] = i % 2 === 0;
    isFunction[i][6] = true;
  }

  // Alignment patterns
  const alignCoords = ALIGNMENT_POSITIONS[version];
  for (let rIdx = 0; rIdx < alignCoords.length; rIdx++) {
    for (let cIdx = 0; cIdx < alignCoords.length; cIdx++) {
      if (
        (rIdx === 0 && cIdx === 0) ||
        (rIdx === 0 && cIdx === alignCoords.length - 1) ||
        (rIdx === alignCoords.length - 1 && cIdx === 0)
      ) {
        continue;
      }
      const centerR = alignCoords[rIdx];
      const centerC = alignCoords[cIdx];
      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
          const isDot = r === 0 && c === 0;
          modules[centerR + r][centerC + c] = isBorder || isDot;
          isFunction[centerR + r][centerC + c] = true;
        }
      }
    }
  }

  // Reserve format information areas & dark module
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      isFunction[8][i] = true;
      isFunction[i][8] = true;
    }
    if (i < 8) {
      isFunction[8][size - 1 - i] = true;
      isFunction[size - 1 - i][8] = true;
    }
  }
  modules[size - 8][8] = true;
  isFunction[size - 8][8] = true;

  // Place data bits in upward/downward 2-column zig-zag
  let bitIdx = 0;
  const totalBits = finalCodewords.length * 8;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const row = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const col = right - j;
        if (!isFunction[row][col]) {
          let dark = false;
          if (bitIdx < totalBits) {
            const byteVal = finalCodewords[bitIdx >> 3];
            dark = ((byteVal >> (7 - (bitIdx & 7))) & 1) === 1;
            bitIdx++;
          }
          // Apply Mask 0: (row + col) % 2 === 0
          if ((row + col) % 2 === 0) {
            dark = !dark;
          }
          modules[row][col] = dark;
        }
      }
    }
    upward = !upward;
  }

  // Format information bits for Error Correction Level L (01) and Mask 0 (000) -> Precomputed BCH: 0x77c4
  const formatBits = 0x77c4;
  const getFormatBit = (idx: number) => ((formatBits >> idx) & 1) === 1;

  for (let i = 0; i <= 5; i++) modules[8][i] = getFormatBit(i);
  modules[8][7] = getFormatBit(6);
  modules[8][8] = getFormatBit(7);
  modules[7][8] = getFormatBit(8);
  for (let i = 9; i < 15; i++) modules[14 - i][8] = getFormatBit(i);

  for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = getFormatBit(i);
  for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = getFormatBit(i);

  return modules;
}

export function downloadQRCodeAsPng(
  url: string,
  title: string,
  primaryColor = '#059669'
): void {
  const matrix = generateQRMatrix(url);
  const canvas = document.createElement('canvas');
  const canvasSize = 800;
  canvas.width = canvasSize;
  canvas.height = canvasSize + 140;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // White background card
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

  const margin = 70;
  const qrArea = canvasSize - margin * 2;
  const cellSize = qrArea / matrix.length;

  ctx.fillStyle = primaryColor;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix.length; c++) {
      if (matrix[r][c]) {
        ctx.fillRect(
          margin + c * cellSize,
          margin + r * cellSize,
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        );
      }
    }
  }

  // Footer text
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px Cairo, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, canvasSize + 35);

  ctx.fillStyle = '#64748b';
  ctx.font = '18px IBM Plex Mono, monospace';
  ctx.fillText(url.slice(0, 56), canvas.width / 2, canvasSize + 78);

  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'afaq-platform-qr.png';
  a.click();
}
