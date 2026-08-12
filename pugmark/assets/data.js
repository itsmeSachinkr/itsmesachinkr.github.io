/* ================= PUGMARK DATA ================= */
/* Shared across every Pugmark page. Load this before app.js / site.js. */

const PROFILES = {
  standard:  ['veryhigh','veryhigh','high','high','high','moderate','closed','closed','closed','moderate','high','veryhigh'],
  chandoli:  ['veryhigh','high','moderate','moderate','low','closed','closed','closed','closed','closed','high','veryhigh'],
  sgnp:      ['high','high','moderate','moderate','high','moderate','moderate','moderate','moderate','high','high','veryhigh'],
  satpura:   ['high','high','moderate','moderate','moderate','low','closed','closed','closed','moderate','high','veryhigh'],
  kuno:      ['high','moderate','moderate','low','low','low','closed','closed','closed','moderate','moderate','high'],
};
const STATUS_META = {
  closed:{label:'Core zone closed — monsoon', dot:'#B6503E'},
  veryhigh:{label:'Very high demand', dot:'#8E6A22'},
  high:{label:'High demand', dot:'#B8862B'},
  moderate:{label:'Moderate demand', dot:'#7C9A75'},
  low:{label:'Low demand — good availability', dot:'#3F6B4C'},
};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const REGIONS = ['All','North','West','Central','South','East','Northeast','Islands'];

// ---- Getting There: origin-city guidance to each flagship park's transport hub ----
const ORIGIN_CITIES = ['Mumbai','Pune','Bangalore','Delhi'];
const HUB_ROUTES = {
  Nagpur: {
    Mumbai: 'Frequent direct flights (~1.5 hrs). An overnight train also runs the route (~14-16 hrs).',
    Pune: 'Direct flights run several times a week (~1.5 hrs); on other days, connect via Mumbai. Direct overnight trains also run (~14-15 hrs).',
    Bangalore: 'Direct flights available (~2 hrs). By train it\'s a long haul (~20-24 hrs), typically via Hyderabad or Wardha.',
    Delhi: 'Frequent direct flights (~2 hrs). Direct trains also connect overnight-plus (~16-18 hrs).',
  },
  Mumbai: {
    Mumbai: 'You\'re already there — reachable by local train to Borivali (~1 hr from South Mumbai) then a short auto/taxi ride.',
    Pune: 'About 150 km by road or a ~3-4 hr train/expressway drive.',
    Bangalore: 'Frequent direct flights into Mumbai (~1.5-2 hrs), then a local train or taxi to Borivali.',
    Delhi: 'Frequent direct flights into Mumbai (~2 hrs), then a local train or taxi to Borivali.',
  },
  Kolhapur: {
    Mumbai: 'A handful of direct flights run each week (~1 hr); overnight trains are the more reliable option (~10-12 hrs).',
    Pune: 'Closest of the four — about 230 km by road (~4-5 hrs) or a daytime train.',
    Bangalore: 'No reliable direct flights; connect via Mumbai or Pune, or take a long direct train (~14-16 hrs).',
    Delhi: 'No direct flights; connect via Mumbai or Pune. By train it\'s a long overnight-plus journey (~24+ hrs).',
  },
  Jabalpur: {
    Mumbai: 'Limited direct flights (a few per week, ~1.5 hrs); overnight trains run more frequently (~14-16 hrs).',
    Pune: 'No reliable direct flights; connect via Mumbai or Delhi. Trains typically involve a change (~18-20 hrs total).',
    Bangalore: 'Limited direct flights, more commonly a one-stop connection. By train, expect a long journey (~24+ hrs).',
    Delhi: 'Multiple direct flights daily (~1.5 hrs). Direct overnight trains also run (~14-16 hrs).',
  },
  Khajuraho: {
    Mumbai: 'Flights are seasonal and limited — check current schedules, or fly to Jabalpur (~245 km) and continue by road.',
    Pune: 'No direct flights; connect via Delhi or Mumbai, or route via Jabalpur.',
    Bangalore: 'No direct flights; connect via Delhi. Rail typically requires a change at Jhansi or Satna.',
    Delhi: 'Direct flights run seasonally as part of the tourist circuit (~1.5 hrs); a direct train also connects the two (~10-12 hrs).',
  },
  Bhopal: {
    Mumbai: 'Frequent direct flights (~1.5 hrs); direct overnight trains also run (~14-15 hrs).',
    Pune: 'A few direct flights run weekly; otherwise connect via Mumbai. Trains typically involve one change.',
    Bangalore: 'Direct flights available (~2 hrs). By train it\'s a long journey (~20+ hrs), usually via Nagpur.',
    Delhi: 'Frequent direct flights (~1.5 hrs) and direct overnight trains (~10-12 hrs) — Bhopal sits on the main Delhi-Mumbai line.',
  },
  Gwalior: {
    Mumbai: 'Limited direct flights; more commonly a one-stop connection via Delhi. Direct trains run overnight (~14-16 hrs).',
    Pune: 'No direct flights; connect via Mumbai or Delhi. Trains usually involve a change.',
    Bangalore: 'No direct flights; connect via Delhi. By train, expect a long journey (~24+ hrs).',
    Delhi: 'Multiple direct flights and fast trains daily (~1 hr flight, ~4-5 hrs by train) — Gwalior is close to Delhi on the main line.',
  },
};

// ---- All major Indian cities, for the "I'm travelling from" search field ----
// Curated flight/train guidance above only exists for ORIGIN_CITIES; any other
// city selected here falls back to the honest generic advice built from each
// park's own access.airport / access.railway fields.
const ALL_CITIES = [
  'Agra','Agartala','Ahmedabad','Aizawl','Ajmer','Allahabad (Prayagraj)','Amaravati','Amritsar',
  'Asansol','Aurangabad','Bangalore','Bareilly','Bhopal','Bhubaneswar','Bikaner','Chandigarh',
  'Chennai','Coimbatore','Cuttack','Dehradun','Delhi','Dhanbad','Dibrugarh','Dimapur',
  'Faridabad','Gandhinagar','Gangtok','Gaya','Ghaziabad','Goa (Panaji)','Gorakhpur','Guwahati',
  'Gwalior','Hubballi','Hyderabad','Imphal','Indore','Itanagar','Jabalpur','Jaipur',
  'Jalandhar','Jammu','Jamshedpur','Jodhpur','Jorhat','Kanpur','Kochi','Kohima',
  'Kolhapur','Kolkata','Kota','Kozhikode','Lucknow','Ludhiana','Madurai','Mangalore',
  'Meerut','Mumbai','Muzaffarpur','Mysore','Nagpur','Nashik','Panipat','Patna',
  'Port Blair','Puducherry','Pune','Raipur','Rajkot','Ranchi','Rourkela','Shillong',
  'Shimla','Siliguri','Silvassa','Srinagar','Surat','Thiruvananthapuram','Tiruchirappalli','Udaipur',
  'Vadodara','Varanasi','Vijayawada','Visakhapatnam','Warangal',
].sort();

// Search terms (from a Wikimedia/Wikipedia photo-link workbook's "Search
// Keyword" column) used by assets/app.js to ask the Wikipedia search API for
// a real, currently-existing photo of the wildlife a park is famous for, at
// page-load time in the visitor's own browser -- see photoKeyword() in
// site.js, which tries the park itself first and falls back to this.
const SPECIES_KEYWORDS = {
  tiger: 'Bengal tiger', lion: 'Asiatic lion Gir', leopard: 'Indian leopard', snowleopard: 'Snow leopard',
  rhino: 'Indian rhinoceros Kaziranga', elephant: 'Indian elephant', deer: 'Chital spotted deer',
  bird: 'Indian peafowl peacock', primate: 'Lion-tailed macaque', crocodile: 'Mugger crocodile',
};

