# NEXA Core AI

Redesign my existing NEXA website into a futuristic, premium, highly polished 3D AI SaaS platform.

IMPORTANT:

- Do NOT rebuild the website from scratch.

- Do NOT remove any existing features, routes, authentication, tools, pricing, billing, credits, or backend functionality.

- Preserve all existing functionality and content.

- Preserve the NEXA brand identity.

- Upgrade the visual design, interactions, animations, and 3D experience.

- The result must feel like a real premium AI startup product, not a gaming website.

DESIGN DIRECTION:

Create a dark futuristic interface inspired by high-end AI products, cinematic 3D interfaces, Apple-level polish, Linear/Vercel-level cleanliness, and modern WebGL experiences.

COLOR SYSTEM:

- Background: deep midnight navy / near-black (#050816)

- Primary accent: electric teal

- Secondary accent: warm amber/gold

- Subtle blue/violet atmospheric lighting

- White/off-white typography

- Avoid excessive gradients and excessive neon.

3D HERO EXPERIENCE:

Create a beautiful interactive 3D centerpiece behind/around the hero section.

The centerpiece should look like:

- A floating futuristic AI core/orb

- Several thin glowing rings orbiting around it

- Small particles and data points

- Subtle glass-like transparent layers

- Tiny floating UI/data elements

- Soft volumetric light

- Very subtle rotation and parallax

The 3D object should respond smoothly to:

- Mouse movement

- Cursor position

- Scroll

- Hover

Use WebGL/Three.js or React Three Fiber if appropriate.

IMPORTANT:

The 3D animation must be lightweight and optimized.

Do not make the page slow or cause high CPU/GPU usage.

Provide a graceful fallback for devices that cannot render WebGL.

HERO:

Headline:

"Everything you need. One intelligent workspace."

Keep the NEXA messaging professional.

Add:

- Primary CTA: "Explore Tools"

- Secondary CTA: "Try AI"

- Small live product/status indicator

- Animated statistics or capability indicators

- Subtle 3D depth behind the text

Make the hero feel cinematic but still extremely clean.

NAVIGATION:

Create a premium glassmorphism navigation bar:

- NEXA logo

- Tools

- Pricing

- About

- Credits

- Get Started

The navbar should become slightly more opaque when scrolling.

Add subtle hover animations.

TOOLS SECTION:

Turn the existing tool cards into premium interactive 3D cards.

Each card should:

- Slightly tilt toward the cursor

- Have realistic depth

- Have subtle glass material

- Have a soft shadow/glow

- Animate smoothly on hover

- Reveal additional information on hover

- Have a premium icon treatment

Do NOT overdo the effects.

Keep the existing tool categories and search/filter functionality.

When a user opens a tool, create a beautiful 3D/modal transition instead of an abrupt panel change.

PRICING:

Keep the existing pricing plans and billing functionality exactly as they are.

Redesign the pricing cards with:

- Glassmorphism

- Subtle 3D depth

- Animated border highlight

- Premium hover interaction

- Clear monthly/annual selector

- Strong visual hierarchy

Do NOT modify any Paddle/payment logic.

AUTHENTICATION:

Keep Google authentication and existing authentication logic untouched.

Do NOT replace or mock authentication.

DASHBOARD:

Make the dashboard feel like a futuristic AI command center.

Include:

- Animated credit meter

- Usage statistics

- Recent tools

- Quick actions

- Premium status

- Subtle 3D background elements

Keep the existing backend data and APIs.

MICRO-INTERACTIONS:

Add polished animations throughout the website:

- Smooth page transitions

- Button hover physics

- Magnetic CTA buttons

- Card tilt

- Scroll reveal

- Smooth modal transitions

- Animated counters

- Subtle loading animations

- Soft cursor-reactive lighting

Animations should feel premium and intentional, never distracting.

3D BACKGROUND:

Add a subtle interactive 3D environment:

- Floating particles

- Very thin geometric lines

- Abstract AI network nodes

- Slow-moving shapes

- Depth layers

Keep opacity low so the content remains readable.

MOBILE:

This is extremely important.

On mobile:

- Reduce or disable expensive 3D effects

- Maintain smooth scrolling

- Keep buttons accessible

- Keep cards readable

- Preserve all functionality

- Never allow the 3D background to interfere with content

PERFORMANCE:

Optimize aggressively:

- Lazy-load heavy 3D components

- Use requestAnimationFrame efficiently

- Reduce particle count on low-end devices

- Respect prefers-reduced-motion

- Avoid unnecessary React re-renders

- Compress assets

- Keep Lighthouse performance high

VISUAL QUALITY:

The final result should feel:

"Premium AI SaaS + futuristic 3D interface + minimal luxury"

NOT:

"Gaming website"

"Cyberpunk website"

"Overloaded neon dashboard"

"Cheap template"

Use lots of negative space, excellent typography, subtle depth, realistic lighting, and restrained motion.

TECHNICAL REQUIREMENTS:

- Reuse the existing project architecture.

- Reuse existing components wherever possible.

- Do not break existing routes.

- Do not break API calls.

- Do not break authentication.

- Do not break Paddle billing.

- Do not break credits/subscription logic.

- Do not remove existing tools.

- Keep the application production-ready.

- Make reusable components for 3D cards, 3D background, animated sections, and transitions.

- Use TypeScript where the existing project uses TypeScript.

- Ensure there are no console errors.

- Ensure the project builds successfully.

Before finishing:

1. Audit all existing pages.

2. Preserve all existing functionality.

3. Implement the new visual system consistently.

4. Test desktop and mobile layouts.

5. Fix any build/runtime errors.

6. Make the final UI feel like a premium commercial AI SaaS product.

The most important goal:

NEXA should look so polished and visually impressive that a potential client immediately thinks this is a professionally built AI SaaS product.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/11775231-656a-4186-9fab-ddb90377dce0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
