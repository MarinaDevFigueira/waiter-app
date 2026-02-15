# WaiterApp Design System

## Direction & Feel

**Product Domain:** Restaurant service app for staff - waiters, managers, kitchen coordinators accessing the ordering system during their shift.

**User Context:** Staff members clocking in, typically early morning or between service times. Need quick, no-friction access. Every second counts when customers are waiting.

**Feel:** Professional service space. Like a clean, organized staff entrance to a well-run restaurant. Warm but efficient. You belong here, you're part of the team.

**Signature Element:** Authentication uses centered cards on subtle tinted backgrounds - feels like a clean prep station rather than corporate SaaS. App pages use AppLayout with header showing WAITERAPP branding.

## Color Palette

**Inspiration:** White chef coats, stainless steel prep surfaces, warm wood serving trays, restaurant red branding (WAITERAPP), black aprons, warm pendant lighting before service, crisp white tablecloths.

**Primary Colors:**
- `bg-primary` - Restaurant red (oklch(0.577 0.245 27.325)) for branding and CTAs
- `text-primary-foreground` - White text on primary
- `bg-background` - Clean white surfaces
- `text-foreground` - Dark text for readability

**Secondary & Accent:**
- `bg-secondary/30` - Subtle tinted background for login (professional, not stark)
- `bg-card` - Clean card surfaces
- `border-border` - Subtle separation (not harsh)
- `bg-input/30` - Slightly darker inputs (inset feel)

**Temperature:** Warm but professional - not cold/corporate, not overly friendly/consumer.

## Depth Strategy

**Approach:** Clean borders with minimal elevation.

**Reasoning:** Matches organized equipment in a professional kitchen - structure through clean lines, not dramatic shadows.

**Implementation:**
- Cards: `border border-border` with `rounded-lg`
- Inputs: `border border-input` - slightly darker background (`bg-input/30`) for inset feel
- Focus states: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- No dramatic shadows - subtle separation only

## Typography

**Fonts:**
- Headings/Branding: `font-title` (Anton) - WAITERAPP logo
- Body/UI: `font-normal` (Inter) - all interface text

**Hierarchy:**
- Logo: `text-lg sm:text-xl font-bold font-title uppercase`
- Card titles: `text-xl font-semibold`
- Card descriptions: `text-sm text-muted-foreground`
- Labels: `text-sm font-medium`
- Inputs: `text-sm`

## Spacing

**Base unit:** Tailwind's default spacing scale (4px = 1 unit)

**Common patterns:**
- Card padding: `p-6`
- Form field spacing: `space-y-2` (within field), `space-y-4` (between fields)
- Card header: `space-y-3`
- Layout padding: `px-4 sm:px-6 md:px-8` (responsive)

## Layout Patterns

### Layout Constraints (CRITICAL)

**All pages must follow responsive layout constraints:**
- Full viewport: `w-screen h-screen` or `min-h-screen w-screen`
- Content container: `max-w-7xl` (1280px) and `max-h-[720px]`
- Always centered: `flex items-center justify-center`
- Responsive: content scales down naturally on mobile

### AppLayout (Main App Pages)

Used for authenticated app pages (home, foods list, etc.)

**Structure:**
- Full viewport: `w-screen h-screen flex flex-col items-center justify-start`
- Content wrapper: `max-w-7xl max-h-[720px]` - constrains all content
- Sticky header: inside content wrapper with `w-full bg-background shadow-sm sticky top-0 z-50`
- Main content: `w-full flex-1 overflow-y-auto flex justify-center`

**Usage:**
```jsx
import { AppLayout } from "@/components/layouts/app-layout";

<AppLayout>
  <YourPageContent />
</AppLayout>
```

**Implementation:**
```jsx
export function AppLayout({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start bg-background">
      <div className="w-full h-full max-w-7xl max-h-[720px] flex flex-col">
        <header className="w-full bg-background shadow-sm sticky top-0 z-50">
          {/* Header content */}
        </header>
        <main className="w-full flex-1 overflow-y-auto flex justify-center">
          <div className="w-full px-2 md:px-0 py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

### Auth Pages (Login, etc.)

No header/footer - clean focused experience.

**Structure:**
- Full viewport: `min-h-screen w-screen`
- Centered with constraints: `max-w-7xl max-h-[720px]`
- Subtle background: `bg-secondary/30`
- Card max-width: `max-w-md` (28rem = 448px)

**Implementation:**
```jsx
<div className="min-h-screen w-screen flex items-center justify-center bg-secondary/30 p-4">
  <div className="w-full h-full max-w-7xl max-h-[720px] flex items-center justify-center">
    <Card className="w-full max-w-md">
      {/* Card content */}
    </Card>
  </div>
</div>
```

## Component Patterns

### Cards

**Standard card:**
```jsx
<Card className="w-full max-w-sm">
  <CardHeader className="space-y-3">
    <CardTitle className="text-xl">Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Styling:**
- Border: `border border-border`
- Background: `bg-card`
- Radius: `rounded-lg`
- Padding: Header/Content use `p-6`, CardContent has `pt-0`

### Form Controls

**Input fields:**
- Border-only depth (no heavy shadows)
- Slightly darker background: `bg-input/30`
- Focus ring: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Validation: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`

**Labels:**
- Typography: `text-sm font-medium`
- Spacing: `space-y-2` from input

**Buttons:**
- Default (primary action): `variant="default"` - red background
- Full-width on mobile forms: `className="w-full"`
- Size variants: `size="lg"` for important CTAs

### Branding

WAITERAPP logo pattern (used in header and login):
```jsx
<h1 className="text-lg sm:text-xl font-bold font-title uppercase">
  <span className="text-primary">Waiter</span>
  <span className="font-extralight">App</span>
</h1>
```

## States

**Interactive elements:**
- Hover: Subtle background shifts (`hover:bg-primary/90`)
- Focus: Ring with color (`focus-visible:ring-ring/50 focus-visible:ring-[3px]`)
- Disabled: `disabled:opacity-50 disabled:pointer-events-none`
- Invalid: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`

## Navigation Context

**Authenticated pages:** Use AppLayout with header showing location
**Auth pages (login):** No header - clean, focused

## Testing

All interactive elements must have `data-testid`:
- Form inputs: `data-testid="login-email-input"`
- Buttons: `data-testid="login-submit-button"`
- Kebab-case naming convention

## What Makes This Different

Not generic dashboard templates. This is a **service tool for restaurant staff** - the design reflects:
- Quick access over elaborate onboarding
- Clean organization over visual flair
- Professional service space over consumer friendliness
- Warmth from the restaurant domain (wood, red accents) not arbitrary "friendly" colors
- Minimal friction - like clocking in, not logging into corporate software
