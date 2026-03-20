import io
import uuid
from PIL import Image, ImageDraw
from django.core.files import File
from django.db.models import ImageField


class OykImageField(ImageField):
    def __init__(
        self,
        *args,
        max_width=None,
        max_height=None,
        format="WEBP",
        shape=None,
        **kwargs,
    ):
        self.max_width = max_width
        self.max_height = max_height
        self.format = format
        self.shape = shape
        kwargs["max_length"] = 1200
        super().__init__(*args, **kwargs)

    def pre_save(self, model_instance, add):
        file = getattr(model_instance, self.attname)
        extension = self.format.lower()
        filename = f"{model_instance.id}-{str(uuid.uuid4())[:8]}.{extension}"
        if file and not file._committed:  # pylint: disable=protected-access
            # Open image
            pil_image = Image.open(file)

            # Convert to RGBA if necessary
            if pil_image.mode not in ("RGBA", "LA"):
                pil_image = pil_image.convert("RGBA")

            # Resize and crop to exact dimensions
            if self.max_width and self.max_height:
                # First, resize the image so the smaller dimension
                # matches the target
                orig_width, orig_height = pil_image.size
                ratio = max(
                    self.max_width / orig_width, self.max_height / orig_height
                )
                new_width = int(orig_width * ratio)
                new_height = int(orig_height * ratio)
                pil_image = pil_image.resize(
                    (new_width, new_height), Image.Resampling.LANCZOS
                )

                # Then crop from center to target dimensions
                left = (new_width - self.max_width) // 2
                top = (new_height - self.max_height) // 2
                right = left + self.max_width
                bottom = top + self.max_height
                pil_image = pil_image.crop((left, top, right, bottom))

            # Apply circular mask if shape is circle
            if self.shape == "circle":
                # Create a circular mask
                mask = Image.new("L", (self.max_width, self.max_height), 0)
                draw = ImageDraw.Draw(mask)
                draw.ellipse(
                    (0, 0, self.max_width - 1, self.max_height - 1), fill=255
                )

                # Create output image with transparent background
                output = Image.new(
                    "RGBA", (self.max_width, self.max_height), (0, 0, 0, 0)
                )
                output.paste(pil_image, mask=mask)
                pil_image = output

            # Save the image
            buffer = io.BytesIO()
            pil_image.save(
                buffer, format=self.format, optimize=True, lossless=True
            )
            buffer.seek(0)

            # Update the file
            new_file = File(buffer, name=filename)
            setattr(model_instance, self.attname, new_file)

        return super().pre_save(model_instance, add)