// ---- Detailed parks (Maharashtra & Madhya Pradesh): full zone + almanac + availability data ----
const DETAILED_PARKS = [
  { id:'tadoba', name:'Tadoba-Andhari Tiger Reserve', state:'Maharashtra', region:'West', district:'Chandrapur',
    established:'1955 (1993 as Tiger Reserve)', area:'1,727 sq km (625 core / 1,101 buffer)', nearest:'Nagpur (~140 km)', hubCity:'Nagpur', access:{airport:'Nagpur (~140 km)', railway:'Chandrapur (~45 km)'},
    famousFor:'Highest tiger density in Maharashtra', note:'Maharashtra\'s oldest and largest reserve.',
    zones:[['Moharli','core'],['Khutwanda','core'],['Kolara','core'],['Navegaon','core'],['Zari','core'],['Pangdi','core'],
      ['Agarzari','buffer'],['Devada-Adegaon','buffer'],['Junona','buffer'],['Mamla','buffer'],['Palasgaon','buffer'],['Keslaghat','buffer'],['Ramdegi-Navegaon','buffer']],
    profile:'standard', portal:'https://safaribooking.mahaforest.gov.in/' },
  { id:'pench-mh', name:'Pench National Park (Maharashtra)', state:'Maharashtra', region:'West', district:'Nagpur',
    established:'1975 (1992 Tiger Reserve)', area:'257 sq km (MH portion)', nearest:'Nagpur (~80 km)', hubCity:'Nagpur', access:{airport:'Nagpur (~80 km)', railway:'Nagpur (~80 km)'},
    famousFor:'The forest behind The Jungle Book', note:'Maharashtra half of the reserve straddling the MP border.',
    zones:[['Sillari','core'],['Khursapar','core'],['Paoni','buffer'],['Kolitmara','buffer'],['Chorbahuli','buffer']],
    profile:'standard', portal:'https://safaribooking.mahaforest.gov.in/' },
  { id:'melghat', name:'Melghat Tiger Reserve (Gugamal NP)', state:'Maharashtra', region:'West', district:'Amravati',
    established:'1974 (Project Tiger)', area:'~1,500 sq km', nearest:'Amravati / Semadoh', hubCity:'Nagpur', access:{airport:'Nagpur (~230 km) or Akola (small airport, limited flights, ~100 km)', railway:'Amravati (~80 km from Semadoh)', note:'Akola\'s airstrip has limited service — Nagpur is the more reliable option.'},
    famousFor:'One of India\'s original nine tiger reserves', note:'Rugged Satpura hill terrain.',
    zones:[['Kolkas','core'],['Semadoh','buffer'],['Harisal','buffer'],['Chikhaldara (Vairat)','buffer'],['Shahnur (Narnala)','buffer']],
    profile:'standard', portal:'https://safaribooking.mahaforest.gov.in/' },
  { id:'sgnp', name:'Sanjay Gandhi National Park', state:'Maharashtra', region:'West', district:'Mumbai (Borivali)',
    established:'1996 (as SGNP)', area:'~104 sq km', nearest:'Within Mumbai city', hubCity:'Mumbai', access:{airport:'Chhatrapati Shivaji Maharaj Intl, Mumbai (~25 km)', railway:'Borivali (~2 km, on Mumbai\'s Western suburban line)'},
    famousFor:'Leopards living inside a metropolis', note:'A forest inside a city of 20 million people.',
    zones:[['Lion & Tiger Safari enclosure','core'],['Kanheri Caves trail','core'],['Nature trail circuit','core']],
    zoneNote:'SGNP is not an NTCA tiger reserve, so it doesn\'t carry an official core/buffer split.',
    profile:'sgnp', portal:'https://sgnp.maharashtra.gov.in/' },
  { id:'chandoli', name:'Chandoli National Park', state:'Maharashtra', region:'West', district:'Sangli / Kolhapur',
    established:'2004 (1985 as sanctuary)', area:'317 sq km', nearest:'Sangli / Kolhapur', hubCity:'Kolhapur', access:{airport:'Kolhapur (small airport, limited flights, ~90 km)', railway:'Sangli (~60 km)'},
    famousFor:'Western Ghats UNESCO rainforest', note:'Part of the Sahyadri Tiger Reserve landscape.',
    zones:[['Chandoli core (Sahyadri Tiger Reserve)','core'],['Prachitgad approach','buffer']],
    zoneNote:'Jeep-safari tourism is far less developed here than in the Vidarbha reserves.',
    profile:'chandoli', portal:'https://safaribooking.mahaforest.gov.in/' },
  { id:'navegaon', name:'Navegaon-Nagzira Tiger Reserve', state:'Maharashtra', region:'West', district:'Gondia / Bhandara',
    established:'1975 / 2013 (merged reserve)', area:'653 sq km', nearest:'Gondia', hubCity:'Nagpur', access:{airport:'Nagpur (~120 km) or Gondia (small airport, limited flights, ~40 km)', railway:'Gondia (~40 km, a well-connected junction)'},
    famousFor:'Wetlands, lakes, and strong birdlife', note:'Dry deciduous forest woven with lakes.',
    zones:[['Nagzira','core'],['New Nagzira (Koka)','core'],['Navegaon Bandh','buffer'],['Pitambartola','buffer'],['Umarzari','buffer'],['Chorkhamara','buffer']],
    profile:'standard', portal:'https://safaribooking.mahaforest.gov.in/' },
  { id:'kanha', name:'Kanha National Park', state:'Madhya Pradesh', region:'Central', district:'Mandla & Balaghat',
    established:'1955 (1973 Tiger Reserve)', area:'940 sq km core', nearest:'Jabalpur (~160 km)', hubCity:'Jabalpur', access:{airport:'Jabalpur (~160 km)', railway:'Nainpur (~65 km, limited connections) or Jabalpur (~160 km) for wider options'},
    famousFor:'Hardground barasingha (swamp deer)', note:'MP\'s largest park — sal forests and meadows.',
    zones:[['Kanha','core'],['Kisli','core'],['Mukki','core'],['Sarhi','core'],['Khatia','buffer'],['Sijhora','buffer'],['Phen','buffer'],['Khapa','buffer']],
    profile:'standard', portal:'https://forest.mponline.gov.in/' },
  { id:'bandhavgarh', name:'Bandhavgarh National Park', state:'Madhya Pradesh', region:'Central', district:'Umaria',
    established:'1968 (1993 Tiger Reserve)', area:'1,536 sq km (716 core / 820 buffer)', nearest:'Jabalpur (~190 km) / Khajuraho', hubCity:'Jabalpur', access:{airport:'Jabalpur (~190 km) or Khajuraho (~245 km)', railway:'Umaria (~35 km) or Katni (~100 km, major junction)'},
    famousFor:'India\'s highest known tiger density', note:'A 2,000-year-old hill fort sits inside the park.',
    zones:[['Tala','core'],['Magadhi','core'],['Khitauli','core'],['Dhamokhar','buffer'],['Johila (Kalwa)','buffer'],['Panpatha (Pachpedi)','buffer']],
    profile:'standard', portal:'https://forest.mponline.gov.in/' },
  { id:'pench-mp', name:'Pench National Park (Madhya Pradesh)', state:'Madhya Pradesh', region:'Central', district:'Seoni & Chhindwara',
    established:'1983 (1992 Tiger Reserve)', area:'758 sq km reserve', nearest:'Nagpur (~90 km) / Seoni', hubCity:'Nagpur', access:{airport:'Nagpur (~90 km)', railway:'Nagpur (~90 km)'},
    famousFor:'The forest that inspired The Jungle Book', note:'Named for the Pench River splitting the reserve.',
    zones:[['Turia','core'],['Karmajhiri','core'],['Jamtara','core'],['Khawasa (Wolf Sanctuary)','buffer'],['Teliya','buffer'],['Rukhad','buffer']],
    profile:'standard', portal:'https://forest.mponline.gov.in/' },
  { id:'panna', name:'Panna National Park', state:'Madhya Pradesh', region:'Central', district:'Panna',
    established:'1981 (1994 Tiger Reserve)', area:'543 sq km', nearest:'Khajuraho (~25 km)', hubCity:'Khajuraho', access:{airport:'Khajuraho (~25 km)', railway:'Khajuraho (~25 km) or Satna (~120 km, major junction)'},
    famousFor:'Tiger comeback after local extinction', note:'Ken River gorges through the Vindhya hills.',
    zones:[['Madla','core'],['Hinouta','core'],['Akola','core'],['Jhinna','buffer'],['Khajurikudar','buffer']],
    profile:'standard', portal:'https://forest.mponline.gov.in/' },
  { id:'satpura', name:'Satpura National Park', state:'Madhya Pradesh', region:'Central', district:'Narmadapuram (Hoshangabad)',
    established:'1981', area:'524 sq km core', nearest:'Pachmarhi (~55 km) / Bhopal (~180 km)', hubCity:'Bhopal', access:{airport:'Bhopal (~180 km)', railway:'Pipariya (~55 km, on the Mumbai-Howrah main line)'},
    famousFor:'Walking & boat safaris — rare in India', note:'Only major reserve offering safaris on foot and by boat.',
    zones:[['Madhai','core'],['Churna','core'],['Bori (Panchmarhi)','core'],['Parsapani (Pathai)','buffer'],['Jamani Devi (Sehra)','buffer']],
    profile:'satpura', portal:'https://forest.mponline.gov.in/' },
  { id:'kuno', name:'Kuno National Park', state:'Madhya Pradesh', region:'Central', district:'Sheopur',
    established:'2018 (1981 as sanctuary)', area:'748 sq km core', nearest:'Sheopur / Gwalior (~170 km)', hubCity:'Gwalior', access:{airport:'Gwalior (~170 km)', railway:'Sheopur (small, limited services) or Gwalior (~170 km, major junction)'},
    famousFor:'India\'s cheetah reintroduction site', note:'Open grassland and ravine country.',
    zones:[['Ahera','core'],['Peepalbawadi','core'],['Tiktoli','core']],
    zoneNote:'Kuno is still scaling up tourism — a dedicated buffer-zone circuit hasn\'t been formalised yet.',
    profile:'kuno', portal:'https://forest.mponline.gov.in/' },
];

