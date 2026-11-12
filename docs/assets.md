# Asset provenance

The Cemosis logo was supplied by the site owner. The three project images were
retrieved from the existing Cemosis website on 9 October 2026. Their original rights and credits remain applicable. This file
does not relicense those assets.

| Local file | Original URL | Use |
| --- | --- | --- |
| `public/images/logo-cemosis.png` | Owner-supplied `logoCemosis.png` (Hidalgo2 training assets) | Existing Cemosis logo; original file preserved |
| `public/images/building-thermal.jpg` | https://www.cemosis.fr/wp-content/uploads/2019/10/infrared-building-42671.jpg | 4fastsim-ibat project illustration |
| `public/images/micro-swimmer.jpg` | https://www.cemosis.fr/wp-content/uploads/2018/07/Micro-swimmers.jpg | Historical magnetic micro-swimmer illustration; replaced on current pages |
| `public/images/urban-mobility.jpg` | https://www.cemosis.fr/wp-content/uploads/2018/04/mobilit%C3%A9.jpg | Data4Urbanism project illustration |

`src/components/Surface.astro`, `public/favicon.svg` and the social-card artwork
are newly created vector illustrations. The surface is illustrative, not a
simulation result. The social PNG is rendered from `public/images/social-card.svg`.

## University visual language

Reference: <https://langagevisuel.unistra.fr/index.php?id=402> and the website
recommendations at <https://langagevisuel.unistra.fr/index.php?id=223>.

The official black university signature in `public/images/unistra-signature.svg`
was extracted unchanged from the inline SVG image served by the university's
public homepage, <https://www.unistra.fr/fr>, on 9 October 2026.

The two original web-font files in `src/assets/fonts/` were retrieved from:

- https://www.unistra.fr/themes/custom/studiometa/static/fonts/UnistraA-Regular.woff
- https://www.unistra.fr/themes/custom/studiometa/static/fonts/UnistraA-Bold.woff

The Unistra typography is reserved for University of Strasbourg communications,
as stated by the visual-language guide. It is used here for this university
research platform and retains its original rights. It is not licensed as part of
any future site-code license. The download portal at `index.php?id=93` still asks
for university authentication; the web fonts above are served publicly by the
university's official website.

The design uses Unistra A, black text on light backgrounds, square frames and
restrained university-web palette accents. It makes no claim of certification
by the communication department.

Fonts, discussion illustrations and video thumbnails are served locally. YouTube
players contact youtube-nocookie.com only after a visitor clicks Play. No analytics
are installed.


## Discussion media and videos

`src/data/discussion-media.json` records the original source URL, local file,
media type and size for each imported GitHub attachment. The source discussions
retain their authors, dates and links. Images retain their original rights;
importing them does not grant a new license. The QuickTime attachment in discussion
2167 is converted to H.264 MP4 for browser playback using ffmpeg.

`src/data/videos.json` is a curated selection of eight Ktirio Urban Building videos
from https://www.youtube.com/@Cemosis-Unistra, retrieved on 9 October 2026. Titles
are preserved from the channel. Thumbnails are local; movies remain hosted on
YouTube. Six older YouTube thumbnails referenced in discussions returned HTTP 404;
those videos remain source links rather than broken inline players.

Refresh after importing discussions with `pnpm import:media`. Previously downloaded
assets are reused; unavailable assets do not prevent a build. Conversion of new
QuickTime movies requires ffmpeg. The importer only accepts approved HTTPS media
hosts and known image/video types, with an 80 MB limit per file.

## Chicago reconstruction — NumPEx / SC26

Three original PNG screenshots supplied by Christophe Prud’homme on 9 October 2026, copied without modification from Downloads to `public/images/chicago/`: `screenshot (2).png` → `downtown.png`, `screenshot3 (1).png` → `river-lake.png`, `screenshot2 (2).png` → `overview.png`. Used for the homepage and a bilingual news article about the planned NumPEx poster at Supercomputing in November 2026. No new asset license is asserted. Booth name confirmed by the user: GENCI/TGCC Alice Recoque.

## CIFRE / AVNIR Energy illustration

Original PNG supplied by the site owner on 9 October 2026, copied unchanged to `public/images/cifre/industrial-structure.png`. Used in the bilingual CIFRE announcement and funding page, and the news card. The caption describes its illustrative use; no specific equipment identity or new license is asserted.

## JNL-G PhD illustration

User-supplied LNCMI magnets/power/cooling diagram, copied unchanged to `public/images/jnl-g/magnet-power-cooling.png` for the Pierre-Antoine Senger PhD announcement and news card. No new image license asserted.

## Exa-MA general assembly 2027

`public/images/exama/inria-bordeaux-numpex.png`: editorial composite of the Inria Talence building photograph (© Inria / Photo B. Fourrier), from https://www.inria.fr/fr/centre-inria-universite-bordeaux and its 2021-12/Inria-0333-044 (1).jpg asset, with the official NumPEx swirl from https://numpex.org/wp-content/uploads/sites/6/2024/12/Logo-NumPEx-couleurs-etat-v.4-web.png. Logo placement/composite produced with imagegen; source credit retained in both articles.

Brain Organ-on-Chip illustration: `public/images/brain-organ-on-chip/chip.png`, extracted unchanged from slide 3 of the user-provided presentation. Research cards reuse existing project illustrations; urban flood cards use the Ktirio city reconstruction to illustrate the modelling context.

SAGE-HPC: `public/images/sage-hpc/benchmark-families.png` copied unchanged from the local kickoff presentation assets (`NUMPEX/SAGE-HPC/slides.sage-hpc.kickoff.20260616/assets`). All project pages use local illustrations with alt text; urban images used for FLOOD are explicitly labelled as modelling context.


## Micro-swimming — licensed project illustration

`public/images/micro-swimmer/elastic-magneto-swimmer.png` is the graphical abstract
from Christophe Prud’homme, Vincent Chabannes, Laëtitia Giraldi, Agathe Chouippe
and Céline Van Landeghem, *Two-way Coupling of Fluid–Structure Interaction for
Elastic Magneto-Swimmers: A Finite Element ALE Approach* (2025), HAL **hal-05482283v1**.

- Source record: https://inria.hal.science/hal-05482283v1
- Source PDF: https://inria.hal.science/hal-05482283/file/article.magnetoswimmer.jfs.pdf
- License: **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/
- License evidence: the HAL PDF cover explicitly states CC BY 4.0; HAL API
  `licence_s` also reports https://creativecommons.org/licenses/by/4.0/.
  The arXiv copy uses a different distribution license; this asset was extracted
  from the HAL deposit, not from arXiv.
- Retrieved on 10 November 2026. Extracted unchanged from physical PDF page 2
  using Poppler `pdfimages -f 1 -l 2 -png`; image 005 is the 1986 × 790 pixel
  graphical abstract. No cropping, recolouring or scientific content changes.
- Source PDF SHA-256: `a8681032101954754d281812f7645297aa3241aaa9b6fa489f322abd248ef040`.
- Local PNG SHA-256: `14d6e9c4f2b4db27e48c64a19bad1ea701e0067e2147d3df3029fd4645568e13`.

Both project pages show all five authors, a source link and a CC BY 4.0 license
link. Research cards retain the author/license credit and link to the project
page for full attribution. The illustration uses `contain` fitting to preserve
its diagram labels. It depicts the team's numerical modelling framework, not a
microscopy photograph or a clinical result. The original 300 × 300 illustration
is preserved as a historical asset.
