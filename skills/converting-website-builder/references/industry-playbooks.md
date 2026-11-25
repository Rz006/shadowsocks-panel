# Industry Playbooks

Use the closest match as defaults. Each lists: primary CTA · must-have sections · trust signals · integrations · schema type.

## Dentist / clinic / medical
- **CTA**: Book appointment (online booking) · Call
- **Sections**: hero with friendly team/patient photo, services (general, cosmetic, implants, emergency), new-patient offer, insurance & payment plans, meet the doctors, technology/comfort, reviews, FAQ (pain, cost, insurance), location/hours/map
- **Trust**: credentials, years, Google rating, before/after (with consent), associations
- **Integrations**: booking (practice software link, Calendly, NexHealth), click-to-call, Google Maps
- **Schema**: `Dentist` / `MedicalClinic`, `FAQPage`
- **Note**: health privacy — don't collect medical details in plain contact forms.

## Restaurant / café / bar
- **CTA**: Reserve a table · Order online · View menu
- **Sections**: full-bleed food hero, short story, menu (HTML, not PDF), signature dishes, hours & location, reservations, private events, gallery, reviews, Instagram link
- **Trust**: press, awards (real), ratings
- **Integrations**: OpenTable/Resy/SevenRooms, Toast/Square online ordering, Google Maps
- **Schema**: `Restaurant` with `servesCuisine`, `menu`, `acceptsReservations`

## Gym / fitness / yoga studio
- **CTA**: Start free trial / Book a free class
- **Sections**: energetic hero (real members), programs/classes, schedule, coaches, membership pricing, transformations (real, with consent), facilities, FAQ, location
- **Integrations**: Mindbody, Glofox, PushPress, Stripe
- **Schema**: `ExerciseGym` / `SportsActivityLocation`

## Salon / spa / beauty
- **CTA**: Book now
- **Sections**: services menu with prices & durations, stylists, gallery, gift cards, policies (cancellation), reviews, location
- **Integrations**: Fresha, Vagaro, Square Appointments, Booksy
- **Schema**: `BeautySalon` / `DaySpa` / `HairSalon`

## Trades / home services (plumber, electrician, roofer, cleaner, HVAC)
- **CTA**: Call now (sticky mobile bar) · Get a free quote
- **Sections**: hero with response promise, emergency banner, services, service areas, why us (licensed, insured, guarantee), process, before/after projects, reviews, financing, FAQ, quote form
- **Trust**: license numbers, insurance, guarantees, badges (only real), years
- **Integrations**: quote form → email/CRM (Jobber, Housecall Pro, ServiceTitan), click-to-call tracking
- **Schema**: `Plumber`, `Electrician`, `RoofingContractor`, `HVACBusiness`, `HomeAndConstructionBusiness`
- **Note**: location pages only with genuinely local content.

## Law firm / accountant / financial advisor
- **CTA**: Free consultation
- **Sections**: practice areas, attorney/advisor profiles with credentials, results/case studies (compliant), process, fees approach, testimonials (check bar/regulatory advertising rules), FAQ, contact
- **Tone**: calm, precise, reassuring; avoid guarantees
- **Schema**: `LegalService` / `Attorney` / `AccountingService` / `FinancialService`

## Real estate agent / property
- **CTA**: Book a valuation · View listings
- **Sections**: agent intro, featured listings, neighborhoods, sold results, valuation form, testimonials, market updates
- **Integrations**: IDX/MLS feed, Calendly
- **Schema**: `RealEstateAgent`

## Coach / consultant / course creator
- **CTA**: Book a discovery call · Join the program
- **Sections**: transformation-focused hero, who it's for / not for, method/framework, offers, case studies, about (story), lead magnet, FAQ
- **Integrations**: Calendly/Cal.com, Stripe, email list (ConvertKit, Beehiiv)
- **Schema**: `Person` + `Service`/`Course`

## SaaS / app / startup
- **CTA**: Start free trial · Book a demo
- **Sections**: hero with product screenshot, logo bar (real customers), problem, features as benefits, how it works, integrations, testimonials/case studies, pricing table, security/compliance, FAQ, final CTA
- **Schema**: `SoftwareApplication`, `Organization`

## E-commerce / product brand
- **CTA**: Shop now
- **Sections**: hero product, bestsellers, benefits, social proof/UGC, bundles, guarantee/returns, shipping info, FAQ, newsletter
- **Stack**: Shopify (or Shopify Buy Button on static site for tiny catalogs)
- **Schema**: `Product` with `offers`, `aggregateRating` only if real

## Photographer / creative / portfolio
- **CTA**: Check availability / Get in touch
- **Sections**: full-bleed portfolio, selected projects (case studies), services & packages, about, process, testimonials, inquiry form with date/budget
- **Design**: let the work dominate; minimal UI; fast image loading critical

## Nonprofit / church / community
- **CTA**: Donate · Volunteer · Visit
- **Sections**: mission, impact numbers (real), programs, stories, events, ways to give, transparency
- **Integrations**: Stripe/Donorbox/Givebutter, events calendar
- **Schema**: `NGO` / `Church`, `Event`
