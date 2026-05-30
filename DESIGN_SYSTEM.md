# Presidential Luxury Hotel Management System
## Visual Design System Reference

---

## 🎨 COLOR PALETTE

### Night Mode (Default)
```
Primary Background:    #0B0B0B  ████ Luxury Black
Royal Gold:            #C9A44C  ████ Rich Gold
Gold Accent:           #D4AF37  ████ Bright Gold
Midnight Blue:         #0F1C2E  ████ Deep Blue
Marble White:          #F5F5F5  ████ Elegant White
Text Primary:          #F5F5F5  ████ Primary Text
```

### Day Mode
```
Primary Background:    #FAFAFA  ████ Marble White
Royal Gold:            #B8943D  ████ Warm Gold
Gold Accent:           #C9A44C  ████ Daylight Gold
Midnight Blue:         #2A3B52  ████ Soft Blue
Marble White:          #FAFAFA  ████ Background
Text Primary:          #1A1A1A  ████ Dark Text
```

---

## 📐 TYPOGRAPHY

### Headings
```
Font Family:  'Playfair Display', 'Cinzel', serif
Font Weight:  700
Color:        var(--royal-gold)
Line Height:  1.2
Letter Spacing: 0.02em

h1: clamp(2.5rem, 5vw, 4.5rem)
h2: clamp(2rem, 4vw, 3.5rem)
h3: clamp(1.5rem, 3vw, 2.5rem)
h4: clamp(1.25rem, 2.5vw, 2rem)
```

### Body Text
```
Font Family:  'Inter', sans-serif
Font Size:    clamp(1rem, 1.5vw, 1.125rem)
Color:        var(--marble-white) or var(--text-primary)
Line Height:  1.8
Letter Spacing: normal
```

### Story Narratives
```
Font Family:  var(--font-heading)
Font Size:    1.125rem
Font Style:   italic
Font Weight:  400
Color:        var(--royal-gold)
Opacity:      0.9
Letter Spacing: 0.03em
```

---

## 📏 SPACING SYSTEM

```
--spacing-xs:   0.5rem   (8px)
--spacing-sm:   1rem     (16px)
--spacing-md:   1.5rem   (24px)
--spacing-lg:   2rem     (32px)
--spacing-xl:   3rem     (48px)
--spacing-2xl:  4rem     (64px)
--spacing-3xl:  6rem     (96px)
```

### Usage Guidelines
- Section padding: `var(--spacing-3xl)` top/bottom
- Card padding: `var(--spacing-lg)` to `var(--spacing-xl)`
- Element gaps: `var(--spacing-md)` to `var(--spacing-lg)`
- Micro-spacing: `var(--spacing-xs)` to `var(--spacing-sm)`

---

## ⚡ ANIMATION SYSTEM

