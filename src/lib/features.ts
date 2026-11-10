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
      "Lens Corrections has a searchable Lens drop-down, so a lens the file does not name, or names wrongly, can be picked by hand.",
    ],
    compare: {
      before: "media/basic-before.webp",
      after: "media/basic-after.webp",
      alt: "A raw photo of the front of a red vintage Ford, flat with every edit reset, and edited with Basic contrast, highlights and shadows plus the Kodachrome 64 film look",
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
      "Color Range masks with Hue, Hue Range, Minimum Chroma and Smoothness.",
      "Brushes, linear and radial gradients, color, luminance and depth ranges.",
      "The usual keys: K brush, M linear, ⇧M radial, O overlay.",
      "Fold a mask's shapes away with the chevron on its row.",
    ],
    media: {
      src: "media/masks.webp",
      alt: "A linear gradient mask from the top of the photo, shown with its overlay, and the Masks panel with the mask's own Exposure at -0.70",
      width: 1600,
      height: 984,
    },
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
    points: [
      "Independent Input and Working Profile menus, including installed ICC profiles.",
      "The profiles you chose last carry over to the next frame of the roll.",
    ],
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
    lede: "Presets set sliders with an Amount; looks are film emulations from João Almeida's t3mujinpack, with their own strength. Both preview live on your photo.",
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
    id: "film-simulation",
    guide: "film-simulation",
    title: "Film simulation",
    lede: "Render a photo as a film stock exposed, developed and printed on a paper, or scanned, with darktable's spektrafilm. It works from measured data of real films and papers, so you get their color, contrast, grain and halation.",
    points: [
      "Pick a preset, film and paper; set exposure, color, grain and halation.",
      "Export to Library saves a positive copy.",
    ],
    media: {
      src: "media/film-simulation.webp",
      alt: "The Film Simulation panel with Kodak Gold 200 on its matching paper, and the photo rendered with its color and grain",
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
    id: "interface",
    guide: "preferences",
    title: "Menus, themes and maps",
    lede: "File, Edit, Photo, View and Help menus list every command with its shortcut, and the interface comes in Dark, Darktable Grey and Light, or a theme of your own.",
    points: [
      "Profile > Load AgX Preset imports your AgX presets from darktable.",
      "Location maps expand over the photo, zoom with the wheel and search for places.",
      "Open a folder from the command line, as well as a photo.",
      "Help > User Guide opens this site's guide.",
    ],
  },
  {
    id: "export",
    guide: "export",
    title: "Export with frames and captions",
    lede: "To a folder or straight into an Immich album, with sizes, file-name templates, borders, captions and a watermark.",
    points: [],
  },
  {
    id: "print",
    guide: "print",
    title: "Print and soft proof",
    lede: "Print the photo or save it as a PDF, on a to-scale page in the viewer with the photo rendered in place.",
    points: [
      "Printer, paper, orientation, margins, photo size and placement.",
      "Cells layout prints selected photos as a contact sheet, with file names.",
      "Color managed by the printer, or converted with a printer ICC profile.",
      "Soft Proof (S) shows the photo as that profile prints it, with a gamut warning.",
    ],
    media: {
      src: "media/print.webp",
      alt: "The Print panel set to Save as PDF, with the photo placed on a Letter page in the viewer",
      width: 1600,
      height: 984,
    },
  },
];
