from django.core.exceptions import ValidationError


def oyk_image_size_validator(value, max_mb=2):
    """
    Validate the image size.

    Args:
        value (File): The image file to validate.
        max_mb (int): The maximum size of the image in MB.

    Raises:
        ValidationError: If the image size is greater than the maximum size.
    """
    max_size = max_mb * 1024 * 1024  # 2MB
    if value.size > max_size:
        raise ValidationError(
            f"File size must be no more than {max_mb}MB."
        )
