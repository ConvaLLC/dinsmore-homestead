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
