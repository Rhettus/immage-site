// The feature showcase. Copy follows the user guide's own descriptions.
// A feature with `media` gets a full row (a still, or a before/after
// slider when `compare` is set); the rest are cards until screenshots exist.
export interface Feature {
  id: string;
  guide: string; // guide page id (and optional #anchor)
  title: string;
  lede: string;
  points: string[];
  media?: { src: string; alt: string; width: number; height: number; fit?: "top" };
  compare?: { before: string; after: string; alt: string; width: number; height: number };
}

export const features: Feature[] = [
  {
    id: "adjustments",
    guide: "adjustments",
    title: "The panels you already know",
    lede: "Basic, Tone Curve, HSL / Color, B&W Mix, Color Grading, Detail, Lens Corrections, Transform and Effects, in their usual order with their usual slider names.",
    points: [
      "Each slider drives one of darktable's modules. Hover a row to see which.",
      "No process version to pick: AgX tone mapping plays that part.",
      "Auto tone, white balance presets and a live histogram with scopes.",
    ],
    compare: {
      before: "media/basic-before.webp",
      after: "media/basic-after.webp",
      alt: "A raw photo of the front of a red vintage Ford, as shot and with Basic contrast, highlights, shadows, clarity and vibrance",
      width: 1560,
      height: 1167,
    },
  },
  {
    id: "color-grading",
    guide: "adjustments#color-grading",
    title: "Color grading on wheels",
    lede: "Shadows, Midtones, Highlights and Global, each with a hue, saturation and luminance. Drag a wheel, or switch to sliders.",
    points: [],
    media: {
      src: "media/color-grading.webp",
      alt: "The Color Grading wheels for Midtones, Shadows and Highlights, with the shadows pushed toward teal and the highlights toward orange",
      width: 1600,
      height: 984,
    },
  },
  {
    id: "masks",
    guide: "masks",
    title: "Masks, with AI selections",
    lede: "Brighten a face, darken the sky, warm the foreground. Each mask has its own sliders.",
    points: [
      "AI Subject, Sky, Background, People and Select Object.",
      "Brushes, linear and radial gradients, color, luminance and depth ranges.",
      "The usual keys: K brush, M linear, ⇧M radial, O overlay.",
    ],
  },
  {
    id: "heal",
    guide: "heal",
    title: "Heal and clone",
    lede: "Remove dust spots, blemishes and distractions. Immage picks the source; you can move it.",
    points: ["Q to open, A to visualize spots."],
    media: {
      src: "media/heal.webp",
      alt: "The Heal panel with one spot on the grille of a red vintage Ford and a dashed circle marking its source",
      width: 1600,
      height: 984,
    },
  },
  {
    id: "negative",
    guide: "negative",
    title: "Film negatives",
    lede: "Turn a camera scan of a negative into a positive with darktable's negadoctor, color or black and white, and a whole roll from one frame.",
    points: [],
  },
  {
    id: "merge",
    guide: "library#hdr-merge",
    title: "HDR and panorama merge",
    lede: "Merge bracketed or overlapping raws into one new DNG you keep editing.",
    points: [],
  },
  {
    id: "looks",
    guide: "presets-and-looks",
    title: "Presets and 53 film looks",
    lede: "Presets set sliders with an Amount; looks are film emulations with their own strength. Both preview live on your photo.",
    points: [],
    media: {
      src: "media/presets.webp",
      alt: "The Presets panel with live previews of the photo for B&W Contrast, Bright & Airy, Moody, Soft and Vivid, and the film look groups",
      width: 1600,
      height: 984,
    },
  },
  {
    id: "zones",
    guide: "zone-system",
    title: "The Zone System",
    lede: "See a black and white photo's tones as zones 0 to X, place them where you want them, and fine-tune any band of tones.",
    points: [],
    media: {
      src: "media/zones.webp",
      alt: "A black and white version of the Ford with the Zone System panel: a histogram of zones 0 to X and the placement curve",
      width: 1600,
      height: 984,
    },
  },
  {
    id: "denoise",
    guide: "adjustments#detail",
    title: "AI Denoise",
    lede: "Denoise a raw into a new DNG, with a before and after preview, then edit it like any other photo.",
    points: [],
  },
  {
    id: "export",
    guide: "export",
    title: "Export with frames and captions",
    lede: "To a folder or straight into an Immich album, with sizes, file-name templates, borders, captions and a watermark.",
    points: [],
  },
];
