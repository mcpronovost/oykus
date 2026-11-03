# Spaces and current workspace

Product decisions for how spaces relate to navigation and the shell UI.

## Current workspace

A **space** is the container for a user’s world or universe (plugins, library, notes, etc.).

- A newly created account has **no spaces** and therefore **no current workspace**.
- Until a space is selected as the current workspace, **space-related links in the sidebar are disabled**.
- Creating a space **selects that space** as the current workspace.

## Sidebar

Space-scoped nav items (Dashboard, Library, Notes, Manuscript, Forum, Game, and similar) require a current workspace. Without one, they stay visible but disabled.

**Settings** in the sidebar is **not** a settings page. It opens a short dialog to select (or switch) the current workspace.

## Header user section

The user block in the core header is clickable. It opens a dropdown with account actions, including:

- Edit profile
- Go to spaces
- Log out
