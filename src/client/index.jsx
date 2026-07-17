/**
 * App Entry Point
 * ================
 * Layout: SiteHeader (Vetify shell) + RevealObserver + page routes
 * Styling: Tailwind CSS (app.css) — MUI ThemeProvider removed;
 *          MUI components still work standalone in legacy pages
 *          (Contacts, Tasks, Projects) — they carry their own theme.
 * Context: AppProvider wraps everything for global dark-mode state.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Global CSS — Tailwind
import './app.css';

// Context
import { AppProvider } from './context';

// Layout shell
import SiteHeader from './components/SiteHeader';

// Pages — Vetify shells
import Chat from './pages/Chat';
import Home from './pages/Home';
import Login from './pages/Login';

// Pages — original boilerplate (MUI-based, kept intact)
import ContactDetail from './pages/ContactDetail';
import Contacts from './pages/Contacts';
import NewContact from './pages/NewContact';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

const root = document.getElementById('root');
if (root !== null) {
  createRoot(root).render(
    <React.Fragment>
      <ToastContainer position="bottom-right" theme="dark" />
      <AppProvider>
        <BrowserRouter>
          {/* Global scroll-reveal observer — fires once on mount */}
          <RevealObserver />

          {/* Site-wide header (Vetify design) */}
          <SiteHeader />

          <Routes>
            {/* ── Vetify-shell pages ─────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />

            {/* ── Original boilerplate pages (MUI) ──────── */}
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contact/:id" element={<ContactDetail />} />
            <Route path="/new-contact" element={<NewContact />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/projects" element={<Projects />} />

            {/* ── Catch-all ──────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </React.Fragment>
  );
}
