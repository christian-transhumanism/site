  1. DONE: Retired Bootstrap 3/jQuery runtime — replaced CDN Bootstrap CSS/JS with local compatibility CSS and vanilla nav/collapse behavior
  2. Deprecated Google Analytics — Using old analytics.js, not GA4
  3. Wiki content missing frontmatter — ~77% of wiki files have no YAML frontmatter                  
  4. DONE: Eleventy 1.x → 3.x upgrade — package updated to @11ty/eleventy 3.1.2 and build verified                                                                      
  5. DONE: CSS minification — build now minifies emitted CSS and defaults local builds to offline feeds                                                 
  6. Monolithic .eleventy.js — 1193 lines, synchronous fs operations                                 
  7. Hardcoded navigation/footer — 30+ footer links not data-driven                                  
  ~~8. No breadcrumbs for wiki pages~~                                                                   
  9. DONE: Fixed navbar overlaps on mobile — body top offset now tracks the real fixed-nav height via shared JS/CSS
  10. Cache directory management — .cache/ 46MB, no auto-cleanup                                     
  11. HOLD OFF: External AI chat widget — Third-party CDN, no fallback                                         
  12. Book filter JS unclear                                                                         
