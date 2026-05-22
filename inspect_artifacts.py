import os
from PIL import Image

artifacts_dir = '/Users/pengyurui/.gemini/antigravity-ide/brain/7351864a-bf81-421f-9d45-9a3c2eb898eb'

print("=== Artifacts Images Info ===")
for f in sorted(os.listdir(artifacts_dir)):
    if f.endswith(('.png', '.jpg', '.jpeg')) and 'media__' in f:
        p = os.path.join(artifacts_dir, f)
        img = Image.open(p)
        print(f"File: {f}, Format: {img.format}, Size: {img.size}")