// ---- Overview parks: all other states & UTs, lighter detail ----
const OVERVIEW_PARKS = [
  // WEST — Rajasthan
  {id:'ranthambore', name:'Ranthambore National Park', state:'Rajasthan', region:'West', established:'1980', nearest:'Sawai Madhopur', access:{airport:'Jaipur (~180 km)', railway:'Sawai Madhopur (adjacent to the park)'},
   famousFor:'Tigers among ancient fort ruins', note:'A former royal hunting ground turned tiger reserve, with a 10th-century fort rising above the forest.', season:'Open Oct–Jun; peak Dec–Mar; closed for core safaris Jul–Sep (monsoon).'},
  {id:'sariska', name:'Sariska Tiger Reserve', state:'Rajasthan', region:'West', established:'1955 (1979 Tiger Reserve)', nearest:'Alwar', access:{airport:'Jaipur (~110 km)', railway:'Alwar (~35 km)'},
   famousFor:'India\'s first tiger reintroduction site', note:'Dry deciduous hills dotted with ruined temples and a medieval fort.', season:'Open Oct–Jun; closed Jul–Sep.'},
  {id:'keoladeo', name:'Keoladeo National Park (Bharatpur)', state:'Rajasthan', region:'West', established:'1982', nearest:'Bharatpur', access:{airport:'Agra (~55 km) or Jaipur (~180 km)', railway:'Bharatpur Junction (~5 km)'},
   famousFor:'Migratory birds — a UNESCO wetland', note:'A man-made wetland that became one of the world\'s great bird sanctuaries.', season:'Best Oct–Feb for migratory birds; open most of the year.'},
  {id:'desert-np', name:'Desert National Park', state:'Rajasthan', region:'West', established:'1980', nearest:'Jaisalmer', access:{airport:'Jaisalmer (small airport, seasonal flights, ~40 km)', railway:'Jaisalmer (~40 km)'},
   famousFor:'Great Indian bustard', note:'Vast sand dunes and scrub — a last stronghold of the critically endangered bustard.', season:'Best Oct–Mar; extreme heat Apr–Jun.'},
  // WEST — Gujarat
  {id:'gir', name:'Gir National Park', state:'Gujarat', region:'West', established:'1965 (NP status 1975)', nearest:'Junagadh / Sasan Gir', access:{airport:'Rajkot (~160 km) or Diu (~95 km)', railway:'Junagadh (~65 km), with a branch line to Sasan Gir itself'},
   famousFor:'Asiatic lion — the only wild population on Earth', note:'Dry teak and thorn forest, the sole home of wild Asiatic lions.', season:'Open mid-Oct–mid-Jun; closed monsoon.'},
  {id:'velavadar', name:'Blackbuck National Park, Velavadar', state:'Gujarat', region:'West', established:'1976', nearest:'Bhavnagar', access:{airport:'Bhavnagar (small airport, ~55 km)', railway:'Bhavnagar (~65 km)'},
   famousFor:'Blackbuck & wolves on open grassland', note:'Flat grassland habitat, unusual for India — good for blackbuck and harrier roosts.', season:'Open year-round; best Nov–Mar.'},
  {id:'gulf-kutch', name:'Marine National Park, Gulf of Kutch', state:'Gujarat', region:'West', established:'1982', nearest:'Jamnagar', access:{airport:'Jamnagar (~30 km)', railway:'Jamnagar (~30 km)'},
   famousFor:'India\'s first marine national park — coral reefs', note:'Coral reefs, mangroves, and marine life along the Gujarat coast.', season:'Best Nov–Mar; boat access weather-dependent.'},
  // WEST — Goa
  {id:'mollem', name:'Bhagwan Mahavir (Mollem) National Park', state:'Goa', region:'West', established:'1978 (NP 1992)', nearest:'Ponda / Molem', access:{airport:'Goa, Dabolim/Manohar Intl (~55 km)', railway:'Castle Rock or Kulem on the Konkan Railway (~10-15 km)'},
   famousFor:'Western Ghats gaur & waterfalls', note:'Goa\'s only national park, part of the Western Ghats biodiversity hotspot.', season:'Open Oct–May; monsoon transforms the falls but limits access.'},

  // CENTRAL — Chhattisgarh
  {id:'kanger-valley', name:'Kanger Valley National Park', state:'Chhattisgarh', region:'Central', established:'1982', nearest:'Jagdalpur', access:{airport:'Jagdalpur (small airport, limited flights, ~25 km)', railway:'Jagdalpur (~25 km)'},
   famousFor:'Limestone caves & rare wild rice', note:'Dense forest hiding Kotumsar Cave and the Tirathgarh waterfall.', season:'Open Nov–Jun; closed monsoon.'},
  {id:'guru-ghasidas', name:'Guru Ghasidas (Sanjay) National Park', state:'Chhattisgarh', region:'Central', established:'1981', nearest:'Ambikapur', access:{airport:'Raipur (~250 km, most reliable option)', railway:'Ambikapur (~45 km) or Bilaspur (~150 km, major junction)', note:'Ambikapur has a small airstrip with limited service.'},
   famousFor:'Large contiguous tiger habitat', note:'One of central India\'s biggest forest blocks, central to tiger-recovery plans.', season:'Open Oct–Jun; tourism infrastructure still developing.'},
  {id:'indravati', name:'Indravati National Park', state:'Chhattisgarh', region:'Central', established:'1981', nearest:'Jagdalpur', access:{airport:'Raipur (~300 km)', railway:'Jagdalpur (~150 km)', note:'Access has long been restricted — check current status before planning.'},
   famousFor:'Wild buffalo & tiger', note:'A remote reserve on the Maharashtra border; visitor access has long been limited.', season:'Access restricted — check current status before planning a trip.'},

  // NORTH — Uttarakhand
  {id:'corbett', name:'Jim Corbett National Park', state:'Uttarakhand', region:'North', established:'1936', nearest:'Ramnagar', access:{airport:'Pantnagar (small airport, limited flights, ~50 km) or Delhi (~250 km)', railway:'Ramnagar (right by the park gate)'},
   famousFor:'India\'s first national park', note:'Founded to protect a dwindling tiger population; the birthplace of Project Tiger in 1973.', season:'Open mid-Nov–Jun; core zones close for monsoon.'},
  {id:'rajaji', name:'Rajaji National Park', state:'Uttarakhand', region:'North', established:'1983', nearest:'Haridwar / Dehradun', access:{airport:'Dehradun, Jolly Grant (~35 km)', railway:'Haridwar (~10 km) or Dehradun'},
   famousFor:'Elephant corridor along the Ganga', note:'Sal forest linking the Shivalik hills to the Ganga floodplain.', season:'Open mid-Nov–Jun; closed monsoon.'},
  {id:'valley-of-flowers', name:'Valley of Flowers National Park', state:'Uttarakhand', region:'North', established:'1982', nearest:'Govindghat', access:{airport:'Dehradun (~275 km)', railway:'Rishikesh (~275 km)', note:'The final stretch to Govindghat is a long mountain drive, then a trek — allow at least one extra day.'},
   famousFor:'Alpine wildflower meadows — UNESCO site', note:'A high-altitude valley that bursts into bloom for a few weeks each year.', season:'Open Jun–Oct only; snow-bound the rest of the year.'},
  {id:'nanda-devi', name:'Nanda Devi National Park', state:'Uttarakhand', region:'North', established:'1982', nearest:'Joshimath', access:{airport:'Dehradun (~300 km)', railway:'Rishikesh (~290 km)', note:'Core zone access is tightly restricted; check current permit rules before planning.'},
   famousFor:'Himalayan wilderness — UNESCO biosphere', note:'Core zone around Nanda Devi peak; entry is tightly restricted.', season:'Restricted access; permits required, short summer window.'},
  // NORTH — Uttar Pradesh
  {id:'dudhwa', name:'Dudhwa National Park', state:'Uttar Pradesh', region:'North', established:'1977', nearest:'Lakhimpur Kheri', access:{airport:'Lucknow (~230 km)', railway:'Dudhwa\'s own small station, or Mailani (~35 km) for wider rail connections'},
   famousFor:'Swamp deer (barasingha) & reintroduced rhino', note:'Terai grassland on the Nepal border, tigers and rhino together.', season:'Open Nov–Jun; closed monsoon.'},
  // NORTH — Himachal Pradesh
  {id:'great-himalayan', name:'Great Himalayan National Park', state:'Himachal Pradesh', region:'North', established:'1984', nearest:'Kullu', access:{airport:'Bhuntar/Kullu (~60 km)', railway:'Joginder Nagar, narrow-gauge (~140 km)', note:'Chandigarh (~250 km) is the nearest broad-gauge railhead.'},
   famousFor:'Snow leopard & western tragopan — UNESCO site', note:'High-altitude wilderness in the Kullu Himalayas.', season:'Best May–Oct; heavy snow closes access in winter.'},
  {id:'pin-valley', name:'Pin Valley National Park', state:'Himachal Pradesh', region:'North', established:'1987', nearest:'Kaza (Spiti)', access:{airport:'Bhuntar/Kullu (~150 km via Manali)', railway:'Shimla (~250 km)', note:'The approach over Kunzum Pass is snowbound much of the year — road access is strictly seasonal.'},
   famousFor:'Snow leopard & ibex — Spiti cold desert', note:'A trans-Himalayan cold desert in the Spiti valley.', season:'Best Jun–Sep; cut off by snow much of the year.'},
  // NORTH — J&K / Ladakh
  {id:'dachigam', name:'Dachigam National Park', state:'Jammu & Kashmir', region:'North', established:'1981', nearest:'Srinagar', access:{airport:'Srinagar (~20 km)', railway:'Jammu Tawi is the traditional railhead (~300 km); rail links toward the Kashmir valley have been expanding — check current status.'},
   famousFor:'Hangul — the last home of the Kashmir stag', note:'A former royal game reserve above Srinagar.', season:'Best Apr–Oct; snow limits access in winter.'},
  {id:'hemis', name:'Hemis National Park', state:'Ladakh', region:'North', established:'1981', nearest:'Leh', access:{airport:'Leh (~40 km)', railway:'None — Ladakh has no rail link.', note:'Reached by road via the Srinagar-Leh or Manali-Leh highways, both closed by snow for much of the year.'},
   famousFor:'Snow leopard — highest known density anywhere', note:'India\'s largest national park, high-altitude Trans-Himalayan terrain.', season:'Snow-leopard tracking best Dec–Mar; general access May–Sep.'},
  // NORTH — Haryana
  {id:'kalesar', name:'Kalesar National Park', state:'Haryana', region:'North', established:'2003', nearest:'Yamunanagar', access:{airport:'Chandigarh (~90 km) or Delhi (~180 km)', railway:'Yamunanagar-Jagadhri (~15 km)'},
   famousFor:'Elephant corridor & sal forest', note:'A quiet Shivalik-foothill forest, part of an elephant movement corridor.', season:'Open year-round; best Oct–Mar.'},

  // SOUTH — Karnataka
  {id:'bandipur', name:'Bandipur National Park', state:'Karnataka', region:'South', established:'1974', nearest:'Mysuru', access:{airport:'Mysuru (~80 km) or Bengaluru (~220 km)', railway:'Mysuru Junction (~80 km)'},
   famousFor:'Tiger & elephant, Nilgiri Biosphere', note:'Part of one of the largest contiguous tiger landscapes in Asia.', season:'Open year-round; best Oct–May.'},
  {id:'nagarhole', name:'Nagarhole (Rajiv Gandhi) National Park', state:'Karnataka', region:'South', established:'1988', nearest:'Kabini / Mysuru', access:{airport:'Mysuru (~90 km) or Bengaluru (~230 km)', railway:'Mysuru Junction (~90 km)'},
   famousFor:'Tiger & elephant along the Kabini backwaters', note:'Boat and jeep safaris along the Kabini reservoir.', season:'Open year-round; best Oct–May.'},
  {id:'bannerghatta', name:'Bannerghatta National Park', state:'Karnataka', region:'South', established:'1974', nearest:'Bengaluru', access:{airport:'Bengaluru (~35 km)', railway:'Bengaluru City (~22 km)'},
   famousFor:'Safari zoo & rescue centre near Bengaluru', note:'A city-edge park combining safari drives with a rescue and rehabilitation centre.', season:'Open year-round.'},
  // SOUTH — Kerala
  {id:'periyar', name:'Periyar National Park', state:'Kerala', region:'South', established:'1982', nearest:'Thekkady', access:{airport:'Madurai (~140 km) or Kochi (~190 km)', railway:'Kottayam (~100 km) or Madurai (~140 km)'},
   famousFor:'Boat safaris on Periyar Lake', note:'Built around a colonial-era irrigation lake, now one of India\'s best-known tiger reserves.', season:'Open year-round; best Oct–Mar.'},
  {id:'eravikulam', name:'Eravikulam National Park', state:'Kerala', region:'South', established:'1978', nearest:'Munnar', access:{airport:'Kochi (~130 km)', railway:'Aluva (~120 km)'},
   famousFor:'Nilgiri tahr', note:'Rolling shola-grassland hills above the tea estates of Munnar.', season:'Open year-round except a spring closure for the tahr breeding season; best Sep–May.'},
  {id:'silent-valley', name:'Silent Valley National Park', state:'Kerala', region:'South', established:'1984', nearest:'Mannarkkad', access:{airport:'Coimbatore (~55 km via Mannarkkad)', railway:'Palakkad (~50 km)'},
   famousFor:'Untouched rainforest & lion-tailed macaque', note:'One of the last undisturbed tracts of tropical evergreen forest in the Western Ghats.', season:'Open with permits; best Dec–Apr.'},
  // SOUTH — Tamil Nadu
  {id:'mudumalai', name:'Mudumalai National Park', state:'Tamil Nadu', region:'South', established:'1940 (sanctuary), 1990 (NP)', nearest:'Ooty / Gudalur', access:{airport:'Coimbatore (~150 km) or Bengaluru (~250 km)', railway:'Ooty, scenic narrow-gauge via Mettupalayam, or Coimbatore'},
   famousFor:'Tiger & elephant corridor to Bandipur & Nagarhole', note:'Anchors the Nilgiri Biosphere Reserve\'s southern edge.', season:'Open year-round; best Oct–May.'},
  {id:'mukurthi', name:'Mukurthi National Park', state:'Tamil Nadu', region:'South', established:'1990', nearest:'Ooty', access:{airport:'Coimbatore (~130 km)', railway:'Ooty / Mettupalayam'},
   famousFor:'Nilgiri tahr & shola grasslands', note:'High-altitude shola-grassland habitat in the Nilgiris.', season:'Best Sep–Mar; monsoon-heavy Jun–Aug.'},
  {id:'anamalai', name:'Indira Gandhi (Anamalai) National Park', state:'Tamil Nadu', region:'South', established:'1989', nearest:'Pollachi', access:{airport:'Coimbatore (~65 km)', railway:'Pollachi (~35 km) or Coimbatore'},
   famousFor:'Great hornbill & Western Ghats tiger habitat', note:'Rainforest and shola habitat in the Anamalai hills.', season:'Open year-round; best Nov–Apr.'},
  // SOUTH — Andhra Pradesh
  {id:'papikonda', name:'Papikonda National Park', state:'Andhra Pradesh', region:'South', established:'2008', nearest:'Rajahmundry', access:{airport:'Rajahmundry (~65 km)', railway:'Rajahmundry (~65 km)'},
   famousFor:'Godavari river gorge', note:'Forested hills either side of a dramatic Godavari river gorge, often seen by boat.', season:'Best Oct–Feb.'},
  {id:'sri-venkateswara', name:'Sri Venkateswara National Park', state:'Andhra Pradesh', region:'South', established:'1989', nearest:'Tirupati', access:{airport:'Tirupati (~25 km)', railway:'Tirupati (~25 km, a major pilgrimage-route hub)'},
   famousFor:'Slender loris', note:'Eastern Ghats forest around the Tirumala hills.', season:'Open year-round; best Oct–Mar.'},
  // SOUTH — Telangana
  {id:'kawal', name:'Kawal Tiger Reserve', state:'Telangana', region:'South', established:'1965 (2012 Tiger Reserve)', nearest:'Nirmal', access:{airport:'Hyderabad (~250 km)', railway:'Nirmal (~40 km) or Mancherial (~50 km)'},
   famousFor:'Deccan tiger habitat', note:'Dry deciduous Deccan forest, part of Telangana\'s tiger-recovery efforts.', season:'Open Nov–Jun; tourism infrastructure still developing.'},

  // EAST — West Bengal
  {id:'sundarbans', name:'Sundarbans National Park', state:'West Bengal', region:'East', established:'1984', nearest:'Canning / Gosaba', access:{airport:'Kolkata (~110 km)', railway:'Canning (~50 km, on a well-connected suburban line from Kolkata)'},
   famousFor:'Bengal tiger of the mangroves', note:'The only mangrove forest on Earth with a resident tiger population, explored by boat.', season:'Best Oct–Mar; humid and rainy Jun–Sep.'},
  // EAST — Odisha
  {id:'bhitarkanika', name:'Bhitarkanika National Park', state:'Odisha', region:'East', established:'1998', nearest:'Rajnagar', access:{airport:'Bhubaneswar (~140 km)', railway:'Bhadrak (~70 km)'},
   famousFor:'Saltwater crocodile — India\'s largest', note:'Mangrove creeks near the Bay of Bengal, and a mass nesting beach for olive ridley turtles nearby.', season:'Best Dec–Feb.'},
  {id:'simlipal', name:'Simlipal National Park', state:'Odisha', region:'East', established:'1980', nearest:'Baripada', access:{airport:'Bhubaneswar (~250 km)', railway:'Baripada (~20 km) or Balasore (~60 km)'},
   famousFor:'Melanistic (black) tigers', note:'A rare genetic variation gives some of Simlipal\'s tigers unusually dark, near-black stripes.', season:'Open Nov–Jun; closed monsoon.'},
  // EAST — Bihar
  {id:'valmiki', name:'Valmiki National Park', state:'Bihar', region:'East', established:'1989', nearest:'Bettiah', access:{airport:'Patna (~180 km)', railway:'Bagaha (~25 km)', note:'Tourism infrastructure is still developing here — allow extra travel time.'},
   famousFor:'Tiger reserve on the Nepal border', note:'Bihar\'s only tiger reserve, forming a cross-border landscape with Nepal\'s Chitwan.', season:'Open Nov–Jun; closed monsoon.'},
  // EAST — Jharkhand
  {id:'betla', name:'Betla National Park', state:'Jharkhand', region:'East', established:'1986', nearest:'Daltonganj', access:{airport:'Ranchi (~170 km)', railway:'Daltonganj (~25 km)'},
   famousFor:'Tiger & elephant on the Chotanagpur plateau', note:'One of the earliest Project Tiger reserves, in Jharkhand\'s forested plateau country.', season:'Open Oct–Jun; closed monsoon.'},

  // NORTHEAST — Assam
  {id:'kaziranga', name:'Kaziranga National Park', state:'Assam', region:'Northeast', established:'1974', nearest:'Jorhat / Golaghat', access:{airport:'Jorhat (~95 km)', railway:'Furkating (~75 km)'},
   famousFor:'Indian one-horned rhinoceros', note:'A UNESCO World Heritage site holding the majority of the world\'s greater one-horned rhinos.', season:'Open Nov–Apr; closed for monsoon flooding May–Oct.'},
  {id:'manas', name:'Manas National Park', state:'Assam', region:'Northeast', established:'1990', nearest:'Barpeta Road', access:{airport:'Guwahati (~176 km)', railway:'Barpeta Road (~22 km)'},
   famousFor:'Tiger, wild buffalo & pygmy hog', note:'A UNESCO site on the Bhutan border, recovered from years of conflict-driven poaching.', season:'Open Nov–Apr; closed monsoon.'},
  {id:'nameri', name:'Nameri National Park', state:'Assam', region:'Northeast', established:'1998', nearest:'Tezpur', access:{airport:'Tezpur, Salonibari (~35 km)', railway:'Rangapara North (~15 km)'},
   famousFor:'Elephant & river-valley birdlife', note:'Riverine forest on the Jia Bhoreli river, popular for birding and rafting.', season:'Open Nov–Apr.'},
  {id:'dibru-saikhowa', name:'Dibru-Saikhowa National Park', state:'Assam', region:'Northeast', established:'1999', nearest:'Tinsukia', access:{airport:'Dibrugarh (~40 km)', railway:'Tinsukia (~45 km)'},
   famousFor:'Feral horses & the white-winged wood duck', note:'A river-island wetland landscape at the confluence of the Brahmaputra and Lohit.', season:'Best Nov–Mar; flood-affected in monsoon.'},
  {id:'orang', name:'Orang National Park', state:'Assam', region:'Northeast', established:'1999', nearest:'Tezpur', access:{airport:'Tezpur (~40 km)', railway:'Rangapara (~35 km)'},
   famousFor:'One-horned rhino — "mini Kaziranga"', note:'A smaller, quieter rhino habitat north of the Brahmaputra.', season:'Open Nov–Apr; closed monsoon.'},
  {id:'dihing-patkai', name:'Dihing Patkai National Park', state:'Assam', region:'Northeast', established:'2020', nearest:'Digboi', access:{airport:'Dibrugarh (~45 km)', railway:'Tinsukia or Digboi'},
   famousFor:'Lowland rainforest & elephants', note:'One of the last stretches of lowland rainforest in India\'s northeast.', season:'Best Nov–Mar.'},
  // NORTHEAST — Sikkim
  {id:'khangchendzonga', name:'Khangchendzonga National Park', state:'Sikkim', region:'Northeast', established:'1977', nearest:'Yuksom', access:{airport:'Bagdogra (~150 km) or Pakyong, Sikkim\'s own airport (~130 km, weather-dependent)', railway:'New Jalpaiguri, NJP (~150 km)', note:'The final approach to Yuksom is a long mountain road.'},
   famousFor:'Snow leopard, red panda — UNESCO mixed site', note:'Spans from subtropical forest to the slopes of Khangchendzonga, the world\'s third-highest peak.', season:'Best Mar–May and Oct–Nov; snowbound in winter.'},
  // NORTHEAST — Arunachal Pradesh
  {id:'namdapha', name:'Namdapha National Park', state:'Arunachal Pradesh', region:'Northeast', established:'1983', nearest:'Miao', access:{airport:'Dibrugarh (~160 km), then road via Miao', railway:'Tinsukia (~180 km)', note:'Remote and lightly visited — an Inner Line Permit is required; check current access rules.'},
   famousFor:'Four big cat species in one forest', note:'Tiger, leopard, snow leopard and clouded leopard have all been recorded here.', season:'Best Nov–Apr; remote and lightly visited.'},
  {id:'mouling', name:'Mouling National Park', state:'Arunachal Pradesh', region:'Northeast', established:'1986', nearest:'Pasighat', access:{airport:'Dibrugarh, then onward to Pasighat (small airstrip, limited service)', railway:'None nearby.', note:'One of the most remote parks listed here — access requires significant planning and permits.'},
   famousFor:'Remote eastern Himalayan wilderness', note:'Rugged, largely unexplored forest along the Siang river gorge.', season:'Best Oct–Apr; access is limited and requires permits.'},
  // NORTHEAST — Meghalaya
  {id:'balpakram', name:'Balpakram National Park', state:'Meghalaya', region:'Northeast', established:'1985', nearest:'Tura', access:{airport:'Guwahati (~350 km) or Shillong (small airport, limited flights, ~150 km)', railway:'Guwahati (~350 km)', note:'Remote plateau access — allow extra travel days.'},
   famousFor:'Clouded leopard & red panda claims — "land of spirits"', note:'A dramatic plateau-and-gorge landscape central to Garo folklore.', season:'Best Nov–Apr; monsoon-heavy the rest of the year.'},
  // NORTHEAST — Manipur
  {id:'keibul-lamjao', name:'Keibul Lamjao National Park', state:'Manipur', region:'Northeast', established:'1977', nearest:'Bishnupur', access:{airport:'Imphal (~50 km)', railway:'Limited direct rail access to Manipur — flying is the practical option.'},
   famousFor:'Sangai (brow-antlered deer) — the world\'s only floating national park', note:'Sits on Loktak Lake\'s floating phumdi mats, home to the endangered dancing deer.', season:'Best Nov–Mar.'},
  // NORTHEAST — Mizoram
  {id:'murlen', name:'Murlen National Park', state:'Mizoram', region:'Northeast', established:'1991', nearest:'Champhai', access:{airport:'Aizawl (~200 km via Champhai)', railway:'None nearby — Mizoram has no rail network.'},
   famousFor:'Mizoram hill-forest biodiversity', note:'Remote hill forest on the Myanmar border, rich in rhododendrons and orchids.', season:'Best Nov–Mar.'},
  {id:'phawngpui', name:'Phawngpui (Blue Mountain) National Park', state:'Mizoram', region:'Northeast', established:'1992', nearest:'Lawngtlai', access:{airport:'Aizawl (~300 km, mostly by road)', railway:'None nearby.'},
   famousFor:'Mizoram\'s highest peak', note:'Named for the blue haze over its highest summit, with rare orchids and rhododendrons.', season:'Best Nov–Mar.'},
  // NORTHEAST — Nagaland
  {id:'ntangki', name:'Ntangki National Park', state:'Nagaland', region:'Northeast', established:'1993', nearest:'Peren', access:{airport:'Dimapur (~65 km)', railway:'Dimapur (~65 km, Nagaland\'s main railhead)'},
   famousFor:'Naga hill-forest wildlife', note:'Nagaland\'s principal protected forest, home to hoolock gibbons and hornbills.', season:'Best Nov–Mar.'},
  // NORTHEAST — Tripura
  {id:'clouded-leopard-np', name:'Clouded Leopard National Park (Sepahijala)', state:'Tripura', region:'Northeast', established:'2007', nearest:'Agartala', access:{airport:'Agartala (~25 km)', railway:'Agartala (~25 km)'},
   famousFor:'Clouded leopard & primates', note:'A compact park and rescue centre known for its primate diversity.', season:'Open year-round.'},

  // ISLANDS — Andaman & Nicobar
  {id:'mg-marine', name:'Mahatma Gandhi Marine National Park', state:'Andaman & Nicobar Islands', region:'Islands', established:'1983', nearest:'Wandoor, Port Blair', access:{airport:'Port Blair, Veer Savarkar Intl (~30 km, then boat)', railway:'None — no rail network in the islands.'},
   famousFor:'Coral reefs & marine biodiversity', note:'A cluster of islands and reefs off Port Blair, explored by glass-bottom boat and snorkel.', season:'Best Dec–Apr; seas rougher in monsoon.'},
  {id:'saddle-peak', name:'Saddle Peak National Park', state:'Andaman & Nicobar Islands', region:'Islands', established:'1979', nearest:'Diglipur', access:{airport:'Port Blair, then a connecting flight or boat to Diglipur', railway:'None.'},
   famousFor:'Andaman\'s highest point & hornbills', note:'Rainforest rising to the islands\' highest peak, good for the endemic Narcondam hornbill\'s relatives.', season:'Best Nov–Apr.'},
];

