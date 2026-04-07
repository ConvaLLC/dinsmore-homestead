# Dinsmore Homestead Museum - Project TODO

## Phase 2: Assets & Database
- [x] Upload scraped images to CDN
- [x] Build database schema (events, timeslots, tickets, hero slides, education content, users, donations, email verifications)
- [x] Run db:push migration

## Phase 3: Backend API
- [x] Events CRUD procedures
- [x] Timeslots with capacity management
- [x] Ticket purchase procedures
- [x] Hero slider management procedures
- [x] PayPal payment integration (orders + capture)
- [x] Donation procedures (PayPal)
- [x] Email verification system (registration codes)
- [x] Education portal access control
- [x] Admin procedures (protected)

## Phase 4: Global Layout & Homepage
- [x] Vintage CSS theme (sepia tones, serif fonts, aged paper textures)
- [x] Global navigation with public/education separation
- [x] Homepage with hero slider (admin-controlled)
- [x] Homepage sections: upcoming events, visit info, history teaser, donate CTA

## Phase 5: Public Content Pages
- [x] Plan Your Visit page (hours, admissions, directions)
- [x] The Farm / What To See page
- [x] The Family / History pages
- [x] About / Foundation page
- [x] Preservation / Volunteers page

## Phase 6: Events & Ticketing
- [x] Events calendar view
- [x] Event detail page with timeslots
- [x] Ticket purchase flow with PayPal
- [x] Ticket confirmation page
- [x] Capacity limit enforcement per timeslot

## Phase 7: Donations
- [x] Donation page with PayPal
- [x] One-time and recurring giving options
- [x] Donation confirmation

## Phase 8: Education Portal
- [x] Email-verified registration form
- [x] Email verification code flow
- [x] Login page
- [x] Education portal dashboard (gated)
- [x] Lesson plans section
- [x] Historical research section
- [x] Educational resources section

## Phase 9: Admin Dashboard
- [x] Admin login protection
- [x] Hero slider management (add/edit/delete/reorder slides)
- [x] Event creation and editing
- [x] Timeslot management with capacity limits
- [x] Ticket sales overview
- [x] Education content management
- [x] Donation records view

## Phase 10: Testing & Polish
- [x] Vitest unit tests for backend procedures (22 tests passing)
- [x] Final visual polish
- [x] Checkpoint and deliver

## Future Enhancements
- [ ] PayPal client ID configuration (admin needs to provide sandbox/live credentials)
- [ ] Email service configuration (admin needs to provide SMTP or SendGrid credentials)
- [ ] Square payment integration (future migration from PayPal)
- [ ] Google Maps embed on Visit page
- [ ] Interactive family tree feature
- [ ] Interactive timeline feature
- [ ] Gift shop / merchandise store
- [ ] Membership management portal

## Deep Content Scrape & Integration
- [x] Map all 400 URLs on Dinsmorefarm.org
- [x] Deep scrape 148 pages in parallel (family bios, extended bios, enslaved people, farm, library, education)
- [x] Compile and organize scraped content into structured data files
- [x] Integrate 36 family biographies with full text into familyBios.ts
- [x] Update HistoryTimeline page with all 27 scraped timeline events
- [x] Update TheFarm page with scraped farm content
- [x] Update HistoryEnslaved page with scraped enslaved people profiles
- [x] Scrape all 10 education pages (lesson plans, programs, scout, summer, newsletters)
- [x] Seed education portal database with 8 real lesson plan and program content items
- [x] All 22 vitest tests passing after content integration

## Navigation Improvements
- [x] Add admin link in main navigation (visible to admin role only)

## Tour Scheduling System Redesign
- [x] Update backend: bulk timeslot generation by date range + interval (30min/1hr/custom)
- [x] Update backend: per-slot capacity tracking with sold ticket count
- [x] Update backend: individual slot edit (capacity, time, active/inactive)
- [x] Update backend: bulk slot delete for a date range
- [x] Admin: bulk generator UI (date range, start/end time, interval, capacity)
- [x] Admin: capacity table view (date, time, capacity, sold, remaining, status)
- [x] Admin: individual slot edit modal
- [x] Admin: sold-out badge in table
- [x] Public: show remaining tickets per slot on event/ticket purchase page
- [x] Public: sold-out badge on fully booked slots
- [x] Public: disable purchase button when slot is sold out

## Bug Fixes
- [x] Fix Create Event button in admin panel - does nothing when clicked

## Color Scheme
- [x] Sample greens from original Dinsmorefarm.org and apply to site color palette

## Navy & Blue Vintage Redesign
- [x] Define navy/blue vintage color palette with gold accents and cream backgrounds
- [x] Redesign index.css with full new palette, textures, and utility classes
- [x] Update Navigation and Footer with new design language
- [x] Update HeroSlider and Home page for maximum visual impact
- [x] Update all public pages with new palette
- [x] Update admin panel with new palette

## Homepage Split Hero
- [x] Replace full-screen hero slider with split layout: image slider left, action grid right

## Bug Fixes
- [x] Fix text legibility on split hero grid tiles - add strong gradient behind text labels

## Homepage Enhancements
- [x] Add hover animation to split hero grid tiles (label scale + sublabel slide-in)
- [x] Increase grid tile label font size to 0.9rem
- [x] Add "What's On" upcoming events strip below split hero

## Hero Layout Redesign
- [x] Restore full-width hero slider (100vw, full viewport height)
- [x] Move 6 quick-access tiles from right panel to horizontal strip at bottom of hero

