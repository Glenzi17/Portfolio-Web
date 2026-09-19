"""Gera js/media.js com as dimensões de todas as imagens/vídeos de assets/img.

As pranchas (.plate) usam essas dimensões para assumir a proporção exata de
cada peça — é isso que garante o enquadramento sem cortes nem sobras.

Rodar depois de adicionar ou trocar qualquer imagem:
    py tools/media.py
"""
import json
import os
import struct
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'assets', 'img')
OUT = os.path.join(ROOT, 'js', 'media.js')

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


media = {}
for dirpath, _, files in os.walk(IMG):
    for name in sorted(files):
        path = os.path.join(dirpath, name)
        rel = os.path.relpath(path, ROOT).replace(os.sep, '/')
        ext = name.lower().rsplit('.', 1)[-1]
        if ext in ('webp', 'png', 'jpg', 'jpeg', 'avif', 'gif'):
            with Image.open(path) as im:
                media[rel] = list(im.size)
        elif ext in ('mp4', 'webm'):
            size = mp4_size(path)
            if size:
                media[rel] = list(size)

lines = ['/* GERADO por tools/media.py — não editar à mão. Dimensões [largura, altura] de cada peça. */',
         'window.MEDIA = {']
for k in sorted(media):
    lines.append(f"  '{k}': [{media[k][0]}, {media[k][1]}],")
lines.append('};')
with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(lines) + '\n')
print(f'{len(media)} arquivos → {os.path.relpath(OUT, ROOT)}')
