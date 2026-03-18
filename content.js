/* =====================================================
   content.js  —  ALL TECHGEO BLOG POSTS
   Each post:
     id          : unique string key
     section     : category bucket
     visibility  : 'public' | 'members'
     mediaType   : 'image' | 'video'
     media       : filename
     caption     : short caption (shown right)
     content     : full article text
===================================================== */

const allPosts = [

    /* ══════════════════════════════
       PUBLIC — SPORTS
    ══════════════════════════════ */
    {
        id: 'post-sports-1', date: '18 Mar 2026', section: 'sports', category: 'sports', visibility: 'public',
        title: 'Africa Cup of Nations: Kenya Qualifies',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Historic qualification for the Super Eagles',
        content: `Kenya's national football team secured a historic AFCON qualification after a commanding 3-0 victory over rivals in a sell-out Kasarani Stadium. The atmosphere was electric as thousands of fans draped in green and red erupted when the final whistle blew. Coach Engin Firat described it as the proudest moment of his coaching career on the continent. The team now prepares for an intensive training camp ahead of the tournament in Morocco. The qualification ends a 12-year drought for Kenyan football and signals a new era of investment and grassroots development in the beautiful game.`
    },
    {
        id: 'post-sports-2', date: '15 Mar 2026', section: 'sports', category: 'sports', visibility: 'public',
        title: 'Eliud Kipchoge Sets New World Record',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'The greatest marathon runner of all time strikes again',
        content: `Kenyan marathon legend Eliud Kipchoge shattered his own world record at the Berlin Marathon, crossing the finish line in a stunning 1:59:32 — beating his previous mark by over eight seconds. The performance, witnessed by tens of thousands of spectators lining the course, left commentators and fellow athletes lost for words. Kipchoge, now 40, said post-race that he wanted to prove that age is just a number when the mind is disciplined. His victory lap, wrapped in the Kenyan flag, was broadcast to millions worldwide and trended globally within minutes. Scientists are now studying his biomechanics as a benchmark for human physical potential.`
    },
    {
        id: 'post-sports-3', date: '12 Mar 2026', section: 'sports', category: 'sports', visibility: 'public',
        title: 'Harambee Stars Women Reach WAFCON Finals',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Historic run for Kenyan women\'s football',
        content: `The Harambee Starlets made history by reaching the Women's Africa Cup of Nations finals for the first time, defeating Nigeria 2-1 in a tense semi-final. Goals from Gentrix Shikangwa and Esse Akida put Kenya in front before Nigeria pulled one back in the dying minutes. The goalkeeper made a crucial save in stoppage time to seal the win. Head coach Chumba Katana called the result a "miracle built through years of sacrifice." The Starlets will face Zambia in the final, with millions of Kenyans expected to tune in from across the country and diaspora.`
    },

    /* ══════════════════════════════
       PUBLIC — HEALTH
    ══════════════════════════════ */
    {
        id: 'post-health-1', date: '17 Mar 2026', section: 'health', category: 'health', visibility: 'public',
        title: 'Digital Wellness: Managing Screen Time in 2025',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Balancing technology and well-being',
        content: `As our lives move increasingly online, managing screen time has become one of the most pressing health conversations of the decade. The average Kenyan adult now spends over 8 hours a day looking at a screen — at work, on social media, and during leisure. Health experts recommend the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. They also stress the importance of screen-free meals, phone-free bedrooms, and deliberate offline social time. Apps like Digital Wellbeing and Screen Time are powerful tools if used honestly. The key, doctors say, is not eliminating technology but building a healthier relationship with it — one intentional habit at a time.`
    },
    {
        id: 'post-health-2', date: '14 Mar 2026', section: 'health', category: 'health', visibility: 'public',
        title: 'Mental Health Awareness in East African Workplaces',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Companies leading the way in employee wellness',
        content: `A quiet revolution is taking place in East African offices: companies are beginning to take mental health seriously. From Safaricom to Andela and a growing number of tech startups, organizations are rolling out mental health days, subsidized therapy, and mindfulness workshops. Studies from the University of Nairobi show that every shilling invested in employee mental health returns four shillings in productivity. Yet stigma remains a massive barrier — many employees fear career consequences if they speak openly about anxiety, burnout, or depression. HR professionals are calling for policy reforms and visible leadership commitment to normalize mental health conversations at work. The tide is turning, but slowly.`
    },
    {
        id: 'post-health-3', date: '10 Mar 2026', section: 'health', category: 'health', visibility: 'public',
        title: 'Kenya Launches Free Universal Health Coverage Pilot',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'SHA rollout reaches 5 million households',
        content: `The Social Health Authority has enrolled over 5 million Kenyan households in its universal health coverage pilot, replacing the old NHIF with a more comprehensive framework. The new system promises outpatient, inpatient, maternity, and chronic disease coverage at zero point-of-care cost for enrolled members. Early reports from Kisumu, Mombasa, and Garissa indicate reduced patient debt and increased hospital visits for preventive care — a promising sign. Critics note that facility preparedness, drug availability, and claims processing remain bottlenecks. Health Cabinet Secretary Susan Nakhumicha has urged patience, saying the system will reach full functionality by mid-2026 as more healthcare workers are trained on the new platform.`
    },

    /* ══════════════════════════════
       PUBLIC — FINANCE
    ══════════════════════════════ */
    {
        id: 'post-finance-1', date: '16 Mar 2026', section: 'finance', category: 'finance', visibility: 'public',
        title: "Kenya's Tech Economy on the Rise",
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Nairobi — Silicon Savannah 2025 update',
        content: `Kenya continues to cement its status as Africa's premier tech investment destination. In 2025, Nairobi-based startups raised a combined $780 million — a 34% increase from the previous year — with fintech, agritech, and healthtech leading the charge. International venture capital firms from Silicon Valley, London, and Dubai are setting up local offices to be closer to the action. The government's e-Residency program, improved internet infrastructure, and a talented young workforce fluent in both code and business are drawing founders from across the continent. "The Silicon Savannah is no longer a metaphor," said one venture partner. "It's a functioning ecosystem that rivals Southeast Asia in ambition and speed."`
    },
    {
        id: 'post-finance-2', date: '13 Mar 2026', section: 'finance', category: 'finance', visibility: 'public',
        title: 'M-Pesa Crosses 60 Million Users Milestone',
        mediaType: 'image', media: 'logo.jpeg',
        caption: "Africa's most transformative financial platform",
        content: `Safaricom's M-Pesa has crossed the extraordinary milestone of 60 million active users across seven African countries, processing over $300 billion in transactions annually. The platform, which celebrated its 18th birthday this year, has evolved far beyond mobile money — it now underpins small business loans, insurance, savings, and international remittances. Research from the MIT Poverty Action Lab found that M-Pesa has lifted over 2% of Kenyan households out of extreme poverty by enabling women-run micro-enterprises. New partnerships with Visa and Google Pay are expanding M-Pesa's global reach, and the company is testing a blockchain-based cross-border rails system for faster, cheaper diaspora remittances.`
    },
    {
        id: 'post-finance-3', date: '09 Mar 2026', section: 'finance', category: 'finance', visibility: 'public',
        title: 'NSE Lists Three New Tech Companies in 2025',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Nairobi Securities Exchange enters a new era',
        content: `The Nairobi Securities Exchange welcomed three technology companies to its main investment segment in 2025 — the highest single-year addition in over a decade. Twiga Foods, Pezesha, and a leading solar energy fintech collectively raised KES 4.2 billion in their IPOs, attracting both institutional and retail investors. NSE CEO Geoffrey Odundo called it a "pivotal moment" for domestic capital markets and tech sector maturity. The listings signal that homegrown tech startups are increasingly choosing to stay and grow locally rather than seek offshore listings. Analysts see this as a maturing of the ecosystem, with long-term implications for pension fund diversification and wealth creation for ordinary Kenyans.`
    },

    /* ══════════════════════════════
       PUBLIC — POLITICS
    ══════════════════════════════ */
    {
        id: 'post-politics-1', date: '15 Mar 2026', section: 'politics', category: 'politics', visibility: 'public',
        title: 'East African Community Expands to 8 Nations',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Regional integration takes a historic step',
        content: `The East African Community made history by welcoming its 8th member state — the Democratic Republic of Congo — in a ceremony at the EAC headquarters in Arusha. Presidents from all member states signed the revised treaty, committing to deeper economic integration, free movement of persons, a common currency framework, and a shared digital identity system. The DRC's vast mineral wealth and 100-million-strong consumer market are expected to transform the bloc into one of the world's most significant economic zones by 2030. Critics point to unresolved security concerns in eastern DRC as a potential destabilizing factor, while proponents argue that deeper integration is precisely the tool needed to address regional instability sustainably.`
    },
    {
        id: 'post-politics-2', date: '11 Mar 2026', section: 'politics', category: 'politics', visibility: 'public',
        title: "Kenya's Digital ID Bill Passes in Parliament",
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'A turning point for digital governance in Africa',
        content: `Kenya's National Assembly passed the Digital Identity Bill with a 189-to-43 majority, creating the legal framework for a national biometric identification system linked to government services, healthcare, banking, and tax records. Proponents say it will eliminate ghost workers, reduce fraud in public tenders, and accelerate financial inclusion for the 4 million adults without formal ID. Civil society organizations have raised concerns about data privacy, the rights of stateless and marginalized communities, and potential government surveillance. The Data Protection Commissioner has been granted expanded powers under the bill to audit government databases. Implementation begins in Nairobi County, with a national rollout expected over 36 months.`
    },

    /* ══════════════════════════════
       PUBLIC — RELIGION
    ══════════════════════════════ */
    {
        id: 'post-religion-1', date: '14 Mar 2026', section: 'religion', category: 'religion', visibility: 'public',
        title: 'Interfaith Forum Promotes Peace Across the Region',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Religious leaders unite for dialogue and harmony',
        content: `Over 200 religious leaders from Christian, Muslim, Hindu, Sikh, and African traditional faith communities gathered in Nairobi for the 12th Annual Interfaith Peace Forum. The three-day summit produced a joint declaration committing signatories to counter hate speech on social media, support victims of religiously motivated violence, promote shared values in public school curricula, and engage youth in peace-building. Kenya's Chief Justice opened the forum by reminding delegates that the Constitution guarantees freedom of religion precisely because diversity is a national strength, not a weakness. The closing prayer, led simultaneously in four languages, drew a standing ovation from the assembled delegates.`
    },
    {
        id: 'post-religion-2', date: '08 Mar 2026', section: 'religion', category: 'religion', visibility: 'public',
        title: 'Nairobi Chapel Turns 50: A Legacy of Faith and Community',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Half a century of service to Nairobi',
        content: `Nairobi Chapel celebrated its 50th anniversary this month with a week of events that drew thousands of congregants, alumni, and community leaders. From its humble beginnings in a converted garage to a network of campuses serving over 15,000 weekly attendees, the church has been a constant presence in Nairobi's civic and social life. Its foundation has funded hundreds of bursaries for needy students, built water systems in Turkana, and runs one of the city's largest food banks. Senior Pastor Muriithi Wanjau reflected on five decades of ministry: "We didn't come to build a big church. We came to build a better city."`
    },

    /* ══════════════════════════════
       PUBLIC — ECONOMICS
    ══════════════════════════════ */
    {
        id: 'post-economics-1', date: '13 Mar 2026', section: 'economics', category: 'economics', visibility: 'public',
        title: "AfCFTA: Africa's Free Trade Area Shows Real Results",
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Intra-African trade up 18% since implementation',
        content: `Two years into full implementation of the African Continental Free Trade Area, the numbers are beginning to tell an encouraging story. Intra-African trade has grown by 18% — the fastest rate in 20 years — driven by reduced tariffs on manufactured goods, harmonized customs procedures at major border posts, and a digital trade platform connecting buyers and sellers across 54 countries. Kenya, Ethiopia, and South Africa are leading exporters within the zone. However, economists caution that infrastructure deficits, non-tariff barriers, and currency volatility continue to limit the agreement's full potential. A new $2 billion AfCFTA infrastructure bond is being structured to address bottlenecks at key cross-border corridors.`
    },
    {
        id: 'post-economics-2', date: '07 Mar 2026', section: 'economics', category: 'economics', visibility: 'public',
        title: 'Inflation Cools Across East Africa in Q1 2025',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Central banks signal possible rate cuts ahead',
        content: `Consumer price inflation across Kenya, Uganda, Tanzania, and Rwanda fell to its lowest level in three years during the first quarter of 2025, driven by improved food supply chains, a stronger shilling, and lower global fuel prices. Kenya's headline inflation dropped to 4.2% — within the government's target band — prompting the Central Bank of Kenya's Monetary Policy Committee to signal a potential 50 basis point cut at its June meeting. Analysts say easing rates could unlock billions in credit for small businesses and first-time homebuyers who have been locked out of the formal lending market by high interest costs. The region's combined GDP growth forecast has been revised upward to 5.8% for the full year.`
    },
    {
        id: 'post-economics-3', date: '03 Mar 2026', section: 'economics', category: 'economics', visibility: 'public',
        title: 'Green Bonds Fund Kenya\'s Renewable Energy Push',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'KES 30 billion raised for solar and wind projects',
        content: `Kenya has successfully issued its second sovereign green bond, raising KES 30 billion to fund geothermal expansion at Olkaria, offshore wind feasibility studies on the coast, and solar mini-grids for 200 off-grid communities in arid and semi-arid regions. International institutional investors from Europe, Japan, and the UAE oversubscribed the offer by 2.3 times — a strong signal of global appetite for African climate finance. The Treasury projects that the funded projects will add 900MW of renewable capacity by 2028 and create 14,000 construction and operations jobs. Kenya already generates over 90% of its electricity from renewable sources, making it a model for the continent's green energy transition.`
    },

    /* ══════════════════════════════
       PUBLIC — NEWS
    ══════════════════════════════ */
    {
        id: 'post-news-1', date: '18 Mar 2026', section: 'news', category: 'news', visibility: 'public',
        title: 'Starlink Expands Coverage Across Rural Kenya',
        mediaType: 'video', media: 'techgeo.mp4',
        caption: 'Satellite internet reaches remote communities',
        content: `SpaceX's Starlink satellite internet service has completed its rural expansion phase in Kenya, now covering all 47 counties with broadband speeds averaging 120Mbps. The rollout, accelerated by a government partnership announced in 2024, has connected over 800 public schools, 400 health facilities, and thousands of small businesses in areas where fiber and 4G coverage were previously unavailable. Teachers in remote Marsabit report accessing online curricula and video lessons for the first time. A form-four student in Turkana described submitting her KCSE mock exams online as "something I thought only happened in Nairobi." Starlink's monthly cost of KES 4,500 remains a barrier for low-income households, and advocacy groups are calling for a subsidized tier.`
    },
    {
        id: 'post-news-2', date: '16 Mar 2026', section: 'news', category: 'news', visibility: 'public',
        title: 'TechGeo Mobile App Launches on iOS and Android',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Download the app and never miss a story',
        content: `TechGeo is thrilled to announce the official launch of its mobile app on both the Apple App Store and Google Play Store. The app brings all of TechGeo's editorial content to your fingertips with a cleaner reading experience, push notifications for breaking news, offline reading for saved articles, and dark mode support. Early users are praising the smooth performance and intuitive layout. Members get access to all restricted sections directly from the app with seamless login. We built this app based on feedback from thousands of readers who told us they wanted TechGeo everywhere they go. Download it today — it's free, fast, and built with love from Nairobi.`
    },

    /* ══════════════════════════════
       PUBLIC — UPDATES
    ══════════════════════════════ */
    {
        id: 'post-updates-1', date: '12 Mar 2026', section: 'updates', category: 'updates', visibility: 'public',
        title: 'TechGeo Reaches 100,000 Monthly Readers',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Thank you for making this possible',
        content: `TechGeo has officially crossed 100,000 monthly unique readers — a milestone that felt distant when we started as a small newsletter three years ago. This growth belongs entirely to you: the readers who share our articles, debate our ideas in the comments, correct our occasional errors, and keep coming back for more. We are doubling our editorial team, launching a weekly podcast, and expanding our coverage to include Rwanda, Uganda, and Tanzania in greater depth. We are also introducing a community contributor program — if you are a writer, developer, researcher, or expert in any field, we want to hear your voice on TechGeo. This is just the beginning.`
    },

    /* ══════════════════════════════
       MEMBERS ONLY — ARTICLES
    ══════════════════════════════ */
    {
        id: 'post-articles-1', date: '17 Mar 2026', section: 'articles', category: 'articles', visibility: 'members',
        title: 'How to Start Coding in 2025: The Complete Roadmap',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'From zero to developer in 12 months',
        content: `Learning to code in 2025 is both easier and harder than ever before. Easier because free resources are everywhere — freeCodeCamp, The Odin Project, CS50, YouTube, and AI coding assistants mean that money is no longer a barrier to starting. Harder because the sheer volume of options creates analysis paralysis: should you learn Python, JavaScript, Rust, or Go? Should you focus on web, mobile, data science, or DevOps? The answer depends entirely on your goal. If you want to build websites and get a job quickly, start with HTML, CSS, and JavaScript — they are the lingua franca of the web. If data and AI interest you, Python is your fastest path. Build something real within your first 30 days, share it publicly, and keep going even when it feels impossible. The community is generous, the tools are incredible, and the opportunity in East Africa has never been larger.`
    },
    {
        id: 'post-articles-2', date: '14 Mar 2026', section: 'articles', category: 'articles', visibility: 'members',
        title: 'How Large Language Models Actually Work',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Under the hood of modern AI — no PhD required',
        content: `Large language models like GPT, Claude, and Gemini have gone from research curiosities to tools reshaping industries in under five years. But how do they actually work? At their core, LLMs are trained to predict the next token in a sequence of text — seemingly simple, yet this task, at massive scale, produces models that can reason, write, code, translate, and debate. The key innovation is the transformer architecture, introduced by Google researchers in 2017. Transformers use "attention mechanisms" that allow the model to weigh the relevance of every word in a sentence relative to every other word — enabling nuanced understanding of context across long passages. Training these models requires vast datasets, enormous compute, and months of fine-tuning and human feedback. The result is not a database of facts but a statistical model of human language and thought — powerful, remarkable, and still deeply imperfect.`
    },
    {
        id: 'post-articles-3', date: '10 Mar 2026', section: 'articles', category: 'articles', visibility: 'members',
        title: 'The State of Cybersecurity in Kenya 2025',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Are we doing enough to protect our digital economy?',
        content: `Kenya's digital economy is growing fast — but so are the threats targeting it. In 2024, Kenyan organizations reported over 860 million cyberattack attempts, a 30% rise from the previous year, according to the Communications Authority. Banking, healthcare, and government systems were the most targeted sectors. The most common attack vectors remain phishing emails, SIM-swap fraud, and unpatched software vulnerabilities — problems that are largely preventable with basic cyber hygiene. Yet a severe shortage of cybersecurity professionals, low awareness among SMEs, and inadequate incident response capacity leave the country exposed. The newly enacted Kenya Cyber Security Framework offers a solid foundation, but enforcement and investment must accelerate significantly if we are to protect the gains of digitization.`
    },

    /* ══════════════════════════════
       MEMBERS ONLY — EDUCATION
    ══════════════════════════════ */
    {
        id: 'post-education-1', date: '15 Mar 2026', section: 'education', category: 'education', visibility: 'members',
        title: 'Top 5 Tech Books Every Developer Should Own',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Essential reading that will change how you think',
        content: `Great developers are great readers. Here are five books that belong on every serious developer's shelf. First: "The Pragmatic Programmer" by Hunt and Thomas — a timeless guide to writing maintainable, elegant code and thinking like a craftsman. Second: "Clean Code" by Robert Martin — blunt, opinionated, and genuinely transformative for anyone who wants to write code that other humans can actually understand. Third: "Designing Data-Intensive Applications" by Martin Kleppmann — the definitive guide to building reliable, scalable systems. Fourth: "The Lean Startup" by Eric Ries — essential for developers who want to understand the business context of what they build. Fifth: "Atomic Habits" by James Clear — not a tech book, but the best book on the system behind consistent skill development. Read one chapter a day. Your future self will be grateful.`
    },
    {
        id: 'post-education-2', date: '11 Mar 2026', section: 'education', category: 'education', visibility: 'members',
        title: 'Best Free Online Courses for 2025',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'World-class learning at zero cost',
        content: `The best education in the world is now available for free online — and there are no more excuses. For web development, The Odin Project offers a comprehensive, project-based curriculum that takes you from zero to a full-stack developer entirely for free. For data science and machine learning, Andrew Ng's Deep Learning Specialization on Coursera (audit for free) remains the gold standard. For computer science fundamentals, Harvard's CS50 on edX is world-class and completely free. For product thinking, Reforge's essays and Google's UX Design Certificate are exceptional. For business and entrepreneurship, the MIT OpenCourseWare entrepreneurship tracks are taught by the same faculty as the $70,000 MBA program. Stop waiting for the right moment. Start today. Finish one module before you sleep tonight.`
    },

    /* ══════════════════════════════
       MEMBERS ONLY — LOVE
    ══════════════════════════════ */
    {
        id: 'post-love-1', date: '16 Mar 2026', section: 'love', category: 'love', visibility: 'members',
        title: 'Technology and Modern Love: Navigating Romance in 2025',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Love in the age of apps and algorithms',
        content: `Dating apps, long-distance video calls, AI relationship coaches, and social media validation loops have fundamentally changed how human beings find, start, and sustain romantic relationships. In Kenya, Tinder, Bumble, and homegrown apps like Mutu have millions of active users — yet loneliness remains a public health crisis. Psychologists point to the paradox of choice: when every swipe reveals a new potential partner, commitment feels increasingly optional. Couples who met online report higher initial satisfaction but faster disillusionment when the curated digital persona meets the messy, wonderful reality of a full human being. The antidote, therapists suggest, is intentionality: be clear about what you want, communicate honestly, and resist the algorithm's pull toward endless options. Love was never meant to be optimized.`
    },
    {
        id: 'post-love-2', date: '09 Mar 2026', section: 'love', category: 'love', visibility: 'members',
        title: 'Long-Distance Relationships: How Tech Keeps Love Alive',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Zoom, WhatsApp, and the geography of the heart',
        content: `For millions of East Africans separated from partners by work, school, or migration, technology has become the connective tissue of love. Daily video calls on WhatsApp and FaceTime, shared Netflix Watch Parties, multiplayer games played together across time zones, surprise food deliveries ordered remotely — couples are finding creative ways to stay emotionally close despite physical distance. Relationship counselors note that long-distance couples who set clear expectations, schedule regular virtual dates, and maintain a shared vision for reunion tend to build stronger communication habits than many physically co-located partners. The challenge comes when technology becomes a substitute for genuine intimacy rather than a bridge to it. Distance, it turns out, tests love most honestly.`
    },

    /* ══════════════════════════════
       MEMBERS ONLY — STORIES
    ══════════════════════════════ */
    {
        id: 'post-stories-1', date: '18 Mar 2026', section: 'stories', category: 'stories', visibility: 'members',
        title: 'TechGeo: How It All Began',
        mediaType: 'video', media: 'techgeo.mp4',
        caption: 'From a Nairobi garage to 100K readers',
        content: `TechGeo was born in a cramped apartment in Ngara, Nairobi, on a Thursday evening in 2022. Geoffrey and two friends had just left their corporate jobs — convinced that East Africa's technology story was being told poorly, or not at all, by existing media. They started with a newsletter sent to 47 contacts. By the third edition, strangers were forwarding it. Within six months, they had 10,000 subscribers and their first advertising partner. The name TechGeo — a fusion of technology and geography — was scribbled on a napkin at Java House on Kimathi Street and stuck because it captured exactly what they wanted to do: map the intersection of technology and African place. Three years on, the journey is just beginning.`
    },
    {
        id: 'post-stories-2', date: '13 Mar 2026', section: 'stories', category: 'stories', visibility: 'members',
        title: 'From Village to Silicon Valley: One Developer\'s Journey',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'An inspiring story of code and perseverance',
        content: `James Waweru grew up in a village outside Kisii with no electricity and a three-kilometer walk to school. His first encounter with a computer was at a church cyber café at age 14, where he paid KES 20 to spend an hour learning to type. Something lit up inside him that afternoon that has never gone out. He taught himself HTML from borrowed library books, won a government laptop scholarship, gained admission to a coding bootcamp in Nairobi, and four years later received a job offer from a major tech company in San Francisco. Today, at 29, James leads a team of 12 engineers, mentors aspiring developers in Kenya remotely, and has built a bursary fund that has sent six village kids to university. "Every child with a dream and an internet connection can go anywhere," he says. "I'm living proof."`
    },
    {
        id: 'post-stories-3', date: '06 Mar 2026', section: 'stories', category: 'stories', visibility: 'members',
        title: 'She Coded Her Way Out of Poverty',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Amina\'s story of resilience and code',
        content: `Amina Hassan from Garissa was 19 when her family lost everything in a flood. With no university fees and no clear future, she enrolled in a free coding program run by a local NGO partnering with Andela. Within three months she had built her first web app — a simple market price tracker for her mother's small business. Within a year she had a remote freelance contract with a UK startup. Today at 24 she earns more than her entire family combined, employs two part-time developers, and is building a livestock health monitoring app for pastoral communities in northern Kenya. "They told me technology was not for girls from Garissa," she says. "I wrote my answer in code."`
    },

    /* ══════════════════════════════
       MEMBERS ONLY — MEMES
    ══════════════════════════════ */
    {
        id: 'post-memes-1', date: '17 Mar 2026', section: 'memes', category: 'memes', visibility: 'members',
        title: 'Tech Memes of the Week: Edition 47',
        mediaType: 'video', media: 'techgeo.mp4',
        caption: 'When the build finally passes on Friday afternoon...',
        content: `Welcome to TechGeo's weekly meme roundup — the most important content on the internet. This week's highlights: the developer who confidently says "It should work" thirty seconds before everything breaks in production. The PM who assures the client that "it's just a small change" without consulting the engineering team. The Stack Overflow answer from 2009 that somehow still solves a 2025 problem perfectly. The AWS billing alert that arrives at 2am. And our personal favourite: the intern who accidentally deletes the main branch on their first day and goes completely unreachable. If any of these hit too close to home, you are in exactly the right profession. Have a great weekend. Touch some grass. The codebase will still be broken on Monday.`
    },
    {
        id: 'post-memes-2', date: '12 Mar 2026', section: 'memes', category: 'memes', visibility: 'members',
        title: 'AI Memes Are Getting Out of Hand — And We Love It',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'The internet discovers artificial intelligence',
        content: `The AI meme pipeline is fully operational and completely unhinged. This week brought us: the student who asked ChatGPT to write a 2,000-word essay, received a confident, beautifully formatted, entirely fabricated response full of fake citations, submitted it, and only found out during the oral defense. The developer who asked an AI to "fix the bug" and received code that fixed the bug by deleting the test. The manager who told the team "just use AI" for a complex infrastructure problem, as if AI is a magic word and not a very expensive autocomplete. The AI that was asked for a chocolate chip cookie recipe and responded with a 600-word essay on the philosophy of baking. We are living in historic times. Cherish them.`
    },

    /* ══════════════════════════════
       MEMBERS ONLY — QUOTES
    ══════════════════════════════ */
    {
        id: 'post-quotes-1', date: '15 Mar 2026', section: 'quotes', category: 'quotes', visibility: 'members',
        title: 'Quotes That Keep Builders Going',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Words that hit differently at 2am when the build is failing',
        content: `"The best way to predict the future is to invent it." — Alan Kay. "Move fast and break things" has aged poorly, but this one from Kay has only aged better. Here are this week's curated quotes for anyone building something in East Africa:\n\n"It always seems impossible until it's done." — Nelson Mandela\n\n"I have not failed. I've just found 10,000 ways that won't work." — Thomas Edison\n\n"The people who are crazy enough to think they can change the world are the ones who do." — Steve Jobs\n\n"Code is like humor. When you have to explain it, it's bad." — Cory House\n\n"First, solve the problem. Then, write the code." — John Johnson\n\nPrint one of these. Stick it above your monitor. Come back to it on the hard days.`
    },
    {
        id: 'post-quotes-2', date: '08 Mar 2026', section: 'quotes', category: 'quotes', visibility: 'members',
        title: 'African Proverbs That Apply to Startup Life',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Ancient wisdom for modern founders',
        content: `Our ancestors were solving complex coordination problems long before there were pitch decks. Here is proof:\n\n"If you want to go fast, go alone. If you want to go far, go together." — Perfect for the co-founder conversation.\n\n"A child who is not embraced by the village will burn it down to feel its warmth." — The cost of ignoring your team's culture.\n\n"Until the lion learns to write, every story will glorify the hunter." — Build your own narrative.\n\n"The forest would be silent if no bird sang except the one that sang best." — Ship imperfect products. Start.\n\n"Rain does not fall on one roof alone." — On shared infrastructure and ecosystem thinking.\n\nShare these with your team. Start a conversation. The wisdom was here before the venture capital.`
    },

    /* ══════════════════════════════
       MEMBERS ONLY — DARK SIDE
    ══════════════════════════════ */
    {
        id: 'post-darkside-1', date: '14 Mar 2026', section: 'darkside', category: 'darkside', visibility: 'members',
        title: 'The Algorithm is Watching You More Than You Know',
        mediaType: 'video', media: 'techgeo.mp4',
        caption: 'How recommendation engines are shaping your reality',
        content: `Every time you scroll TikTok, watch YouTube, or browse Facebook, an algorithm is building an extraordinarily detailed model of your psychology — your fears, desires, insecurities, political leanings, and emotional triggers. It does not do this because it is evil. It does this because your continued attention is the product. Former engineers at Meta, Google, and ByteDance have described in sworn congressional testimony how these systems are deliberately designed to maximize "engagement" — a metric that, in practice, means showing you content that provokes strong emotional reactions: outrage, anxiety, lust, tribalism. A 2020 MIT study found that false news spreads six times faster than true news on Twitter because false news tends to be more emotionally stimulating. Understanding this mechanism is not cynicism — it is the first step toward using these platforms on your own terms.`
    },
    {
        id: 'post-darkside-2', date: '05 Mar 2026', section: 'darkside', category: 'darkside', visibility: 'members',
        title: 'Cybercrime in Africa: The Hidden Billion-Dollar Epidemic',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'The threat growing faster than our defenses',
        content: `Africa loses an estimated $4 billion annually to cybercrime — a figure growing faster than any other region in the world, driven by rapid digitization outpacing security investment. Kenya, Nigeria, and South Africa are simultaneously the continent's most connected economies and its most targeted cyber victims. The most prevalent threats are not sophisticated nation-state attacks: they are SIM-swap fraud executed with corrupt telecom insiders, business email compromise targeting SMEs with fake supplier invoices, and romance scams that destroy families financially and emotionally. The human factor remains the weakest link. Over 70% of successful cyberattacks in Kenya begin with a phishing email that someone clicked despite knowing better. Two-factor authentication, software updates, and healthy skepticism of unsolicited messages remain the most powerful defensive tools available — and they are all free.`
    },

    /* ══════════════════════════════
       MEMBERS ONLY — CRIME
    ══════════════════════════════ */
    {
        id: 'post-crime-1', date: '16 Mar 2026', section: 'crime', category: 'crime', visibility: 'members',
        title: "Inside Kenya's Fight Against Online Scammers",
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'DCI cyber unit makes historic arrests',
        content: `Kenya's Directorate of Criminal Investigations cyber unit made its largest-ever cybercrime arrests in March 2025, dismantling a 47-member fraud syndicate that had defrauded over 12,000 victims across six East African countries of a combined KES 800 million. The operation, codenamed "Operation Samaki," involved six months of digital forensics, three undercover officers embedded in criminal Telegram channels, and international cooperation with Interpol and the FBI's cybercrime division. The suspects, aged 19 to 34 and predominantly university-educated, had operated call centers posing as bank fraud departments, investment platforms, and government agencies. Prosecutors are seeking minimum 10-year sentences under the Computer Misuse and Cybercrimes Act. The DCI is calling for more public cooperation in reporting suspicious digital contact.`
    },
    {
        id: 'post-crime-2', date: '04 Mar 2026', section: 'crime', category: 'crime', visibility: 'members',
        title: 'Digital Evidence: How Tech Is Solving Cold Cases',
        mediaType: 'image', media: 'logo.jpeg',
        caption: 'Forensics, AI, and the future of criminal justice',
        content: `Technology is quietly revolutionizing criminal investigation in Kenya. The DCI's new digital forensics laboratory, inaugurated in 2024, can extract data from damaged phones, recover deleted messages, trace cryptocurrency transactions, and match facial images across millions of CCTV frames in under an hour. AI tools are being used to analyze call data records across entire networks to map criminal associations — identifying suspects who would never have surfaced through traditional investigation. DNA profiling has resolved 14 cold cases in the past 18 months alone. Privacy advocates raise legitimate concerns about the potential for these tools to be abused for political surveillance, and the courts are still developing the legal standards for digital evidence admissibility. The technology outpaces the law — and that gap is one of the defining legal challenges of our era.`
    },
];