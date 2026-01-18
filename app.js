function generateImg(page) {
  const pl = document.getElementById('pl').value.trim();
  const cn = document.getElementById('cn').value.trim();
  const sentence = document.getElementById('sentence').value.trim();

  if (!pl || !cn) {
    alert('Uzupełnij słowo po polsku i po chińsku');
    return;
  }

  // Fiszka 90x50 mm @ 300 DPI
  const width = 1063;
  const height = 590;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // Tło
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  // Ramka
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';

  if (page === 1) {
    // ===== PRZÓD (PL) =====
    ctx.font = 'bold 96px Arial';
    ctx.fillText(pl, width / 2, height / 2 + 32);
  } else {
    // ===== TYŁ (CN) =====
    ctx.font = 'bold 110px Arial';
    ctx.fillText(cn, width / 2, height / 2 - 20);

    if (sentence) {
      ctx.font = '40px Arial';
      wrapText(
        ctx,
        sentence,
        width / 2,
        height / 2 + 60,
        width - 100,
        48
      );
    }
  }

  download(canvas, `fiszka_${page === 1 ? pl : cn}.jpg`);
}

// ------------------------

function download(canvas, filename) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/jpeg', 0.95);
  a.download = filename;
  a.click();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split('');
  let line = '';

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, x, y);
      line = chars[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
