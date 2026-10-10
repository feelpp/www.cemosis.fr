# Asset provenance

The Cemosis logo was supplied by the site owner. The three project images were
retrieved from the existing Cemosis website on 9 October 2026. Their original rights and credits remain applicable. This file
does not relicense those assets.

| Local file | Original URL | Use |
| --- | --- | --- |
| `public/images/logo-cemosis.png` | Owner-supplied `logoCemosis.png` (Hidalgo2 training assets) | Existing Cemosis logo; original file preserved |
| `public/images/building-thermal.jpg` | https://www.cemosis.fr/wp-content/uploads/2019/10/infrared-building-42671.jpg | 4fastsim-ibat project illustration |
| `public/images/micro-swimmer.jpg` | https://www.cemosis.fr/wp-content/uploads/2018/07/Micro-swimmers.jpg | Magnetic micro-swimmer project illustration |
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
