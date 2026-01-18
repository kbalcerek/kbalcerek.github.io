function generateImg(page) {
  const pl = document.getElementById('pl').value.trim();
  const cn = document.getElementById('cn').value.trim();
  const sentence = document.getElementById('sentence').value.trim();

  if (!pl || !cn) {
    alert('Uzupełnij słowo po polsku i po chińsku');
    return;
  }

  // A4 @ 300 DPI
  const DPI = 300;
  const width = Math.round(8.27 * DPI);   // 2480
  const height = Math.round(11.69 * DPI); // 3508

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // Tło
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#000';
  ctx.textAlign = 'center';

  // Układ: 2 x 4 fiszki
  const cols = 2;
  const rows = 4;

  const marginX = 150;
  const marginY = 200;
  const gap = 40;

  const cardWidth =
    (width - marginX * 2 - gap) / cols;
  const cardHeight =
    (height - marginY * 2 - gap * (rows - 1)) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = marginX + c * (cardWidth + gap);
      const y = marginY + r * (cardHeight + gap);

      // Ramka fiszki
      ctx.strokeRect(x, y, cardWidth, cardHeight);

      ctx.save();
      ctx.translate(x + cardWidth / 2, y + cardHeight / 2);

      if (page === 1) {
        // ===== STRONA PL =====
        ctx.font = 'bold 72px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(pl, 0, 20);
      } else {
        // ===== STRONA CN =====
        ctx.fillStyle = '#000';   // ← TO JEST KLUCZOWE

        ctx.font = 'bold 84px Arial';
        ctx.fillText(cn, 0, -10);

        if (sentence) {
          ctx.font = '36px Arial';
          wrapText(ctx, sentence, 0, 40, cardWidth - 80, 44);
        }
      }

      ctx.restore();
    }
  }

  download(canvas, `fiszki_${page === 1 ? 'PL' : 'CN'}.jpg`);
}

// ------------------------

function download(canvas, filename) {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/jpeg', 0.95);
  link.download = filename;
  link.click();
}

// Prosty wrap tekstu
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split('');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}