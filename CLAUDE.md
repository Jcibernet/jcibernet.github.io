# Portfolio Website - Juan Campias

## Project Overview
Personal portfolio website for Juan Ignacio Nicolás Campias, a Senior Data Engineer based in Argentina.

## Tech Stack
- **HTML5** - Semantic markup
- **CSS3** - Custom CSS (no frameworks like Tailwind)
- **JavaScript** - Vanilla JS for interactions (app.js)
- **Font Awesome 5** - Icons
- **Google Fonts** - Poppins font family

## File Structure
```
├── index.html          # Main HTML file
├── styles/
│   └── styles.css      # All styles (compiled from SCSS)
├── app.js              # Navigation and interactions
├── img/                # Images folder
├── CNAME               # Custom domain: www.juancampias.com
└── CLAUDE.md           # This file
```

## Design System

### Color Palette (Dark Mode - Default)
| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-primary` | `#171d31` | Main background |
| `--color-secondary` | `#055821` | Accent green |
| `--color-white` | `#FFFFFF` | Primary text |
| `--color-bg-0` | `#0d1117` | Deepest background |
| `--color-bg-1` | `#171d31` | Base background |
| `--color-bg-2` | `#1f2937` | Elevated surface |
| `--color-bg-3` | `#2a323f` | Card level |
| `--color-bg-4` | `#374151` | Highest elevation |
| `--color-grey-1` | `#dbe1e8` | Secondary text |
| `--color-grey-2` | `#b2becd` | Muted text |

### Typography
- Font: Poppins (400, 500, 600, 700, 800 weights)
- Fluid typography using `clamp()` for responsive sizing

### Spacing
- Fluid spacing system using CSS custom properties with `clamp()`
- Container padding: `clamp(1rem, 5vw, 18rem)`

## Page Sections
1. **Home** - Hero section with name, title, and CV download
2. **About** - Bio, stats cards, and timeline
3. **Portfolio** - Project showcase
4. **Contact** - Contact information and social links

## Owner Information (for content updates)

### Professional Summary
Senior Data Engineer with 6+ years of experience specializing in cloud infrastructure and big data solutions. Currently Sr Business Intelligence Engineer II at dLocal, handling billions of payment transactions across LATAM, APAC, and EMEA.

### Current Role
**Sr Business Intelligence Engineer II** | dLocal (Feb 2025 – Present)
- Apache Airflow pipelines for international payment processing
- AWS stack: EC2, S3, RDS, Lambda, Redshift, Glue, Kubernetes
- Redshift data warehouse optimization

### Key Achievements
- 200+ students graduated from Big Data program (Informatorio Chaco)
- Created Big Data specialization curriculum from scratch
- Reduced storage costs by 30% at Banco Sabadell (Snowflake consulting)

### Technical Skills
- **Languages:** Python, SQL, JavaScript
- **Cloud:** AWS (EC2, S3, RDS, Lambda, Redshift, Glue), GCP, Snowflake
- **Big Data:** Apache Airflow, Kubernetes, ETL/ELT
- **BI Tools:** Power BI, Looker Studio, Tableau, DAX
- **Databases:** PostgreSQL, MySQL, MongoDB, Redshift, Snowflake
- **Frameworks:** Django, Flask, Pandas, SQLAlchemy

### Contact
- Email: campiasjuan@gmail.com
- LinkedIn: linkedin.com/in/campiasjuan
- Website: juancampias.com
- Location: Argentina

## Development Notes

### Local Development
```bash
# Start local server
python3 -m http.server 8888

# View at http://localhost:8888
```

### Deployment
- Hosted on GitHub Pages
- Custom domain: www.juancampias.com
- Main branch: `master`
- Development branch: `dev`

### CSS Notes
- Uses fluid design with `clamp()` for responsive scaling
- Shadow system with multiple layers for depth
- Light mode available via `.light-mode` class on body
- Navigation controls fixed on right side (desktop) or bottom (mobile)

### Button Styles
- `.btn-flat` - Simple flat button (used for CV download)
- `.main-btn` - Original button with icon circle (legacy)
- `.main-btn.btn-teal` - Teal variant (available but unused)

## CV/Resume Link
Google Drive: https://drive.google.com/file/d/1Mod3W7FStJSkcu13ziLFH2QA9avXqK-2/view?usp=drive_link
