import imageio.v3 as iio
import os

filenames = ['pic1.png', 'pic2.png', 'pic3.png', 'pic4.png', 'pic5.png', 'pic6.png']
images = []

# Check if files exist
for filename in filenames:
    if not os.path.exists(filename):
        raise FileNotFoundError(f"Input file not found: {filename}")

# Read images
try:
    images = [iio.imread(filename) for filename in filenames]
except Exception as e:
    raise RuntimeError(f"Failed to read images: {e}")

# Verify image shapes
shapes = [img.shape for img in images]
if len(set(shapes)) != 1:
    raise ValueError("All images must have the same dimensions and channels")

# Write GIF
try:
    iio.imwrite('proj.gif', images, duration=500, loop=0)
except Exception as e:
    raise RuntimeError(f"Failed to write GIF: {e}")

print("GIF created successfully!")
