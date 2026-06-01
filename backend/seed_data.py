"""
Seed data for The Chronicle — premium news website.
Contains the 9 canonical articles + 3 opinion pieces + 2 video stories
+ breaking news ticker items.
"""
from datetime import datetime, timezone, timedelta
import uuid

now = datetime.now(timezone.utc)

def hours_ago(h):
    return now - timedelta(hours=h)

SEED_ARTICLES = [
    # ============= HERO FEATURED (rank 0) =============
    {
        "id": str(uuid.uuid4()),
        "slug": "global-climate-accord-paris-emissions-2040",
        "title": "Nations Reach Historic Climate Accord, Pledging Net-Zero by 2040",
        "subtitle": "After 14 days of tense negotiations, 196 countries signed the Paris II agreement, setting the most ambitious emissions targets in history.",
        "summary": "The breakthrough deal commits major economies to phase out unabated fossil fuels within fifteen years, marking what UN Secretary General called \"a turning point for humanity.\"",
        "body": (
            "PARIS — In a moment that delegates called both historic and overdue, representatives from 196 nations approved a sweeping climate accord early Saturday morning, committing the world's major economies to achieving net-zero greenhouse gas emissions by 2040 — a full decade ahead of the previous global benchmark.\n\n"
            "The agreement, dubbed Paris II, marks the most ambitious collective climate pledge ever ratified and follows fourteen days of intense negotiations that repeatedly threatened to collapse over disputes between industrialized economies and developing nations.\n\n"
            "\"This is the agreement our children will read about in their history books,\" said UN Secretary General Amara Okonkwo at the closing plenary, her voice catching as exhausted delegates rose in a standing ovation that lasted nearly four minutes. \"We have not solved the climate crisis tonight. But we have, finally, agreed to fight it together.\"\n\n"
            "Under the terms of the accord, signatory nations must submit binding implementation plans by 2026, with five-year review cycles enforced by an independent compliance body headquartered in Geneva. Unabated fossil fuel use must be phased out by 2039 in OECD economies and by 2042 in emerging markets — a compromise that several climate activists called insufficient but that economists described as the upper limit of political feasibility.\n\n"
            "Crucially, the deal establishes a $400 billion annual transition fund — financed by a tiered carbon levy on the world's 500 highest-emitting corporations — to support climate adaptation, clean energy infrastructure, and worker retraining programs in the Global South. India, Indonesia, and Nigeria led the bloc of developing nations whose late-stage demands for financial parity nearly derailed the talks on Thursday.\n\n"
            "Markets responded swiftly. Brent crude fell 3.8 percent in early Asian trading, while shares in major renewables firms including Ørsted, NextEra, and Tata Power surged between six and twelve percent. Analysts at Morgan Stanley described the agreement as \"the single largest reallocation signal in the history of global capital markets.\"\n\n"
            "Not everyone celebrated. A coalition of fossil fuel exporting nations — including Saudi Arabia, Russia, and Venezuela — signed the deal only after a last-minute amendment permitting limited carbon capture offsets through 2050. Indigenous climate advocates outside the venue held a silent vigil, holding signs reading \"Promises Are Not Policy.\"\n\n"
            "For now, however, the prevailing mood is one of cautious relief. After decades of warming forecasts growing steadily more dire, the world has — at least on paper — finally chosen a different trajectory."
        ),
        "category": "world",
        "tags": ["breaking", "exclusive"],
        "image_url": "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1600&q=80",
        "image_caption": "Delegates rise in applause as the Paris II climate accord is gaveled into force.",
        "author_name": "Elena Marchetti",
        "author_avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        "author_title": "Chief International Correspondent",
        "is_featured": True,
        "hero_rank": 0,
        "is_trending": True,
        "trending_rank": 1,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 9,
        "views": 48201,
        "published_at": hours_ago(2),
    },

    # ============= HERO SECONDARY (rank 1) =============
    {
        "id": str(uuid.uuid4()),
        "slug": "ai-act-passes-european-parliament-landmark",
        "title": "European Parliament Passes Sweeping AI Act, Setting Global Standard",
        "subtitle": "The first comprehensive law governing artificial intelligence imposes strict rules on facial recognition, predictive policing, and high-risk systems.",
        "summary": "The legislation, which takes effect in 18 months, is expected to shape how American and Asian tech giants build and deploy AI worldwide.",
        "body": (
            "BRUSSELS — The European Parliament voted Thursday by a margin of 523 to 46 to enact the AI Act, the world's first comprehensive legal framework governing artificial intelligence, ending a four-year legislative process that drew fierce lobbying from both technology companies and civil liberties groups.\n\n"
            "The law categorizes AI systems by risk level and imposes outright bans on several categories of use, including real-time biometric surveillance in public spaces, social scoring by governments, and predictive policing based on profiling. Foundation models above a defined compute threshold — encompassing the largest systems from OpenAI, Anthropic, Google, Mistral, and Meta — face the strictest transparency, evaluation, and red-teaming obligations.\n\n"
            "\"This is not a law against innovation,\" said MEP Sara Verstraete, the bill's lead author. \"It is a law that says innovation must respect the dignity, safety, and rights of every European.\"\n\n"
            "Industry response was mixed. The European Commission's own impact assessment estimates compliance costs of roughly €1.6 billion annually for the largest providers. Several US-based foundation model developers signaled that they may delay or restrict launches in the EU market while internal teams adapt — a strategy that mirrors the early rollout of GDPR. Smaller European AI startups, however, welcomed the regulatory clarity, arguing that uncertainty had been a greater burden than rules.\n\n"
            "The Act's enforcement architecture is unprecedented in scope. A new AI Office in Brussels, staffed with technical evaluators and lawyers, will conduct conformity assessments and impose fines of up to seven percent of global annual turnover for the most serious violations — a higher ceiling than GDPR's four percent.\n\n"
            "Privacy advocates praised the outcome but warned that enforcement, not legislation, will determine whether the AI Act becomes a genuine guardrail or merely a polite suggestion. Compliance grace periods extend through mid-2027 for most provisions."
        ),
        "category": "technology",
        "tags": ["analysis"],
        "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
        "image_caption": "MEPs vote in the European Parliament's Strasbourg chamber.",
        "author_name": "David Müller",
        "author_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        "author_title": "Technology Editor, Brussels",
        "is_featured": True,
        "hero_rank": 1,
        "is_trending": True,
        "trending_rank": 2,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 7,
        "views": 31420,
        "published_at": hours_ago(4),
    },

    # ============= HERO SECONDARY (rank 2) =============
    {
        "id": str(uuid.uuid4()),
        "slug": "federal-reserve-rate-cut-markets-rally",
        "title": "Federal Reserve Cuts Rates by Half Point as Inflation Cools",
        "subtitle": "The aggressive move, larger than markets had expected, sent equities to record highs and triggered the steepest one-day drop in the dollar this year.",
        "summary": "Chair Jerome Powell signaled the central bank now views growth — not inflation — as the primary risk to the US economy heading into 2026.",
        "body": (
            "WASHINGTON — The Federal Reserve cut its benchmark interest rate by half a percentage point on Wednesday, a more aggressive move than the quarter-point reduction most economists had anticipated, and one that Chair Jerome Powell framed as a decisive pivot toward supporting employment as inflation continues its slow descent toward the central bank's two percent target.\n\n"
            "The decision brings the federal funds rate to a target range of 4.25 to 4.50 percent and marks the second cut in three months, signaling that the Fed has officially shifted its primary concern from price stability to labor market resilience. Markets reacted swiftly: the S&P 500 closed up 1.7 percent at a fresh record high, the Nasdaq climbed 2.3 percent, and the dollar index posted its steepest single-day decline since March.\n\n"
            "\"Inflation has eased substantially over the past year, and labor market conditions have come into better balance,\" Powell said at his post-decision press conference. \"With that progress, the risks to achieving our employment and inflation goals are now roughly balanced. We will continue to make our decisions meeting by meeting.\"\n\n"
            "The cut was not unanimous. Two members of the Federal Open Market Committee dissented in favor of a smaller quarter-point reduction, citing residual concerns about services inflation and the strength of recent wage data. Their dissent — the first split decision in nearly two years — underscores the genuine uncertainty among policymakers about the speed of the path ahead.\n\n"
            "Treasury yields fell across the curve, with the 10-year note settling at 3.61 percent, its lowest level since early 2024. Mortgage rates, which track longer-dated Treasuries, are expected to follow within days, providing potential relief to a housing market that has frozen under the weight of historically high borrowing costs."
        ),
        "category": "business",
        "tags": ["breaking"],
        "image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
        "image_caption": "Jerome Powell addresses reporters following the FOMC rate decision.",
        "author_name": "Rebecca Liu",
        "author_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
        "author_title": "Markets & Economy Correspondent",
        "is_featured": True,
        "hero_rank": 2,
        "is_trending": True,
        "trending_rank": 3,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 6,
        "views": 28760,
        "published_at": hours_ago(6),
    },

    # ============= HERO SECONDARY (rank 3) =============
    {
        "id": str(uuid.uuid4()),
        "slug": "webb-telescope-water-discovery-exoplanet",
        "title": "James Webb Telescope Detects Water Vapor on Earth-Like Exoplanet 41 Light-Years Away",
        "subtitle": "The finding, on a rocky world orbiting a quiet red dwarf, is the strongest atmospheric evidence yet of conditions potentially compatible with liquid water.",
        "summary": "Astronomers caution the detection is not proof of life — but it transforms LHS 1140b from a curiosity into the most promising habitable-zone candidate ever observed.",
        "body": (
            "BALTIMORE — Astronomers using the James Webb Space Telescope announced on Monday the detection of water vapor in the atmosphere of LHS 1140b, a rocky planet 41 light-years from Earth orbiting in the habitable zone of a small, quiet red dwarf star. The discovery represents the strongest spectroscopic evidence yet of atmospheric water on a temperate, terrestrial world beyond our solar system.\n\n"
            "The team, led by Dr. Reina Hashimoto of the Space Telescope Science Institute, observed the planet during 32 transits over an 18-month period. By analyzing the precise way starlight filtered through its atmosphere, they identified clear spectral signatures consistent with water vapor at a confidence level of 4.7 sigma — well above the threshold typically considered a definitive detection in astronomy.\n\n"
            "\"This is not proof of life,\" Hashimoto emphasized at a NASA briefing. \"It is, however, the first time we have observed water vapor in the atmosphere of a planet that could plausibly support liquid water on its surface. That distinction matters enormously.\"\n\n"
            "LHS 1140b is approximately 1.7 times Earth's diameter and roughly 6.5 times Earth's mass — placing it in the category astronomers call \"super-Earths.\" Its host star is a small, dim, and remarkably stable red dwarf, characteristics that significantly improve the odds that any atmosphere the planet possesses has not been stripped away by stellar radiation, the fate believed to have befallen many similar worlds."
        ),
        "category": "science",
        "tags": ["exclusive"],
        "image_url": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
        "image_caption": "An artist's rendering of the exoplanet LHS 1140b orbiting its red dwarf host star.",
        "author_name": "Dr. Marcus Aldridge",
        "author_avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        "author_title": "Science Correspondent",
        "is_featured": True,
        "hero_rank": 3,
        "is_trending": True,
        "trending_rank": 4,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 8,
        "views": 22014,
        "published_at": hours_ago(10),
    },

    # ============= MAIN GRID =============
    {
        "id": str(uuid.uuid4()),
        "slug": "japan-elections-yui-tanaka-prime-minister",
        "title": "Japan Elects First Female Prime Minister in Generational Shift",
        "subtitle": "Yui Tanaka's victory ends 18 months of political turbulence and signals a clear mandate for sweeping economic reform.",
        "summary": "The 52-year-old former central banker promised a \"government that listens, that delivers, and that finally reflects all of Japan.\"",
        "body": (
            "TOKYO — Yui Tanaka was sworn in as Japan's first female prime minister on Tuesday, capping a decisive electoral victory that ended eighteen months of political turbulence and signaled a clear generational and ideological reset for the world's third-largest economy.\n\n"
            "Tanaka, 52, a former Bank of Japan deputy governor and the leader of a centrist reform coalition, promised in her inaugural address \"a government that listens, that delivers, and that finally reflects all of Japan.\" She is the youngest person to hold the office in more than three decades and the first prime minister born after the country's 1980s economic miracle had already begun to fade.\n\n"
            "Her platform focuses on three priorities: structural economic reform aimed at reviving wage growth and productivity, an ambitious overhaul of Japan's immigration framework to address acute labor shortages, and a recalibrated security policy emphasizing closer technological cooperation with European partners alongside the longstanding US alliance. Tanaka has also pledged to convene a national commission on demographic policy within her first hundred days."
        ),
        "category": "politics",
        "tags": ["breaking"],
        "image_url": "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&q=80",
        "image_caption": "Prime Minister Yui Tanaka delivers her inaugural address at the National Diet.",
        "author_name": "Hiroshi Yamamoto",
        "author_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        "author_title": "Asia Bureau Chief",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": True,
        "trending_rank": 5,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 5,
        "views": 18904,
        "published_at": hours_ago(12),
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "nvidia-shipments-quantum-chip-record",
        "title": "Nvidia Unveils Quantum-Hybrid Chip, Reshaping AI Hardware Race",
        "subtitle": "The Atlas-1 processor combines classical GPU cores with cryogenic quantum coprocessors, promising 50x speedups for specific workloads.",
        "summary": "The announcement sent Nvidia shares up 8 percent and raised fresh questions about the future of AMD, Intel, and the wider semiconductor industry.",
        "body": (
            "SANTA CLARA — Nvidia unveiled Atlas-1 on Tuesday, a long-rumored quantum-hybrid processor that pairs the company's signature GPU architecture with a small array of cryogenically cooled quantum coprocessors on a single accelerator board — a development that analysts believe could reshape the next decade of high-performance computing.\n\n"
            "In a meticulously choreographed keynote at the company's San Jose campus, CEO Jensen Huang demonstrated benchmarks showing Atlas-1 outperforming Nvidia's previous flagship by factors ranging from twelve to fifty times on certain optimization, simulation, and post-training inference workloads. \"This is not a faster GPU,\" Huang said. \"This is a different kind of computer.\"\n\n"
            "Industry reaction was rapid. Shares in Nvidia closed up 8.2 percent. AMD, Intel, and several smaller AI-chip startups saw their share prices fall between two and eleven percent."
        ),
        "category": "technology",
        "tags": ["exclusive", "analysis"],
        "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&q=80",
        "image_caption": "Nvidia CEO Jensen Huang demonstrates the Atlas-1 processor on stage.",
        "author_name": "Priya Chandrasekaran",
        "author_avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        "author_title": "Senior Technology Reporter",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 6,
        "views": 15302,
        "published_at": hours_ago(14),
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "venice-biennale-2026-curator-vision",
        "title": "Venice Biennale 2026 to Center on \"The Unfinished Earth\"",
        "subtitle": "Curator Aïda Diawara unveils a sweeping program that places climate, migration, and digital identity at the heart of contemporary art.",
        "summary": "Eighty-three participating nations will respond to a single, urgent question: what does it mean to inherit a world still being made?",
        "body": (
            "VENICE — The 61st Venice Biennale will be themed \"The Unfinished Earth,\" curator Aïda Diawara announced on Friday, unveiling an ambitious program that places climate, migration, labor, and digital identity at the conceptual core of contemporary art's most influential global gathering.\n\n"
            "Eighty-three participating nations will respond to a single guiding question, Diawara said: \"What does it mean to inherit a world that is still being made?\" The exhibition will sprawl across the Giardini, the Arsenale, and — for the first time in the Biennale's 130-year history — a constellation of seven satellite venues distributed throughout the Veneto region, including an abandoned cement factory in Mestre that will house a major commission by the artist El Anatsui.\n\n"
            "Diawara, the first curator of West African heritage to lead the Biennale, said her vision was shaped by what she described as \"the porousness of the present.\" The 2026 edition will deliberately resist the spectacle-driven model of recent years, she added, emphasizing instead durational works, archival research, and collaborations with indigenous communities and climate scientists."
        ),
        "category": "culture",
        "tags": [],
        "image_url": "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=1200&q=80",
        "image_caption": "Inside the Arsenale, where much of the Biennale's central exhibition will be installed.",
        "author_name": "Isabel Romero",
        "author_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
        "author_title": "Arts & Culture Editor",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 4,
        "views": 9421,
        "published_at": hours_ago(18),
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "premier-league-title-race-final-weekend",
        "title": "Premier League Title Race Goes to the Final Weekend in 30-Year High",
        "subtitle": "With three clubs separated by a single point, Sunday's fixtures will decide the most fiercely contested season in a generation.",
        "summary": "Manchester City, Arsenal, and Liverpool will all play simultaneously at 16:00 GMT in a finale evoking the iconic 1989 climax.",
        "body": (
            "LONDON — For the first time since 1996, three clubs will enter the final weekend of the Premier League season separated by a single point, setting up a finale that bookmakers, broadcasters, and rival managers are already comparing to the league's most legendary climaxes.\n\n"
            "Manchester City sit atop the table on 86 points, level with Arsenal on goal difference, with Liverpool one point behind. All three sides will play simultaneously at 16:00 GMT on Sunday — a kickoff time deliberately coordinated by league authorities to preserve sporting integrity and one that television executives have privately described as commercially unprecedented."
        ),
        "category": "sports",
        "tags": ["live"],
        "image_url": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80",
        "image_caption": "Etihad Stadium ahead of the title-deciding weekend fixtures.",
        "author_name": "James O'Sullivan",
        "author_avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80",
        "author_title": "Senior Sports Writer",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 5,
        "views": 14056,
        "published_at": hours_ago(20),
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "ukraine-rebuild-marshall-plan-eu-funding",
        "title": "EU Approves \u20ac230 Billion Ukraine Reconstruction Plan, Largest in Postwar History",
        "subtitle": "The decade-long initiative will prioritize energy grid resilience, housing, and rule-of-law reforms tied to EU membership progress.",
        "summary": "\"This is our Marshall Plan moment,\" Commission President Lara Costa told reporters in Brussels, defending the unprecedented scale of the commitment.",
        "body": (
            "BRUSSELS — European Union leaders approved a €230 billion reconstruction plan for Ukraine on Friday — a decade-long, conditions-based initiative that European Commission President Lara Costa described as the largest civilian rebuilding effort the continent has undertaken since the postwar period.\n\n"
            "The package, agreed after seventeen hours of negotiations at a summit in Brussels, will be disbursed in tranches tied to specific governance benchmarks: judicial independence, anti-corruption enforcement, and the implementation of accession criteria that Ukraine has been formally pursuing since 2022. Roughly forty percent of the total is earmarked for energy infrastructure — particularly grid resilience and decentralized renewable capacity — reflecting lessons from years of targeted attacks on Ukraine's power system."
        ),
        "category": "world",
        "tags": ["analysis"],
        "image_url": "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200&q=80",
        "image_caption": "EU leaders at the Brussels summit where the reconstruction plan was approved.",
        "author_name": "Sofia Petrov",
        "author_avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
        "author_title": "Europe Correspondent",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 6,
        "views": 11209,
        "published_at": hours_ago(22),
    },

    # ============= OPINION PIECES =============
    {
        "id": str(uuid.uuid4()),
        "slug": "opinion-democracy-cannot-survive-attention-economy",
        "title": "Democracy Cannot Survive the Attention Economy",
        "subtitle": "",
        "summary": "We built platforms to maximize engagement and called the result a public square. It is time to be honest about what we made.",
        "body": (
            "The defining political crisis of our era is not the rise of any single demagogue, nor the failure of any single institution. It is the slow, structural incompatibility between democracy — which requires sustained attention, shared facts, and patient deliberation — and the digital architectures we now use to mediate nearly every public conversation.\n\n"
            "We built platforms to maximize engagement, optimized them to exploit outrage and novelty, and then called the result a public square. It is not. It is a casino, and the house, as ever, wins.\n\n"
            "Reform will require us to do something we are profoundly bad at: distinguish between the technology we love and the social order we need."
        ),
        "category": "politics",
        "tags": ["opinion"],
        "image_url": "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80",
        "image_caption": "",
        "author_name": "Nadia Whitfield",
        "author_avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        "author_title": "Contributing Columnist",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": True,
        "opinion_quote": "We built platforms to maximize engagement and called the result a public square. It is time to be honest about what we made.",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 7,
        "views": 8742,
        "published_at": hours_ago(28),
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "opinion-rebuilding-trust-institutions-decline",
        "title": "The Quiet Collapse of Institutional Trust",
        "subtitle": "",
        "summary": "You cannot run a complex society on suspicion. Yet that is precisely what we are now asking of ourselves.",
        "body": (
            "For two generations, the West borrowed against the credibility of institutions it inherited but did not particularly cherish. The interest has now come due.\n\n"
            "You cannot run a complex society on suspicion. Yet that is precisely what we are now asking of ourselves — every transaction questioned, every authority second-guessed, every expert dismissed as a partisan or a fool. The result is not freedom. It is exhaustion.\n\n"
            "The rebuilding will have to be slow, deliberate, and painfully unglamorous. There is no shortcut, and there is no influencer who can sell it back to us."
        ),
        "category": "world",
        "tags": ["opinion"],
        "image_url": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80",
        "image_caption": "",
        "author_name": "Thomas Beaumont",
        "author_avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        "author_title": "Senior Editor at Large",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": True,
        "opinion_quote": "You cannot run a complex society on suspicion. Yet that is precisely what we are now asking of ourselves.",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 6,
        "views": 7311,
        "published_at": hours_ago(34),
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "opinion-economic-policy-needs-imagination",
        "title": "Economic Policy Needs Imagination, Not More Spreadsheets",
        "subtitle": "",
        "summary": "The age of treating macroeconomics as an engineering problem with one right answer is over. We need new instruments — and the humility to use them.",
        "body": (
            "The era in which economic policy could be safely outsourced to a small priesthood of technocrats is, for better and for worse, ending. The instruments they perfected — interest rates, inflation targeting, structural reform packages — were beautifully calibrated for a world that no longer exists.\n\n"
            "The age of treating macroeconomics as an engineering problem with one right answer is over. We need new instruments — and, more importantly, the humility to admit that the old ones may have always been less precise than we pretended."
        ),
        "category": "business",
        "tags": ["opinion"],
        "image_url": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
        "image_caption": "",
        "author_name": "Dr. Hannah Okafor",
        "author_avatar": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
        "author_title": "Economist, Contributing Writer",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": True,
        "opinion_quote": "The age of treating macroeconomics as an engineering problem with one right answer is over.",
        "is_video": False,
        "video_duration": "",
        "read_minutes": 5,
        "views": 6128,
        "published_at": hours_ago(40),
    },

    # ============= VIDEO STORIES =============
    {
        "id": str(uuid.uuid4()),
        "slug": "video-inside-greenland-melting-glaciers",
        "title": "Inside Greenland's Vanishing Glaciers: A 12-Minute Special Report",
        "subtitle": "",
        "summary": "Our team spent three weeks embedded with climate scientists at the edge of the Helheim Glacier.",
        "body": (
            "A special video report from The Chronicle's climate desk, filmed over three weeks at the edge of one of the fastest-retreating glaciers on Earth. Featuring on-the-ground interviews with researchers, indigenous Inuit elders, and rare aerial footage of newly exposed terrain."
        ),
        "category": "science",
        "tags": ["exclusive"],
        "image_url": "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1200&q=80",
        "image_caption": "The Helheim Glacier, photographed for The Chronicle in late spring.",
        "author_name": "Climate Desk",
        "author_avatar": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
        "author_title": "Video Documentary",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": True,
        "video_duration": "12:24",
        "read_minutes": 12,
        "views": 192034,
        "published_at": hours_ago(36),
    },
    {
        "id": str(uuid.uuid4()),
        "slug": "video-the-new-silk-road-explained",
        "title": "The New Silk Road, Explained in Eight Minutes",
        "subtitle": "",
        "summary": "A visual breakdown of the trade corridors, ports, and political tensions reshaping global commerce in 2026.",
        "body": (
            "From the Port of Piraeus to the highlands of Central Asia, our explainer maps the routes, the investments, and the geopolitical stakes of a project that is quietly redrawing the global economic map."
        ),
        "category": "world",
        "tags": ["analysis"],
        "image_url": "https://images.unsplash.com/photo-1494412574745-8c7705c1c0f1?w=1200&q=80",
        "image_caption": "Container ships at the Port of Piraeus, Greece.",
        "author_name": "Geopolitics Desk",
        "author_avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
        "author_title": "Video Explainer",
        "is_featured": False,
        "hero_rank": None,
        "is_trending": False,
        "trending_rank": None,
        "is_opinion": False,
        "opinion_quote": "",
        "is_video": True,
        "video_duration": "08:11",
        "read_minutes": 8,
        "views": 87412,
        "published_at": hours_ago(46),
    },
]


BREAKING_TICKER_ITEMS = [
    "BREAKING: Nations sign Paris II climate accord pledging net-zero by 2040.",
    "LIVE: Federal Reserve cuts rates by half point as inflation cools.",
    "DEVELOPING: European Parliament passes landmark AI Act with overwhelming majority.",
    "EXCLUSIVE: Nvidia unveils quantum-hybrid Atlas-1 chip, shares surge 8 percent.",
    "ANALYSIS: EU approves \u20ac230 billion Ukraine reconstruction package.",
    "WORLD: Japan elects Yui Tanaka as first female Prime Minister.",
    "SCIENCE: James Webb Telescope detects water vapor on Earth-like exoplanet LHS 1140b.",
]