## Tile Strip Color Redesign
- [x] Replace background images in hero tile strip with solid color squares using site palette

## Mobile Tile Alignment Fix
- [x] Fix text/icon vertical alignment being too high in hero tile strip on mobile
- [x] Rename "The Farm" tile to "The Homestead" and replace Camera icon with House icon

## Mobile Icon Removal
- [x] Hide tile icons on mobile, show only centered text labels

## Mobile Tile Polish
- [x] Increase mobile tile label font size to 0.9rem
- [x] Hide sublabel text on mobile
- [x] Add tap highlight (active state) on mobile tiles
- [x] Fix vertical centering of text in mobile tiles

## Plan Your Visit Page
- [x] Create PlanYourVisit.tsx with hours, directions, parking, and map sections
- [x] Register /plan-your-visit route in App.tsx
- [x] Wire nav links from tile strip and nav menu to the new page

## Map Fix
- [x] Fix map coordinates to correctly show Dinsmore Homestead at 5656 Burlington Pike, Burlington, KY

## Dynamic Availability Calendar
- [x] Add tRPC availability endpoint (slot counts per day for a month)
- [x] Build AvailabilityCalendar component (monthly grid + slot panel)
- [x] Integrate calendar into Events page

## Smart Directions Button
- [x] Add device-aware directions button to Visit page (opens Apple Maps on iOS, Google Maps on Android/desktop)

## Dynamic Availability Calendar
- [x] Add tRPC availability endpoint (slot counts per day for a month)
- [x] Build AvailabilityCalendar component (monthly grid + slot panel)
- [x] Integrate calendar into Events page

## Smart Directions Button
- [x] Add device-aware directions button to Visit page (opens Apple Maps on iOS, Google Maps on Android/desktop)

## Follow-up Features (Three Suggested)
- [x] Seed demo tour event with bulk time slots
- [x] Add compact availability calendar to homepage below What's On strip
- [x] Wire slot Book button to deep-link to ticket checkout with slot pre-selected

## Homepage Booking Flow Overhaul
- [x] Update schema: add ticket_types table (Adult $10, Child 5-15 $3, Under 5 Free, Member Free)
- [x] Reseed tour slots: Fri-Sun only, 1PM-4PM hourly (last tour 4PM), closed Dec 15-Apr 1, max 10 per slot
- [x] Update tRPC availability API: show dates with openings (no counts), show availability per slot only after date selected
- [x] Build inline expanding booking widget on homepage (calendar → time → ticket types → checkout)
- [x] Wire booking widget to order creation with multi-ticket-type quantities
- [x] Simplify UX: no slot counts on calendar, only show remaining after time selected

## Booking Flow Enhancements
- [x] Add inline "You're Booked!" confirmation screen in TourBookingWidget (date, time, ticket summary, confirmation number)
- [x] Wire Continue to Checkout to PayPal payment capture flow (already wired — needs PayPal credentials)
- [ ] Add email confirmation for completed bookings (tour details, directions, what to bring)

## Square Payment Migration
- [x] Replace PayPal helpers with Square-ready architecture in routers.ts
- [x] Create sandbox/mock checkout that simulates payment flow locally
- [x] Update TourBookingWidget to handle inline mock checkout (no redirect)
- [x] Add owner notification when new tour booking is created
- [x] Placeholder for email confirmation (ready to wire when email service available)
- [x] Clean up PayPal references from codebase

## Homepage Fixes (Readability + Pricing + What's On Removal)
- [x] Fix booking calendar dark mode — lighten background for readability against dark navy
- [x] Add cost or FREE label to each ticket type in quantity selection step
- [x] Remove "What's On at the Homestead" upcoming events strip section

## Book a Tour Tile Scroll
- [x] Wire "Book a Tour" hero tile to smooth-scroll to booking widget section

## Admin Bookings Dashboard
- [x] Add admin bookings page with upcoming tours grouped by date/time
- [x] Show guest counts, contact info, ticket breakdown per booking
- [ ] Add ability to cancel/refund orders from admin

## Membership Upsell in Booking Flow
- [x] Add memberships table to schema (senior $20, individual $35, family $60, friends $100)
- [x] Add membership step after ticket selection in TourBookingWidget
- [x] Show membership tiers with perks: free admission, 10% gift shop discount, newsletter, 2 guest passes
- [x] Include membership cost in order total
- [x] Store membership purchase with ticket order

## Optional Donation in Booking Flow
- [x] Add optional donation step in booking flow (any amount)
- [x] Include donation amount in order total
- [x] Store donation with ticket order

## Square Payment Integration
- [ ] Placeholder for Square credentials (ready to wire when provided)

## Bug Fixes (Admin Pages)
- [x] Fix AdminOrders hooks ordering error (React "Rendered more hooks than during the previous render")
- [x] Fix AdminMemberships hooks ordering error (same issue — hooks after early return)

## Admin Cancel/Refund Orders
- [x] Add cancel order backend procedure (update status, restore timeslot capacity)
- [x] Add refund tracking fields to schema (cancelledAt, cancelledBy, cancelReason, refundAmount)
- [x] Add cancel/refund UI in AdminOrders (expandable row detail with action buttons)
- [x] Show cancel confirmation dialog with reason field
- [x] Update order status badges to reflect cancelled/refunded states
- [x] Restore timeslot capacity when order is cancelled
- [x] Cancel associated membership if order included membership purchase
- [x] Write vitest tests for cancel/refund procedures (6 tests passing)
