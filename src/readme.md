src/
├── app/
│   ├── layout.tsx              # (Already exists) Sets up Fonts & Global CSS
│   └── page.tsx                # (We will rewrite this today) The "Scroll Container"
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # App Icon, Calendar Btn, TZ Selector, Dark Mode
│   │   └── Footer.tsx          # Copyright, ISNA method, Feedback
│   └── ui/
│       ├── ThemeToggle.tsx     # The "Night Mode" switch
│       ├── Icon.tsx            # Wrapper for SVGs (Arrows, Calendar icon)
│       └── ScrollArrow.tsx     # The Up/Down arrow button component
├── modules/
│   └── prayer/                 # THE CORE FEATURE
│       ├── components/
│       │   ├── PrayerHero.tsx  # The "Countdown" and "Next Prayer" view (Page 1)
│       │   ├── PrayerTable.tsx # The "Invisible Table" list (Page 2)
│       │   └── DateNav.tsx     # Left/Right arrows to change date
│       ├── hooks/
│       │   └── usePrayerTimes.ts # Logic: Uses 'adhan-js' to calculate times
│       └── utils.ts            # Helpers: Format time (AM/PM), get User Timezone
└── lib/
    └── date-utils.ts           # Helpers for Calendar/Date manipulation