### Timing Functions
```css
--transition-smooth:   all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-elegant:  all 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

### Theme Transitions
```css
background-color: 0.6s ease
color: 0.6s ease
```

### Component Animations
```
Fade In:           1s ease-out
Story Narrative:   1s ease-out
Button Hover:      0.3s smooth
Card Hover:        0.5s elegant
Modal Entrance:    Spring (stiffness: 300, damping: 25)
```

### Animation Philosophy
- **Purpose over decoration**
- **Smooth, never jarring**
- **Respect reduced motion preferences**
- **Consistent timing across components**

---

## 🎯 COMPONENT PATTERNS

### Buttons

**Primary Button**
```
Background: linear-gradient(135deg, #C9A44C, #D4AF37)
Color: #0B0B0B
Padding: 1rem 2.5rem
Border Radius: 2px
Hover: Box shadow with gold glow
```

**Secondary Button**
```
Background: transparent
Color: #C9A44C
Border: 2px solid #C9A44C
Padding: 1rem 2.5rem
Hover: Fill with gold
```

### Cards

**Standard Card**
```
Background: rgba(15, 28, 46, 0.3)
Border: 1px solid rgba(201, 164, 76, 0.2)
Border Radius: 4px
Padding: var(--spacing-xl)
Hover: Border color -> var(--royal-gold)
       Box shadow -> 0 15px 50px rgba(201, 164, 76, 0.3)
```

### Modals

**Confirmation Modal**
```
Background: linear-gradient(135deg, rgba(15, 28, 46, 0.95), rgba(11, 11, 11, 0.95))
Backdrop: rgba(11, 11, 11, 0.8) with blur(5px)
Border: 2px solid var(--royal-gold)
Border Radius: 4px
Max Width: 500px
Padding: 3rem 2rem
```

---

## 🏛️ FLOOR IDENTITY OVERLAYS

### Parking (Industrial Luxury)
```css
background: linear-gradient(135deg, 
  rgba(60, 60, 60, 0.85), 
  rgba(11, 11, 11, 0.9)
);
/* Mood: Secure, structured, professional */
```

### Lobby (Marble Elegance)
```css
background: linear-gradient(135deg, 
  rgba(245, 245, 245, 0.05), 
  rgba(15, 28, 46, 0.85)
);
/* Mood: Welcoming, refined, prestigious */
```

### Dining (Warm Sophistication)
```css
background: linear-gradient(135deg, 
  rgba(139, 90, 43, 0.15), 
  rgba(11, 11, 11, 0.85)
);
/* Mood: Inviting, comfortable, rich */
```

### Spa (Tranquil Calm)
```css
background: linear-gradient(135deg, 
  rgba(100, 149, 237, 0.1), 
  rgba(15, 28, 46, 0.85)
);
/* Mood: Peaceful, restorative, serene */
```

### Presidential (Exclusive Mystery)
```css
background: linear-gradient(135deg, 
  rgba(11, 11, 11, 0.95), 
  rgba(15, 28, 46, 0.95)
);
/* Mood: Private, distinguished, intimate */
```

---

## 📐 LAYOUT SYSTEM

### Container
```css
max-width: 1400px
margin: 0 auto
padding: 0 var(--spacing-md)
```

### Section
```css
padding: var(--spacing-3xl) 0

@media (max-width: 768px) {
  padding: var(--spacing-xl) 0
}
```

### Grid Patterns

**Auto-fit Grid**
```css
display: grid
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
gap: var(--spacing-lg)
```

**Two-Column Layout**
```css
display: grid
grid-template-columns: 1fr 2fr
gap: var(--spacing-xl)

@media (max-width: 1024px) {
  grid-template-columns: 1fr
}
```

---

## 🎨 VISUAL EFFECTS

### Glass Effect
```css
background: rgba(255, 255, 255, 0.05)
backdrop-filter: blur(10px)
-webkit-backdrop-filter: blur(10px)
border: 1px solid rgba(201, 164, 76, 0.1)
```

### Luxury Shadow
```css
box-shadow: 0 10px 40px rgba(11, 11, 11, 0.3)
```

### Gold Glow
```css
box-shadow: 0 0 30px rgba(201, 164, 76, 0.15)
```

### Hover Elevation
```css
transform: translateY(-10px)
box-shadow: 0 15px 50px rgba(201, 164, 76, 0.3)
transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🔤 TEXT STYLES

### Display Text (Hero Titles)
```css
font-family: var(--font-heading)
font-size: clamp(3rem, 6vw, 5rem)
font-weight: 700
color: var(--royal-gold)
line-height: 1.1
letter-spacing: 0.02em
```

### Section Titles
```css
font-family: var(--font-heading)
font-size: clamp(2rem, 4vw, 3rem)
color: var(--royal-gold)
margin-bottom: var(--spacing-lg)
```

### Body Text (Regular)
```css
font-family: var(--font-body)
font-size: 1.125rem
color: var(--marble-white)
line-height: 1.8
opacity: 0.9
```

### Label Text (Metadata)
```css
font-family: var(--font-body)
font-size: 0.875rem
color: var(--marble-white)
opacity: 0.7
text-transform: uppercase
letter-spacing: 1px
```

---

## 🎯 ICON SYSTEM

### Icon Sizes
```
Small:   1.5rem (24px)
Medium:  2rem (32px)
Large:   3rem (48px)
XLarge:  4rem (64px)
Hero:    6rem (96px)
```

### Icon Styling
```css
/* Standard icon with glow */
font-size: 3rem
filter: drop-shadow(0 0 15px rgba(201, 164, 76, 0.4))
```

### Icon Containers
```css
/* Circular icon background */
width: 70px
height: 70px
border-radius: 50%
display: flex
align-items: center
justify-content: center
background: rgba(201, 164, 76, 0.1)
border: 2px solid rgba(201, 164, 76, 0.3)
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile */
@media (max-width: 768px) {
  /* Adjust spacing, typography, layouts */
}

/* Tablet */
@media (max-width: 1024px) {
  /* Grid adjustments, sidebar collapse */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Full desktop experience */
}
```

### Mobile Adjustments
- Reduce heading sizes
- Stack grid layouts
- Collapse navigation
- Adjust spacing (xl → lg)
- Simplify animations

---

## 🎨 STATUS INDICATORS

### Confirmed/Active
```css
background: rgba(76, 201, 76, 0.2)
color: #4CC94C
border: 1px solid #4CC94C
```

### Pending/Warning
```css
background: rgba(201, 164, 76, 0.2)
color: var(--royal-gold)
border: 1px solid var(--royal-gold)
```

### In Progress
```css
background: rgba(76, 164, 201, 0.2)
color: #4CA4C9
border: 1px solid #4CA4C9
```

### Completed
```css
background: linear-gradient(135deg, var(--royal-gold), var(--gold-accent))
color: var(--luxury-black)
border: none
```

---

## 📊 VISUAL HIERARCHY

### Priority Levels

**Level 1 (Primary Focus)**
```
Color: var(--royal-gold)
Size: Largest
Weight: 700-800
Opacity: 1.0
```

**Level 2 (Secondary Focus)**
```
Color: var(--marble-white) or var(--text-primary)
Size: Medium-Large
Weight: 600-700
Opacity: 0.95
```

**Level 3 (Supporting)**
```
Color: var(--marble-white) or var(--text-primary)
Size: Medium
Weight: 400-500
Opacity: 0.8-0.9
```

**Level 4 (Metadata)**
```
Color: var(--marble-white) or var(--text-primary)
Size: Small
Weight: 400
Opacity: 0.6-0.7
```

---

## 🎭 DESIGN PRINCIPLES

### **Restraint**
- Use gold strategically, not everywhere
- Animations purposeful, not decorative
- Whitespace as luxury
- Less is more

### **Clarity**
- Clear visual hierarchy
- Purposeful contrast
- Readable typography
- Logical information flow

### **Calm**
- Smooth transitions
- No jarring movements
- Consistent timing
- Breathing room

### **Confidence**
- Bold when needed
- Subtle when appropriate
- Professional always
- Timeless choices

---

## 📚 USAGE EXAMPLES

### Page Hero Section
```jsx
<section className="page-hero">
  <div className="hero-overlay"></div>
  <div className="container">
    <h1>Page Title</h1>
    <p>Elegant description</p>
  </div>
</section>
```

### Content Section with Story
```jsx
<section className="section container">
  <StoryNarrative text="Your narrative" />
  <h2 className="section-title">Section Title</h2>
  <div className="grid-auto">
    {/* Content cards */}
  </div>
</section>
```

### Luxury Card
```jsx
<motion.div 
  className="luxury-card"
  whileHover={{ y: -10 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  <div className="card-icon">🏛</div>
  <h3>Card Title</h3>
  <p>Card description</p>
</motion.div>
```

---

## ✅ DESIGN CHECKLIST

Before deploying any new component:

- [ ] Uses CSS variables for colors
- [ ] Respects spacing system
- [ ] Works in both Day/Night modes
- [ ] Has smooth transitions
- [ ] Mobile responsive
- [ ] Maintains hierarchy
- [ ] Follows naming conventions
- [ ] Accessible contrast ratios
- [ ] Purposeful animations
- [ ] Consistent with brand

---

## 🎯 QUICK REFERENCE

**Primary Gold:** `var(--royal-gold)`  
**Background:** `var(--bg-primary)`  
**Text:** `var(--text-primary)`  
**Spacing:** `var(--spacing-[size])`  
**Transition:** `var(--transition-smooth)`  

**Heading Font:** `var(--font-heading)`  
**Body Font:** `var(--font-body)`

---

© 2026 Presidential Luxury Hotel Management System  
**Design System | Refined for Excellence**
