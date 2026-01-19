const CARD_WIDTH = 1063;  // 90 mm @ 300 DPI
const CARD_HEIGHT = 590; // 50 mm @ 300 DPI
const PADDING = 50;
const { pinyin } = window.pinyinPro.pinyin;

function generateImg(page) {
  const data = getData();
  if (!data) return;

  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext('2d');
  drawCard(ctx, data, page, 0, 0);

  download(canvas, `fiszka_${page === 1 ? 'PL' : 'CN'}.jpg`);
}

function generateBoth() {
  const data = getData();
  if (!data) return;

  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT + CARD_HEIGHT / 2;

  const ctx = canvas.getContext('2d');

  drawCard(ctx, data, 2, 0, 0);       // CN
  drawCard(ctx, data, 1, 0, CARD_HEIGHT);                 // PL

  download(canvas, 'fiszka_PL_CN.jpg');
}

// ------------------------

function drawCard(ctx, data, page, offsetX, offsetY) {
  const { pl, cn, sentence } = data;

  // Tło
  ctx.fillStyle = '#fff';
  ctx.fillRect(offsetX, offsetY, CARD_WIDTH, CARD_HEIGHT);

  // Ramka
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.strokeRect(offsetX, offsetY, CARD_WIDTH, CARD_HEIGHT);

  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';

  const startX = offsetX + PADDING;

  if (page === 1) {
    // ===== PRZÓD (PL) =====
    const startFontSize = 130;

    const maxTextWidth = CARD_WIDTH - PADDING * 2;

    const fontSize = fitTextToWidth(
      ctx,
      pl,
      maxTextWidth,
      startFontSize,     // start px fontSize
      40,     // minimum
      'Arial'
    );

    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillText(
      pl,
      startX,
      offsetY + 170 - (startFontSize-fontSize) 
    );
  } else {
    // ===== TYŁ (CN) =====
    ctx.font = 'bold 130px Arial';
    ctx.fillText(
      cn,
      startX,
      offsetY + 170
    );

    if (containsChinese(cn)) {
      ctx.font = '45px Arial';
      ctx.fillText(
        window.pinyinPro.pinyin(cn), // nǐ hǎo,
        startX,
        offsetY + 245
      );
    }

    if (sentence) {
      const sentenceFontSize = 80;
      ctx.font = `${sentenceFontSize}px Arial`;
      wrapText(
        ctx,
        sentence,
        startX,
        offsetY + 330 + (containsChinese(cn) ? 15 : 0),
        CARD_WIDTH - PADDING * 2,
        sentenceFontSize + 6
      );
    }
  }
}

function getData() {
  const pl = document.getElementById('pl').value.trim();
  const cn = document.getElementById('cn').value.trim();
  const sentence = document.getElementById('sentence').value.trim();

  if (!pl || !cn) {
    alert('Uzupełnij słowo po polsku i po chińsku');
    return null;
  }

  return { pl, cn, sentence };
}

function download(canvas, filename) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/jpeg', 0.95);
  a.download = filename;
  a.click();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const paragraphs = text.split('\n');

  for (let p = 0; p < paragraphs.length; p++) {
    const chars = paragraphs[p].split('');
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

    // ostatnia linia paragrafu
    if (line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
    }
  }
}

function containsChinese(str) {
  return /[\u4E00-\u9FFF]/.test(str);
}

function fitTextToWidth(ctx, text, maxWidth, startFontSize, minFontSize, fontFamily, fontWeight = 'bold') {
  let fontSize = startFontSize;

  while (fontSize >= minFontSize) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) {
      return fontSize;
    }
    fontSize -= 2;
  }

  return minFontSize;
}
