import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import VisitPage from "./pages/Visit";
import EventsPage from "./pages/Events";
import EventDetailPage from "./pages/EventDetail";
import TicketConfirmPage from "./pages/TicketConfirm";
import TicketCancelPage from "./pages/TicketCancel";
import DonatePage from "./pages/Donate";
import MembershipPage from "./pages/Membership";
import DonateConfirmPage from "./pages/DonateConfirm";
import HistoryFamilyPage from "./pages/HistoryFamily";
import HistoryEnslavedPage from "./pages/HistoryEnslaved";
import HistoryTimelinePage from "./pages/HistoryTimeline";
import TheFarmPage from "./pages/TheFarm";
import WeddingsPage from "./pages/Weddings";
import PreservationPage from "./pages/Preservation";
import ConnectPage from "./pages/Connect";
import FAQPage from "./pages/FAQ";
import EducationRegisterPage from "./pages/EducationRegister";
import EducationPortalPage from "./pages/EducationPortal";
import EducationContentPage from "./pages/EducationContent";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminTimeslots from "./pages/admin/AdminTimeslots";
import AdminHeroSlides from "./pages/admin/AdminHeroSlides";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminEducation from "./pages/admin/AdminEducation";
import AdminMemberships from "./pages/admin/AdminMemberships";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={() => <PublicLayout><Home /></PublicLayout>} />
      <Route path="/visit" component={() => <PublicLayout><VisitPage /></PublicLayout>} />
      <Route path="/events" component={() => <PublicLayout><EventsPage /></PublicLayout>} />
      <Route path="/events/:slug" component={() => <PublicLayout><EventDetailPage /></PublicLayout>} />
      <Route path="/tickets/confirm" component={() => <PublicLayout><TicketConfirmPage /></PublicLayout>} />
      <Route path="/tickets/cancel" component={() => <PublicLayout><TicketCancelPage /></PublicLayout>} />
      <Route path="/donate" component={() => <PublicLayout><DonatePage /></PublicLayout>} />
      <Route path="/membership" component={() => <PublicLayout><MembershipPage /></PublicLayout>} />
      <Route path="/donate/confirm" component={() => <PublicLayout><DonateConfirmPage /></PublicLayout>} />
      <Route path="/history/family" component={() => <PublicLayout><HistoryFamilyPage /></PublicLayout>} />
      <Route path="/history/enslaved" component={() => <PublicLayout><HistoryEnslavedPage /></PublicLayout>} />
      <Route path="/history/timeline" component={() => <PublicLayout><HistoryTimelinePage /></PublicLayout>} />
      <Route path="/the-farm" component={() => <PublicLayout><TheFarmPage /></PublicLayout>} />
      <Route path="/weddings" component={() => <PublicLayout><WeddingsPage /></PublicLayout>} />
      <Route path="/preservation" component={() => <PublicLayout><PreservationPage /></PublicLayout>} />
      <Route path="/connect" component={() => <PublicLayout><ConnectPage /></PublicLayout>} />
      <Route path="/faq" component={() => <PublicLayout><FAQPage /></PublicLayout>} />

      {/* Education portal */}
      <Route path="/education/register" component={() => <PublicLayout><EducationRegisterPage /></PublicLayout>} />
      <Route path="/education" component={() => <PublicLayout><EducationPortalPage /></PublicLayout>} />
      <Route path="/education/:slug" component={() => <PublicLayout><EducationContentPage /></PublicLayout>} />

      {/* Admin */}
      <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/events" component={() => <AdminLayout><AdminEvents /></AdminLayout>} />
      <Route path="/admin/events/:id/timeslots" component={() => <AdminLayout><AdminTimeslots /></AdminLayout>} />
      <Route path="/admin/timeslots" component={() => <AdminLayout><AdminTimeslots /></AdminLayout>} />
      <Route path="/admin/hero-slides" component={() => <AdminLayout><AdminHeroSlides /></AdminLayout>} />
      <Route path="/admin/orders" component={() => <AdminLayout><AdminOrders /></AdminLayout>} />
      <Route path="/admin/donations" component={() => <AdminLayout><AdminDonations /></AdminLayout>} />
      <Route path="/admin/memberships" component={() => <AdminLayout><AdminMemberships /></AdminLayout>} />
      <Route path="/admin/education" component={() => <AdminLayout><AdminEducation /></AdminLayout>} />

      <Route path="/404" component={() => <PublicLayout><NotFound /></PublicLayout>} />
      <Route component={() => <PublicLayout><NotFound /></PublicLayout>} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
