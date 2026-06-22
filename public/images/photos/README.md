# Photos

Drop real images here, then point the matching `PhotoSlot` at them.

| Slot | Where it's used | Set `src` in |
|---|---|---|
| Portrait | About section | `src/components/sections/About.tsx` → `<PhotoSlot src="/images/photos/headshot.jpg" …>` |
| Black Star Tutoring | Community "moments" strip | `src/components/sections/Community.tsx` → `MOMENTS[0].src` |
| Dev.0 closing ceremony | Community "moments" strip | `MOMENTS[1].src` |
| FYC mentoring | Community "moments" strip | `MOMENTS[2].src` |

Until a `src` is set, each slot renders a tasteful gradient placeholder with the
monogram + caption, so the layout stays intact. Recommended: square/portrait
(3:4) for the headshot, landscape (4:3) for event photos. Optimize before
committing (≤ ~300 KB each).