const ALL_PARKS = [...DETAILED_PARKS.map(p=>({...p, detailed:true})), ...OVERVIEW_PARKS.map(p=>({...p, detailed:false}))];

// ---- Field Stories ----
const STORIES = [
  {id:'s1', park:'Kanha National Park', state:'Madhya Pradesh', title:'The Return of the Barasingha',
   teaser:'By the 1970s the hardground barasingha was down to a few dozen animals. Kanha brought it back from the edge.',
   body:[`In the 1930s, thousands of hardground barasingha — a swamp deer subspecies found nowhere else — grazed the meadows of Kanha. By 1970, hunting and habitat loss had cut that number to under a hundred animals, and the subspecies stood on the edge of extinction.`,
   `Kanha's foresters responded by fencing off a breeding enclosure, protecting calving grounds, and reshaping fire and grazing management to favour the open meadows barasingha need. It was slow work measured in single digits of population growth each year.`,
   `Today Kanha's meadows hold a stable, growing population of the hardground barasingha, and the deer has become the park's emblem — proof that a single, patient, decades-long conservation programme can pull a species back from the brink.`]},
  {id:'s2', park:'Panna National Park', state:'Madhya Pradesh', title:'Zero to Sixty: Panna\'s Tiger Comeback',
   teaser:'In 2009, poaching wiped out every tiger in Panna. What followed became one of India\'s best-known recovery stories.',
   body:[`By 2009, Panna's tiger population had been poached to zero — a stark, public failure that shook India's conservation establishment. The park that had once held a healthy tiger population was, officially, empty of its flagship species.`,
   `Panna's answer was one of India's boldest tiger reintroduction efforts. Tigers were relocated from Bandhavgarh and Kanha, radio-collared, and closely monitored as they re-established territories in the Ken river landscape. Local communities and former poachers were drawn into patrolling and monitoring work.`,
   `Panna's tiger numbers have climbed back into the dozens in the years since, and the reserve is now cited internationally as a case study in recovering a tiger population from a total local collapse.`]},
  {id:'s3', park:'Sariska Tiger Reserve', state:'Rajasthan', title:'India\'s First Tiger Relocation',
   teaser:'Sariska lost every tiger to poaching in 2004–05 — and became the site of India\'s first-ever tiger translocation.',
   body:[`In 2004, a wildlife journalist's report revealed what officials had been slow to admit: Sariska's tigers were gone, wiped out by an organised poaching network over several years.`,
   `The response, beginning in 2008, was unprecedented — India's first attempt to translocate wild tigers between reserves, moving individuals from Ranthambore into Sariska's forests and radio-collaring them to track their survival and breeding.`,
   `The relocation had early setbacks, including the loss of a translocated tiger to poaching, but the programme continued and Sariska now holds a small, monitored tiger population again — a template later echoed in Panna's own recovery.`]},
  {id:'s4', park:'Gir National Park', state:'Gujarat', title:'The Last Lions of Asia',
   teaser:'Hunted down to as few as a couple of dozen animals a century ago, the Asiatic lion survives today only in Gir.',
   body:[`At the start of the 20th century, hunting had reduced the Asiatic lion — once found from the Middle East to eastern India — to a tiny remnant population in the Gir forest of Gujarat, by some estimates as low as a few dozen individuals.`,
   `The Nawab of Junagadh's early hunting restrictions, later reinforced by Indian state protection after independence, gave the population room to recover. Community tolerance from the Maldhari herding communities who share Gir's forests has also been central to the lions' survival alongside people and livestock.`,
   `Gir today is the only place on Earth with wild Asiatic lions, and the population — now numbering in the several hundreds — has begun spilling into forests beyond the park's boundaries, raising both hope and new questions about how to manage a big cat that has outgrown its last refuge.`]},
  {id:'s5', park:'Kaziranga National Park', state:'Assam', title:'Saving the One-Horned Rhino',
   teaser:'Kaziranga was set aside in 1905 to save a handful of rhinos. It now holds most of the world\'s population.',
   body:[`The story goes that Mary Curzon, wife of Viceroy Lord Curzon, visited the Kaziranga area hoping to see the famed one-horned rhinoceros and found almost none. Alarmed, she urged her husband to act, and in 1905 a reserve forest was set aside to protect the last few dozen animals in the area.`,
   `Decades of strict protection, anti-poaching patrols, and habitat management along the Brahmaputra floodplain followed. Poaching for rhino horn has remained a constant threat, met with increasingly intensive ranger patrols and monitoring.`,
   `Kaziranga is now a UNESCO World Heritage Site holding a substantial majority of the world's greater one-horned rhinos, a rare wildlife recovery large enough to be measured not in dozens, but in thousands.`]},
  {id:'s6', park:'Kuno National Park', state:'Madhya Pradesh', title:'Project Cheetah: Coming Home After Decades',
   teaser:'The cheetah was declared extinct in India in 1952. In 2022, Kuno became the site of the world\'s first intercontinental big-cat translocation.',
   body:[`India's last wild cheetahs were shot in the late 1940s, and the species was formally declared extinct in the country in 1952. For decades afterward, cheetah reintroduction remained a distant idea, tangled in legal and ecological debate.`,
   `That changed in September 2022, when cheetahs flown in from Namibia and later South Africa were released into Kuno's grasslands — the first-ever intercontinental translocation of a wild large carnivore between continents.`,
   `The project has been a genuine experiment in real time, with successes, losses, and lessons along the way, closely watched by conservationists worldwide as a test of whether a locally extinct large predator can be re-established from founder animals brought from another continent entirely.`]},
  {id:'s7', park:'Dachigam National Park', state:'Jammu & Kashmir', title:'Guarding the Hangul',
   teaser:'The Kashmir stag survives in only one forest on Earth — a former royal hunting reserve above Srinagar.',
   body:[`Dachigam's name is said to come from the Kashmiri for "ten villages," relocated when the valley was set aside first as a royal hunting reserve and later as a protected water catchment for Srinagar's drinking supply.`,
   `That accident of protection turned out to be a lifeline for the hangul, or Kashmir stag — a deer subspecies that has never been reliably recorded breeding successfully anywhere else. Numbers fell sharply through the mid-20th century under hunting pressure and habitat loss.`,
   `Today Dachigam remains the hangul's only viable wild home, and its population — still small and closely watched by wildlife biologists — makes this one of the narrowest single-species conservation stories in India.`]},
  {id:'s8', park:'Jim Corbett National Park', state:'Uttarakhand', title:'Where It All Began',
   teaser:'India\'s first national park was named for a hunter who became one of its earliest conservation voices.',
   body:[`Established in 1936 as Hailey National Park, this reserve in the Kumaon foothills was India's first, created under British colonial administration to protect a dwindling tiger population.`,
   `It was renamed in 1957 for Jim Corbett, a hunter turned photographer and writer whose accounts of tracking man-eating tigers and leopards made him one of the most influential voices for tiger conservation in early 20th-century India.`,
   `In 1973, this same landscape became the launch site for Project Tiger, India's flagship tiger conservation programme — making Corbett not just the country's oldest park, but the place where its modern tiger conservation story formally began.`]},
  {id:'s9', park:'Keibul Lamjao National Park', state:'Manipur', title:'The Floating Home of the Dancing Deer',
   teaser:'A national park that floats on a lake, built to save a deer once thought to be extinct.',
   body:[`Keibul Lamjao sits on Loktak Lake's phumdis — thick floating mats of vegetation and soil — making it, by most accounts, the only national park on Earth that literally floats.`,
   `It was created to protect the sangai, or brow-antlered deer, a Manipur state symbol once believed extinct until a small surviving population was rediscovered on these floating mats in the 1950s.`,
   `The sangai's fate remains tightly bound to the health of Loktak Lake itself — changes in water levels from a hydroelectric dam upstream directly affect the thickness of the phumdis the deer depend on, making this one of India's most unusual and fragile conservation stories.`]},
  {id:'s10', park:'Ranthambore National Park', state:'Rajasthan', title:'Machli, the Tigress Who Became a Legend',
   teaser:'One tigress, photographed for over a decade, turned Ranthambore into a global wildlife-tourism destination.',
   body:[`Machli, born in Ranthambore in the mid-1990s, became one of the most photographed tigers in the world over a reign that lasted well over a decade — famous for raising multiple litters and, in one widely shared sequence, fighting off a crocodile.`,
   `Her visibility to safari-goers, at a time when digital photography and early wildlife blogging were taking off, helped turn Ranthambore into an international wildlife-tourism draw and gave millions of people their first close encounter with a wild tiger, even from a jeep.`,
   `Machli died in 2016, but her descendants still range through Ranthambore's forests, and her story is often credited with reshaping how the wider world pictured India's tiger reserves — not just as scientific reserves, but as places to actually go and see a tiger.`]},
  {id:'s11', park:'Bandhavgarh National Park', state:'Madhya Pradesh', title:'The White Tiger\'s Birthplace',
   teaser:'Nearly every captive white tiger in the world traces its ancestry to one cub caught in Bandhavgarh in 1951.',
   body:[`In 1951, the Maharaja of Rewa captured a white tiger cub — a rare genetic variant, not a distinct species — from the forests that are now part of Bandhavgarh National Park. The cub, named Mohan, was raised in captivity rather than released.`,
   `Mohan was later bred with a normally coloured tigress, and selective breeding of his descendants produced the line of white tigers found in zoos and captive collections around the world today.`,
   `Wild white tigers have not been confirmed in Bandhavgarh's forests since, but the park's connection to Mohan is a well-known thread in its history — a reminder that a single genetic anomaly, captured nearly seventy years ago, is the ancestor of almost every white tiger alive.`]},
  {id:'s12', park:'Hemis National Park', state:'Ladakh', title:'The Ghost of the Mountains',
   teaser:'Hemis is thought to hold one of the highest densities of snow leopards found anywhere — a cat rarely seen even by researchers who study it.',
   body:[`Snow leopards are famously hard to find — solitary, superbly camouflaged, and spread thinly across vast high-altitude ranges. For decades, most knowledge of the species came from tracks, scat, and the rare confirmed sighting.`,
   `Hemis, India's largest national park, sits within the Ladakh range and has become one of the best-studied snow leopard landscapes anywhere, with camera-trap and radio-collar studies suggesting an unusually high density of cats for the terrain.`,
   `That research, combined with community-run homestay programmes in villages bordering the park, has turned snow leopard tracking in Hemis into a rare thing: a wildlife-tourism experience built around actively looking for one of the world's most elusive predators, rather than a guaranteed sighting.`]},
  {id:'s13', park:'Simlipal National Park', state:'Odisha', title:'The Black Tigers of Simlipal',
   teaser:'Some of Simlipal\'s tigers carry a rare genetic mutation that turns their stripes unusually wide and dark.',
   body:[`Among Simlipal's tiger population, researchers have documented individuals with an unusual coat pattern — stripes so broad and dense that the animals appear almost black, a condition known as pseudo-melanism.`,
   `Genetic studies published in the past few years traced the trait to a specific gene mutation, and suggested it has become more common in Simlipal's small, somewhat isolated tiger population — a possible consequence of limited genetic mixing with tigers elsewhere.`,
   `The "black tigers" have made Simlipal a point of scientific interest, and a reminder that India's tiger reserves are not just about protecting a single species, but about protecting the genetic diversity within it.`]},
  {id:'s14', park:'Periyar National Park', state:'Kerala', title:'A Dam, a Lake, a Sanctuary',
   teaser:'Periyar\'s famous lake wasn\'t always there — it was built by British engineers over a century ago, and the wildlife followed.',
   body:[`Periyar Lake is not a natural feature — it was created in 1895 when British engineers dammed the Periyar river to irrigate farmland in what is now Tamil Nadu, flooding a large stretch of forest in the process.`,
   `Rather than destroying the area's wildlife value, the new lake reshaped it: wildlife including elephants, gaur, and sambar became easy to observe along its shores, and the surrounding forest was declared a sanctuary in 1934 and later a tiger reserve.`,
   `Periyar's boat safaris on that century-old reservoir remain one of its signature experiences today — a rare case of a piece of colonial-era infrastructure becoming the centrepiece of a modern wildlife reserve.`]},
  {id:'s15', park:'Namdapha National Park', state:'Arunachal Pradesh', title:'Four Cats, One Forest',
   teaser:'Namdapha is one of very few places on Earth where tiger, leopard, snow leopard and clouded leopard have all been recorded.',
   body:[`Namdapha's forests span an extraordinary elevation range, from lowland tropical rainforest near the Myanmar border up to snow-capped peaks — a compression of habitats rarely found within a single protected area.`,
   `That range is what allows four different big cat species — tiger, common leopard, clouded leopard, and snow leopard — to potentially share the same reserve, each occupying a different elevation band, a combination recorded in very few places worldwide.`,
   `Namdapha remains one of India's least-visited major parks, its dense, roadless terrain making sightings — of any of the four cats — a matter of real patience rather than a routine jeep drive.`]},
  {id:'s16', park:'Tadoba-Andhari Tiger Reserve', state:'Maharashtra', title:'The Tigress Who Ruled the Lake',
   teaser:'Tadoba\'s tigresses, filmed for wildlife documentaries around Telia Lake, turned the reserve into Maharashtra\'s tiger-watching capital.',
   body:[`Tadoba's Telia Lake area became known through a succession of dominant tigresses whose territories overlapped the waterhole — animals whose confident, camera-friendly behaviour drew wildlife filmmakers and photographers from across the world.`,
   `Their frequent daytime sightings, unusual for a species that's normally shy of vehicles, helped build Tadoba's reputation among safari-goers as one of the most reliable places in India to see a wild tiger, rivalling far older, better-known reserves.`,
   `That reputation has since pulled Tadoba from a relatively quiet Vidarbha forest into Maharashtra's busiest and best-known tiger destination, with permits for the most popular zones now booked out well in advance through peak season.`]},
];
