"""A small, runnable sample for Python syntax and semantic highlighting."""
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Frame:
    index: int
    grain: float = 0.042
    active: bool = True


def summarize(frame: Frame, note: Optional[str] = None) -> str:
    # Filmic comments should stay readable on a white code canvas.
    if not frame.active:
        raise ValueError("Raster is inactive")
    return f"frame={frame.index:04d} grain={frame.grain:.3f} {note or ''}"


if __name__ == "__main__":
    for index in range(3):
        print(summarize(Frame(index=index)))
