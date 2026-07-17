import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "./context";
import theme from "./theme/theme";

import "./app.css";
import Header from "./components/Header";
import ContactDetail from "./pages/ContactDetail";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import NewContact from "./pages/NewContact";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

const root = document.getElementById("root");
if (root !== null) {
  const appRoot = createRoot(root);
  appRoot.render(
    <React.Fragment>
      <ToastContainer position="bottom-right" theme="dark" />
      <AppProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home key="home" />} />
              <Route path="/contacts" element={<Contacts key="contacts" />} />
              <Route path="/new-contact" element={<NewContact key="new-contact" />} />
              <Route path="/contact/:id" element={<ContactDetail key="contact-detail" />} key="contact-detail"></Route>
              <Route path="/tasks" element={<Tasks key="tasks" />} />
              <Route path="/projects" element={<Projects key="projects" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AppProvider>
    </React.Fragment>
  );
}
