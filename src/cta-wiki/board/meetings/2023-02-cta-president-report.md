# 2023-02 CTA Executive Director Report

In the month of January, Jonathan and I led a four-week, four-session, beta-test of the "Transform Course", an introduction to the theology, epistemology, and technology of Christian Transhumanism.

### Transform Course
* 39 participants (across 4 sessions)
* heard from a number of people who were interested, but couldn’t make it, wanted recordings, etc
* participants interested in continuing discussions
* refined talking points
    * [Missions](https://www.christiantranshumanism.org/mission/)
    * [CTA Communications Styleguide](https://roamresearch.com/#/app/christiantranshumanism/page/E8IIyXDcd)
    * Super-Abundance as a focus?
    * identified strategically problematic areas of discussion

### Mission Statements
* [Updates to Mission Statements](https://www.christiantranshumanism.org/mission/)


### Website
* **Website down**
    * The members area of our website went down when Heroku deleted our database in December, with no recourse. 
        * We were on a paid plan, but the attached database was counted as a separate case.
        * Someone else describes this experience here:
            * https://news.ycombinator.com/item?id=34598563
    * This accelerated our ongoing move in the direction of low-code infrastructure. 
        * We decided on this direction for purposes of improving resilience and maintainability, and eliminating knowledge silos.

* **Website updated**
    * In the last month, I streamlined our website, and implemented the new system for membership management.
    * Current infrastructure
        * Heroku has been turned off
        * Github (currently free)
        * Netlify (currently free, may later be $19/month)
            * Redirects (can be implemented in other domain tools)
            * Eleventy.js build process (can be done locally)
            * Feed aggregation (can be done locally)
        * Mailchimp (currently free)
        * Stripe (percentage)
    * The current state of things is provisional, and open to ongoing improvement.
    * Areas of activity:
        * Joining
        * Paying members
        * Free members
        * RSS feeds
        * Profiles?

