import os
from PIL import Image

workspace_dir = '/Users/pengyurui/Documents/GitHub/Betty'
artifacts_dir = '/Users/pengyurui/.gemini/antigravity-ide/brain/7351864a-bf81-421f-9d45-9a3c2eb898eb'

print("=== Workspace Images ===")
for f in sorted(os.listdir(workspace_dir)):
    if f.endswith(('.png', '.jpg', '.jpeg')):
        p = os.path.join(workspace_dir, f)
        try:
            img = Image.open(p)
            print(f"{f}: {img.format}, {img.size}, {os.path.getsize(p)} bytes")
        except Exception as e:
            print(f"{f}: error {e}")

print("\n=== Artifacts Images ===")
for f in sorted(os.listdir(artifacts_dir)):
    if f.endswith(('.png', '.jpg', '.jpeg')):
        p = os.path.join(artifacts_dir, f)
        try:
            img = Image.open(p)
            print(f"{f}: {img.format}, {img.size}, {os.path.getsize(p)} bytes")
        except Exception as e:
            print(f"{f}: error {e}")
