"""Gera src/data/media.js com as dimensões de todas as imagens/vídeos de public/assets/img
e cria as variantes responsivas de cada imagem (nome@640.webp, nome@1000.webp, nome@1400.webp).

As pranchas (.plate) usam as dimensões para assumir a proporção exata de cada
peça — é isso que garante o enquadramento sem cortes nem sobras. As variantes
entram no srcset: o celular baixa a versão de 640/1000 px em vez da de 1800.

Rodar depois de adicionar ou trocar qualquer imagem:
    npm run media        (ou: py tools/media.py)
"""
import os
import re
import struct
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
IMG = os.path.join(PUBLIC, 'assets', 'img')
OUT = os.path.join(ROOT, 'src', 'data', 'media.js')

WIDTHS = (640, 1000, 1400)      # larguras das variantes responsivas
VARIANT_RE = re.compile(r'@(\d+)\.(webp|mp4|webm)$', re.I)
IMAGE_EXT = ('webp', 'png', 'jpg', 'jpeg', 'avif', 'gif')
VIDEO_EXT = ('mp4', 'webm')

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit('Instale o Pillow: py -m pip install pillow')


def mp4_size(path):
    """Lê largura/altura de um MP4 (h264) direto do átomo tkhd, sem ffprobe."""
    with open(path, 'rb') as f:
        data = f.read()
    i = data.find(b'tkhd')
    while i >= 0:  # a trilha de áudio também tem tkhd (largura 0) — pega a primeira com tamanho
        version = data[i + 4]
        # version/flags + creation + modification + track_id + reserved + duration
        # + reserved(8) + layer + alt_group + volume + reserved + matrix(36)
        off = i + 4 + (88 if version else 76)
        w, h = struct.unpack('>II', data[off:off + 8])
        if w and h:
            return w >> 16, h >> 16
        i = data.find(b'tkhd', i + 4)
    return None


def make_variants(path, im):
    """Cria nome@W.webp para cada largura menor que a original. Devolve as larguras existentes."""
    base, _ = os.path.splitext(path)
    made = []
    for w in WIDTHS:
        if w >= im.width * 0.9:  # não vale a pena uma variante quase do tamanho original
            continue
        out = f'{base}@{w}.webp'
        if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(path):
            h = round(im.height * w / im.width)
            im.convert('RGB' if im.mode not in ('RGB', 'RGBA') else im.mode) \
              .resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
            print(f'  + {os.path.relpath(out, PUBLIC)} ({w}x{h})')
        made.append(w)
    return made


media = {}
generated = 0
for dirpath, _, files in os.walk(IMG):
    for name in sorted(files):
        if VARIANT_RE.search(name):
            continue  # variante gerada — não indexar
        path = os.path.join(dirpath, name)
        # Chave = URL pública absoluta (public/ é servido na raiz pelo Vite)
        rel = '/' + os.path.relpath(path, PUBLIC).replace(os.sep, '/')
        ext = name.lower().rsplit('.', 1)[-1]
        if ext in IMAGE_EXT:
            with Image.open(path) as im:
                variants = make_variants(path, im)
                media[rel] = [im.width, im.height, variants]
        elif ext in VIDEO_EXT:
            size = mp4_size(path)
            if size:
                # Variantes de vídeo (nome@720.mp4) são feitas à mão com ffmpeg, ex.:
                #   ffmpeg -i reel.mp4 -vf scale=720:-2 -c:v libx264 -preset slow -crf 26 \
                #     -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k reel@720.mp4
                base = os.path.splitext(name)[0]
                variants = sorted(int(m.group(1)) for f in files
                                  for m in [VARIANT_RE.search(f)] if m and f.startswith(base + '@'))
                media[rel] = [size[0], size[1], variants]

lines = ['/* GERADO por tools/media.py — não editar à mão.',
         '   [largura, altura, larguras das variantes responsivas (nome@W.webp)] de cada peça. */',
         'export const MEDIA = {']
for k in sorted(media):
    w, h, variants = media[k]
    lines.append(f"  '{k}': [{w}, {h}, [{', '.join(str(v) for v in variants)}]],")
lines.append('};')
with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(lines) + '\n')
print(f'{len(media)} arquivos → {os.path.relpath(OUT, ROOT)}')
