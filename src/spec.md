# Specification

## Summary
**Goal:** Build a scenario-based conversation practice app with an AI avatar, live confidence/anxiety metrics, session summaries, and progress tracking with persistence.

**Planned changes:**
- Create a Home/Dashboard with app branding, four selectable scenario cards (Job Interview, First Date, Party, Networking Event), a “Start Practice Now” default-start button, and an accessible progress section.
- Implement a Conversation screen with a 3-panel responsive layout: avatar with mood/expression, chat history with distinct AI/user styling, and a metrics/tips panel (score meter, WPM, filler words, hesitations, 1–3 tips).
- Add voice input via in-browser speech-to-text (Web Speech API) with mic button states (idle/listening/error), editable recognized text, and an unsupported-browser fallback message.
- Add a “Retry response” flow to re-attempt the last user message and recompute metrics/tips while keeping session context and a coherent transcript.
- Implement a Session Summary view on session end: full transcript, confidence/anxiety progression chart, personalized tips summary, and saving the session for later viewing.
- Add a Progress Tracker: session history list (date/time, scenario, aggregate score) and charts/summaries derived from saved sessions; allow opening a saved session summary.
- Add Settings reachable from dashboard and conversation: avatar type selection (implemented at least via cartoon/GIF asset swapping), voice feedback on/off preference, language selection (stored preference; UI remains English), and dark/light mode with persistence.
- Implement backend scenario flows with deterministic, predefined prompts/personalities per scenario (no external LLM), plus APIs to start sessions and submit messages returning next AI message, metrics, tips, and avatar mood.
- Implement rule-based anxiety/confidence analysis (filler words, hesitations, self-doubt phrases, sentence length; optional pause/WPM inputs from voice) producing a 0–100 score and mood category, updated each turn.
- Persist sessions and user preferences in a Motoko single-actor canister keyed by Internet Identity principal when available, with local fallback when unauthenticated; provide list/fetch/save session APIs.
- Apply a cohesive modern visual theme across screens, responsive for desktop/tablet, avoiding blue/purple as the primary palette.
- (Optional) Add QR codes on scenario cards that deep-link to a pre-selected scenario, and optional browser text-to-speech playback for tips/suggested responses controlled by settings.

**User-visible outcome:** Users can pick or quick-start a scenario, chat (typed or voice) with an avatar that changes mood, see live confidence/anxiety metrics and tips, retry responses, end sessions to view/save summaries with charts, and review progress across saved sessions with persistent settings and history.
