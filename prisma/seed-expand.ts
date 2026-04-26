import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function makeSlug(name: string, city: string, state: string): string {
  return slugify(`${name}-bingo-${city}-${state}`);
}

const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO",
  Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX",
  Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

interface HallInput {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  hours?: string;
  website?: string;
  description?: string;
  lat?: number;
  lng?: number;
}

const additionalHalls: HallInput[] = [
  // California - more cities
  { name: "Sacramento Bingo Palace", address: "1201 L St", city: "Sacramento", state: "California", zip: "95814", phone: "(916) 442-7777", hours: "Mon–Sat 7pm", lat: 38.5816, lng: -121.4944 },
  { name: "Stockton Eagles Bingo", address: "2301 Pacific Ave", city: "Stockton", state: "California", zip: "95204", phone: "(209) 467-4400", hours: "Wed & Fri 6pm", lat: 37.9577, lng: -121.2908 },
  { name: "Bakersfield VFW Bingo", address: "1600 18th St", city: "Bakersfield", state: "California", zip: "93301", phone: "(661) 327-6600", hours: "Tue & Sat 6:30pm", lat: 35.3733, lng: -119.0187 },
  { name: "Riverside Community Bingo", address: "3750 University Ave", city: "Riverside", state: "California", zip: "92501", phone: "(951) 826-5303", hours: "Mon–Fri 6pm", lat: 33.9806, lng: -117.3755 },
  { name: "Santa Ana Bingo World", address: "120 Civic Center Dr W", city: "Santa Ana", state: "California", zip: "92701", phone: "(714) 647-5400", hours: "Daily 5pm", lat: 33.7455, lng: -117.8677 },
  { name: "Anaheim Lucky Bingo", address: "200 S Anaheim Blvd", city: "Anaheim", state: "California", zip: "92805", phone: "(714) 765-5162", hours: "Tue–Sun 6pm", lat: 33.8353, lng: -117.9145 },
  { name: "Irvine Moose Lodge Bingo", address: "1 Civic Center Plaza", city: "Irvine", state: "California", zip: "92606", phone: "(949) 724-6000", hours: "Sat 2pm & 6pm", lat: 33.6846, lng: -117.8265 },
  { name: "Chula Vista Bingo Hall", address: "276 4th Ave", city: "Chula Vista", state: "California", zip: "91910", phone: "(619) 691-5044", hours: "Wed & Sat 7pm", lat: 32.6401, lng: -117.0842 },
  { name: "Fremont Elks Bingo Night", address: "3465 Capitol Ave", city: "Fremont", state: "California", zip: "94538", phone: "(510) 791-4300", hours: "Fri 6pm", lat: 37.5485, lng: -121.9886 },
  { name: "San Bernardino VFW Bingo", address: "201 N E St", city: "San Bernardino", state: "California", zip: "92401", phone: "(909) 384-5005", hours: "Mon & Thu 6pm", lat: 34.1083, lng: -117.2898 },
  { name: "Modesto Knights Bingo", address: "1010 10th St", city: "Modesto", state: "California", zip: "95354", phone: "(209) 577-5200", hours: "Tue & Sat 7pm", lat: 37.6391, lng: -120.9969 },
  { name: "Oxnard Eagles Bingo", address: "214 S C St", city: "Oxnard", state: "California", zip: "93030", phone: "(805) 385-7400", hours: "Wed 6:30pm, Sat 2pm", lat: 34.1975, lng: -119.1771 },
  { name: "Fontana Bingo Center", address: "8353 Sierra Ave", city: "Fontana", state: "California", zip: "92335", phone: "(909) 350-7600", hours: "Mon–Sat 5pm", lat: 34.0922, lng: -117.4350 },
  { name: "Moreno Valley Bingo Hall", address: "14177 Frederick St", city: "Moreno Valley", state: "California", zip: "92553", phone: "(951) 413-3000", hours: "Fri–Sun 6pm", lat: 33.9425, lng: -117.2297 },
  { name: "Glendale Lucky Stars Bingo", address: "141 N Glendale Ave", city: "Glendale", state: "California", zip: "91206", phone: "(818) 548-4844", hours: "Tue & Fri 7pm", lat: 34.1425, lng: -118.2551 },
  { name: "Huntington Beach Bingo Night", address: "2000 Main St", city: "Huntington Beach", state: "California", zip: "92648", phone: "(714) 536-5553", hours: "Mon, Wed, Sat 6pm", lat: 33.6595, lng: -117.9988 },
  { name: "Santa Clarita Bingo Hall", address: "23920 Valencia Blvd", city: "Santa Clarita", state: "California", zip: "91355", phone: "(661) 255-4330", hours: "Thu & Sat 7pm", lat: 34.3917, lng: -118.5427 },
  { name: "Garden Grove Bingo Palace", address: "11222 Acacia Pkwy", city: "Garden Grove", state: "California", zip: "92840", phone: "(714) 741-5100", hours: "Daily 5pm", lat: 33.7743, lng: -117.9379 },
  { name: "Ontario Bingo World", address: "303 E B St", city: "Ontario", state: "California", zip: "91764", phone: "(909) 395-2022", hours: "Tue–Sat 6pm", lat: 34.0633, lng: -117.6509 },
  { name: "Rancho Cucamonga Eagles Bingo", address: "10500 Civic Center Dr", city: "Rancho Cucamonga", state: "California", zip: "91730", phone: "(909) 477-2700", hours: "Wed & Sat 7pm", lat: 34.1064, lng: -117.5931 },

  // Texas - more cities
  { name: "San Antonio VFW Bingo Hall", address: "1500 Dolorosa St", city: "San Antonio", state: "Texas", zip: "78207", phone: "(210) 207-8683", hours: "Tue, Thu, Sat 7pm", lat: 29.4241, lng: -98.4936 },
  { name: "Fort Worth Bingo Palace", address: "200 Texas St", city: "Fort Worth", state: "Texas", zip: "76102", phone: "(817) 392-2222", hours: "Mon–Sat 7pm", lat: 32.7555, lng: -97.3308 },
  { name: "El Paso Eagles Bingo", address: "300 N Campbell St", city: "El Paso", state: "Texas", zip: "79901", phone: "(915) 212-0000", hours: "Fri 6pm, Sat 2pm & 6pm", lat: 31.7619, lng: -106.4850 },
  { name: "Arlington Bingo Center", address: "101 W Abram St", city: "Arlington", state: "Texas", zip: "76010", phone: "(817) 459-6121", hours: "Daily 6pm", lat: 32.7357, lng: -97.1081 },
  { name: "Corpus Christi Bingo Hall", address: "1201 Leopard St", city: "Corpus Christi", state: "Texas", zip: "78401", phone: "(361) 880-3777", hours: "Tue & Sat 7pm", lat: 27.8006, lng: -97.3964 },
  { name: "Plano Lucky Bingo", address: "1520 K Ave", city: "Plano", state: "Texas", zip: "75074", phone: "(972) 941-7120", hours: "Mon, Wed, Fri 6pm", lat: 33.0198, lng: -96.6989 },
  { name: "Laredo VFW Bingo", address: "1110 Victoria St", city: "Laredo", state: "Texas", zip: "78040", phone: "(956) 791-7399", hours: "Thu & Sat 7pm", lat: 27.5306, lng: -99.4803 },
  { name: "Lubbock Bingo World", address: "1625 13th St", city: "Lubbock", state: "Texas", zip: "79401", phone: "(806) 775-2000", hours: "Mon–Sat 6pm", lat: 33.5779, lng: -101.8552 },
  { name: "Garland Bingo Night", address: "200 Civic Center Dr", city: "Garland", state: "Texas", zip: "75040", phone: "(972) 205-2000", hours: "Tue & Sat 7pm", lat: 32.9126, lng: -96.6389 },
  { name: "Irving Eagles Bingo", address: "825 W Irving Blvd", city: "Irving", state: "Texas", zip: "75060", phone: "(972) 721-2600", hours: "Fri 7pm, Sat 2pm", lat: 32.8140, lng: -96.9489 },
  { name: "Amarillo Bingo Hall", address: "509 SE 7th Ave", city: "Amarillo", state: "Texas", zip: "79101", phone: "(806) 378-3000", hours: "Mon–Fri 6pm", lat: 35.2220, lng: -101.8313 },
  { name: "Grand Prairie Bingo Palace", address: "317 W Main St", city: "Grand Prairie", state: "Texas", zip: "75050", phone: "(972) 237-8000", hours: "Tue, Thu, Sat 6pm", lat: 32.7460, lng: -96.9978 },
  { name: "Brownsville Bingo Center", address: "1001 E Elizabeth St", city: "Brownsville", state: "Texas", zip: "78520", phone: "(956) 548-6102", hours: "Daily 5pm", lat: 25.9017, lng: -97.4975 },
  { name: "McKinney Moose Lodge Bingo", address: "222 N Tennessee St", city: "McKinney", state: "Texas", zip: "75069", phone: "(972) 547-7500", hours: "Wed & Sat 7pm", lat: 33.1972, lng: -96.6397 },
  { name: "Killeen VFW Bingo", address: "3601 S W S Young Dr", city: "Killeen", state: "Texas", zip: "76542", phone: "(254) 526-5700", hours: "Fri 7pm, Sat 2pm", lat: 31.1171, lng: -97.7278 },
  { name: "Frisco Knights Bingo", address: "6101 Frisco Square Blvd", city: "Frisco", state: "Texas", zip: "75034", phone: "(972) 292-5000", hours: "Mon & Thu 6pm", lat: 33.1584, lng: -96.8234 },
  { name: "Waco Elks Bingo Night", address: "300 Austin Ave", city: "Waco", state: "Texas", zip: "76701", phone: "(254) 750-5900", hours: "Tue & Sat 7pm", lat: 31.5493, lng: -97.1467 },
  { name: "Midland Bingo Hall", address: "300 N Loraine St", city: "Midland", state: "Texas", zip: "79701", phone: "(432) 685-7400", hours: "Wed & Sat 6pm", lat: 31.9974, lng: -102.0779 },
  { name: "Odessa Eagles Bingo", address: "411 W 8th St", city: "Odessa", state: "Texas", zip: "79761", phone: "(432) 335-3040", hours: "Thu & Sat 7pm", lat: 31.8457, lng: -102.3676 },
  { name: "Pasadena Bingo World", address: "1149 Ellsworth Dr", city: "Pasadena", state: "Texas", zip: "77506", phone: "(713) 477-1511", hours: "Mon–Sat 5pm", lat: 29.6911, lng: -95.2091 },

  // Florida - more cities
  { name: "Tampa Bay Bingo Palace", address: "306 E Jackson St", city: "Tampa", state: "Florida", zip: "33602", phone: "(813) 274-8251", hours: "Mon–Sat 7pm", lat: 27.9506, lng: -82.4572 },
  { name: "Orlando VFW Bingo Hall", address: "400 S Orange Ave", city: "Orlando", state: "Florida", zip: "32801", phone: "(407) 246-2121", hours: "Tue, Thu, Sat 6pm", lat: 28.5383, lng: -81.3792 },
  { name: "Jacksonville Eagles Bingo", address: "117 W Duval St", city: "Jacksonville", state: "Florida", zip: "32202", phone: "(904) 630-1776", hours: "Wed & Sat 7pm", lat: 30.3322, lng: -81.6557 },
  { name: "Fort Lauderdale Bingo Center", address: "100 N Andrews Ave", city: "Fort Lauderdale", state: "Florida", zip: "33301", phone: "(954) 828-5000", hours: "Mon–Fri 6pm", lat: 26.1224, lng: -80.1373 },
  { name: "Tallahassee Bingo Night", address: "300 S Adams St", city: "Tallahassee", state: "Florida", zip: "32301", phone: "(850) 891-8181", hours: "Fri 6pm, Sat 2pm", lat: 30.4518, lng: -84.2807 },
  { name: "Hollywood FL Bingo Hall", address: "2600 Hollywood Blvd", city: "Hollywood", state: "Florida", zip: "33020", phone: "(954) 921-3321", hours: "Tue–Sun 6pm", lat: 26.0112, lng: -80.1495 },
  { name: "Miramar Bingo Palace", address: "2200 Civic Center Pl", city: "Miramar", state: "Florida", zip: "33025", phone: "(954) 602-3000", hours: "Mon, Wed, Sat 7pm", lat: 25.9860, lng: -80.2330 },
  { name: "Gainesville VFW Bingo", address: "2000 SW 13th St", city: "Gainesville", state: "Florida", zip: "32608", phone: "(352) 334-5000", hours: "Thu & Sat 6pm", lat: 29.6516, lng: -82.3248 },
  { name: "Coral Springs Bingo Hall", address: "9551 W Sample Rd", city: "Coral Springs", state: "Florida", zip: "33065", phone: "(954) 344-1000", hours: "Tue & Sat 7pm", lat: 26.2712, lng: -80.2706 },
  { name: "Clearwater Lucky Bingo", address: "100 S Myrtle Ave", city: "Clearwater", state: "Florida", zip: "33756", phone: "(727) 562-4000", hours: "Mon–Sat 5pm", lat: 27.9659, lng: -82.8001 },
  { name: "Cape Coral Elks Bingo", address: "1015 Cultural Park Blvd", city: "Cape Coral", state: "Florida", zip: "33990", phone: "(239) 574-0425", hours: "Wed & Sat 6pm", lat: 26.5629, lng: -81.9495 },
  { name: "Port St Lucie Bingo", address: "121 SW Port St Lucie Blvd", city: "Port St. Lucie", state: "Florida", zip: "34984", phone: "(772) 871-5000", hours: "Mon & Fri 7pm", lat: 27.2939, lng: -80.3503 },
  { name: "Pembroke Pines Bingo Night", address: "10100 Pines Blvd", city: "Pembroke Pines", state: "Florida", zip: "33026", phone: "(954) 431-4800", hours: "Tue, Thu, Sat 6pm", lat: 26.0071, lng: -80.2959 },
  { name: "West Palm Beach Bingo World", address: "301 Clematis St", city: "West Palm Beach", state: "Florida", zip: "33401", phone: "(561) 822-1400", hours: "Mon–Fri 6pm", lat: 26.7153, lng: -80.0534 },
  { name: "Lakeland Eagles Bingo", address: "228 S Massachusetts Ave", city: "Lakeland", state: "Florida", zip: "33801", phone: "(863) 834-6000", hours: "Wed & Sat 7pm", lat: 28.0395, lng: -81.9498 },
  { name: "Pompano Beach Bingo Hall", address: "100 W Atlantic Blvd", city: "Pompano Beach", state: "Florida", zip: "33060", phone: "(954) 786-4600", hours: "Mon, Thu, Sat 6pm", lat: 26.2379, lng: -80.1248 },
  { name: "Davie Moose Lodge Bingo", address: "6591 SW 45th St", city: "Davie", state: "Florida", zip: "33314", phone: "(954) 797-1040", hours: "Tue & Sat 6pm", lat: 26.0765, lng: -80.2520 },
  { name: "Sunrise VFW Bingo", address: "10770 W Oakland Park Blvd", city: "Sunrise", state: "Florida", zip: "33351", phone: "(954) 747-4600", hours: "Fri 7pm", lat: 26.1667, lng: -80.2567 },
  { name: "Deerfield Beach Bingo", address: "150 NE 2nd Ave", city: "Deerfield Beach", state: "Florida", zip: "33441", phone: "(954) 480-4400", hours: "Mon & Wed 7pm", lat: 26.3184, lng: -80.1273 },
  { name: "Boca Raton Bingo Center", address: "201 W Palmetto Park Rd", city: "Boca Raton", state: "Florida", zip: "33432", phone: "(561) 393-7700", hours: "Sat 2pm & 6pm", lat: 26.3683, lng: -80.1289 },

  // New York - more cities
  { name: "Buffalo VFW Bingo Hall", address: "65 Niagara Square", city: "Buffalo", state: "New York", zip: "14202", phone: "(716) 851-4200", hours: "Mon–Sat 7pm", lat: 42.8864, lng: -78.8784 },
  { name: "Yonkers Bingo Palace", address: "40 S Broadway", city: "Yonkers", state: "New York", zip: "10701", phone: "(914) 377-4300", hours: "Tue, Thu, Sat 6pm", lat: 40.9312, lng: -73.8988 },
  { name: "Rochester Knights Bingo", address: "30 Church St", city: "Rochester", state: "New York", zip: "14614", phone: "(585) 428-7045", hours: "Mon–Fri 6pm", lat: 43.1566, lng: -77.6088 },
  { name: "Syracuse Eagles Bingo", address: "233 E Washington St", city: "Syracuse", state: "New York", zip: "13202", phone: "(315) 448-8005", hours: "Wed & Sat 7pm", lat: 43.0481, lng: -76.1474 },
  { name: "Albany Elks Bingo Night", address: "24 Eagle St", city: "Albany", state: "New York", zip: "12207", phone: "(518) 434-5090", hours: "Fri 6pm, Sat 2pm", lat: 42.6526, lng: -73.7562 },
  { name: "New Rochelle Bingo Hall", address: "515 North Ave", city: "New Rochelle", state: "New York", zip: "10801", phone: "(914) 654-2300", hours: "Mon & Thu 7pm", lat: 40.9115, lng: -73.7826 },
  { name: "Mount Vernon VFW Bingo", address: "1 Roosevelt Square", city: "Mount Vernon", state: "New York", zip: "10550", phone: "(914) 665-2474", hours: "Tue & Sat 6pm", lat: 40.9126, lng: -73.8371 },
  { name: "Schenectady Bingo World", address: "105 Jay St", city: "Schenectady", state: "New York", zip: "12305", phone: "(518) 382-5000", hours: "Mon, Wed, Sat 6pm", lat: 42.8142, lng: -73.9396 },
  { name: "Utica Moose Lodge Bingo", address: "1 Kennedy Plaza", city: "Utica", state: "New York", zip: "13501", phone: "(315) 792-0107", hours: "Thu & Sat 7pm", lat: 43.1009, lng: -75.2327 },
  { name: "Troy Bingo Hall", address: "1776 Sixth Ave", city: "Troy", state: "New York", zip: "12180", phone: "(518) 270-4500", hours: "Fri 7pm, Sat 2pm", lat: 42.7284, lng: -73.6918 },

  // Illinois - more cities
  { name: "Aurora Bingo Palace", address: "44 E Downer Pl", city: "Aurora", state: "Illinois", zip: "60505", phone: "(630) 256-3000", hours: "Mon–Sat 6pm", lat: 41.7606, lng: -88.3201 },
  { name: "Joliet VFW Bingo Hall", address: "150 W Jefferson St", city: "Joliet", state: "Illinois", zip: "60432", phone: "(815) 724-4000", hours: "Tue, Thu, Sat 7pm", lat: 41.5250, lng: -88.0817 },
  { name: "Naperville Eagles Bingo", address: "400 S Eagle St", city: "Naperville", state: "Illinois", zip: "60540", phone: "(630) 420-6111", hours: "Wed & Sat 6pm", lat: 41.7508, lng: -88.1535 },
  { name: "Rockford Bingo Center", address: "425 E State St", city: "Rockford", state: "Illinois", zip: "61104", phone: "(815) 987-5600", hours: "Mon–Fri 6pm", lat: 42.2711, lng: -89.0940 },
  { name: "Springfield IL Bingo Night", address: "800 E Monroe St", city: "Springfield", state: "Illinois", zip: "62701", phone: "(217) 789-2000", hours: "Fri 6pm, Sat 2pm & 6pm", lat: 39.7817, lng: -89.6501 },
  { name: "Elgin Lucky Bingo", address: "150 Dexter Ct", city: "Elgin", state: "Illinois", zip: "60120", phone: "(847) 931-6120", hours: "Mon & Thu 7pm", lat: 42.0354, lng: -88.2826 },
  { name: "Peoria Bingo World", address: "419 Fulton St", city: "Peoria", state: "Illinois", zip: "61602", phone: "(309) 494-8500", hours: "Tue & Sat 6pm", lat: 40.6936, lng: -89.5890 },
  { name: "Waukegan Bingo Hall", address: "100 N Martin Luther King Jr Ave", city: "Waukegan", state: "Illinois", zip: "60085", phone: "(847) 599-2500", hours: "Wed & Sat 7pm", lat: 42.3636, lng: -87.8448 },
  { name: "Cicero Bingo Palace", address: "4937 W 25th St", city: "Cicero", state: "Illinois", zip: "60804", phone: "(708) 656-3600", hours: "Mon–Sat 5pm", lat: 41.8456, lng: -87.7537 },
  { name: "Champaign Elks Bingo", address: "102 N Neil St", city: "Champaign", state: "Illinois", zip: "61820", phone: "(217) 403-8700", hours: "Fri 7pm, Sat 2pm", lat: 40.1164, lng: -88.2434 },

  // Pennsylvania - more cities
  { name: "Pittsburgh VFW Bingo Hall", address: "414 Grant St", city: "Pittsburgh", state: "Pennsylvania", zip: "15219", phone: "(412) 255-2626", hours: "Tue, Thu, Sat 6pm", lat: 40.4406, lng: -79.9959 },
  { name: "Allentown Eagles Bingo", address: "435 Hamilton St", city: "Allentown", state: "Pennsylvania", zip: "18101", phone: "(610) 437-7546", hours: "Mon–Fri 6pm", lat: 40.6023, lng: -75.4714 },
  { name: "Erie Bingo Palace", address: "626 State St", city: "Erie", state: "Pennsylvania", zip: "16501", phone: "(814) 870-1234", hours: "Wed & Sat 7pm", lat: 42.1292, lng: -80.0851 },
  { name: "Reading Bingo Center", address: "815 Washington St", city: "Reading", state: "Pennsylvania", zip: "19601", phone: "(610) 655-6000", hours: "Mon, Wed, Sat 6pm", lat: 40.3356, lng: -75.9269 },
  { name: "Scranton Elks Bingo", address: "340 N Washington Ave", city: "Scranton", state: "Pennsylvania", zip: "18503", phone: "(570) 963-6800", hours: "Tue & Sat 7pm", lat: 41.4090, lng: -75.6624 },
  { name: "Bethlehem Bingo Night", address: "10 E Church St", city: "Bethlehem", state: "Pennsylvania", zip: "18018", phone: "(610) 865-7000", hours: "Fri 6pm, Sat 2pm", lat: 40.6259, lng: -75.3705 },
  { name: "Lancaster VFW Bingo", address: "120 N Duke St", city: "Lancaster", state: "Pennsylvania", zip: "17602", phone: "(717) 291-4711", hours: "Thu & Sat 6pm", lat: 40.0379, lng: -76.3055 },
  { name: "Harrisburg Moose Lodge Bingo", address: "10 N Second St", city: "Harrisburg", state: "Pennsylvania", zip: "17101", phone: "(717) 255-3040", hours: "Mon & Fri 7pm", lat: 40.2732, lng: -76.8867 },
  { name: "York Bingo Hall", address: "50 W King St", city: "York", state: "Pennsylvania", zip: "17401", phone: "(717) 846-4600", hours: "Wed & Sat 7pm", lat: 39.9626, lng: -76.7277 },
  { name: "Altoona Bingo World", address: "1301 12th Ave", city: "Altoona", state: "Pennsylvania", zip: "16601", phone: "(814) 944-7500", hours: "Tue & Sat 6pm", lat: 40.5187, lng: -78.3947 },

  // Ohio - more cities
  { name: "Columbus VFW Bingo Hall", address: "90 W Broad St", city: "Columbus", state: "Ohio", zip: "43215", phone: "(614) 645-8100", hours: "Mon–Sat 7pm", lat: 39.9612, lng: -82.9988 },
  { name: "Cleveland Eagles Bingo", address: "601 Lakeside Ave E", city: "Cleveland", state: "Ohio", zip: "44114", phone: "(216) 664-2070", hours: "Tue, Thu, Sat 6pm", lat: 41.4993, lng: -81.6944 },
  { name: "Cincinnati Bingo Palace", address: "801 Plum St", city: "Cincinnati", state: "Ohio", zip: "45202", phone: "(513) 352-3000", hours: "Mon–Fri 6pm", lat: 39.1031, lng: -84.5120 },
  { name: "Dayton Bingo Center", address: "101 W Third St", city: "Dayton", state: "Ohio", zip: "45402", phone: "(937) 333-3333", hours: "Wed & Sat 7pm", lat: 39.7589, lng: -84.1916 },
  { name: "Toledo Knights Bingo", address: "1 Government Center", city: "Toledo", state: "Ohio", zip: "43604", phone: "(419) 245-1001", hours: "Fri 6pm, Sat 2pm", lat: 41.6528, lng: -83.5379 },
  { name: "Akron Elks Bingo Night", address: "166 S High St", city: "Akron", state: "Ohio", zip: "44308", phone: "(330) 375-2345", hours: "Mon & Thu 7pm", lat: 41.0814, lng: -81.5190 },
  { name: "Parma Bingo Hall", address: "6611 Ridge Rd", city: "Parma", state: "Ohio", zip: "44129", phone: "(440) 885-8000", hours: "Tue & Sat 6pm", lat: 41.3845, lng: -81.7229 },
  { name: "Canton VFW Bingo", address: "218 Cleveland Ave NW", city: "Canton", state: "Ohio", zip: "44702", phone: "(330) 438-4307", hours: "Wed & Sat 7pm", lat: 40.7989, lng: -81.3784 },
  { name: "Youngstown Moose Bingo", address: "26 S Phelps St", city: "Youngstown", state: "Ohio", zip: "44503", phone: "(330) 742-8700", hours: "Mon & Fri 6pm", lat: 41.0998, lng: -80.6495 },
  { name: "Lorain Bingo World", address: "200 W Erie Ave", city: "Lorain", state: "Ohio", zip: "44052", phone: "(440) 204-2020", hours: "Sat 2pm & 6pm", lat: 41.4523, lng: -82.1824 },

  // Michigan - more cities
  { name: "Detroit VFW Bingo Hall", address: "2 Woodward Ave", city: "Detroit", state: "Michigan", zip: "48226", phone: "(313) 224-3400", hours: "Mon–Sat 6pm", lat: 42.3314, lng: -83.0458 },
  { name: "Grand Rapids Bingo Palace", address: "300 Monroe Ave NW", city: "Grand Rapids", state: "Michigan", zip: "49503", phone: "(616) 456-3000", hours: "Tue, Thu, Sat 7pm", lat: 42.9634, lng: -85.6681 },
  { name: "Warren Eagles Bingo", address: "1 City Square", city: "Warren", state: "Michigan", zip: "48093", phone: "(586) 574-4500", hours: "Mon–Fri 6pm", lat: 42.4775, lng: -83.0277 },
  { name: "Sterling Heights Bingo", address: "40555 Utica Rd", city: "Sterling Heights", state: "Michigan", zip: "48313", phone: "(586) 446-2489", hours: "Wed & Sat 7pm", lat: 42.5803, lng: -83.0302 },
  { name: "Lansing Bingo Center", address: "124 W Michigan Ave", city: "Lansing", state: "Michigan", zip: "48933", phone: "(517) 483-4000", hours: "Mon, Thu, Sat 6pm", lat: 42.7325, lng: -84.5555 },
  { name: "Ann Arbor Elks Bingo", address: "100 N Fifth Ave", city: "Ann Arbor", state: "Michigan", zip: "48104", phone: "(734) 794-6000", hours: "Fri 6pm, Sat 2pm", lat: 42.2808, lng: -83.7430 },
  { name: "Flint VFW Bingo Night", address: "1101 S Saginaw St", city: "Flint", state: "Michigan", zip: "48502", phone: "(810) 766-7346", hours: "Tue & Sat 7pm", lat: 43.0125, lng: -83.6875 },
  { name: "Dearborn Bingo Hall", address: "13615 Michigan Ave", city: "Dearborn", state: "Michigan", zip: "48126", phone: "(313) 943-2000", hours: "Mon & Fri 6pm", lat: 42.3223, lng: -83.1763 },
  { name: "Livonia Bingo World", address: "33000 Civic Center Dr", city: "Livonia", state: "Michigan", zip: "48154", phone: "(734) 466-2400", hours: "Wed & Sat 7pm", lat: 42.3684, lng: -83.3527 },
  { name: "Clinton Township Bingo", address: "40700 Romeo Plank Rd", city: "Clinton Township", state: "Michigan", zip: "48038", phone: "(586) 286-9337", hours: "Tue, Thu, Sat 6pm", lat: 42.5869, lng: -82.9193 },

  // Georgia - more cities
  { name: "Atlanta VFW Bingo Hall", address: "55 Trinity Ave SW", city: "Atlanta", state: "Georgia", zip: "30303", phone: "(404) 330-6100", hours: "Mon–Sat 7pm", lat: 33.7490, lng: -84.3880 },
  { name: "Augusta Eagles Bingo", address: "535 Telfair St", city: "Augusta", state: "Georgia", zip: "30901", phone: "(706) 821-2500", hours: "Tue, Thu, Sat 6pm", lat: 33.4735, lng: -81.9748 },
  { name: "Columbus GA Bingo Palace", address: "100 10th St", city: "Columbus", state: "Georgia", zip: "31901", phone: "(706) 653-4013", hours: "Mon–Fri 6pm", lat: 32.4610, lng: -84.9877 },
  { name: "Macon Bingo Center", address: "700 Poplar St", city: "Macon", state: "Georgia", zip: "31201", phone: "(478) 751-7170", hours: "Wed & Sat 7pm", lat: 32.8407, lng: -83.6324 },
  { name: "Savannah Bingo Night", address: "2 E Bay St", city: "Savannah", state: "Georgia", zip: "31401", phone: "(912) 651-6415", hours: "Fri 6pm, Sat 2pm & 6pm", lat: 32.0809, lng: -81.0912 },
  { name: "Athens GA Bingo Hall", address: "301 College Ave", city: "Athens", state: "Georgia", zip: "30601", phone: "(706) 613-3100", hours: "Mon & Thu 7pm", lat: 33.9519, lng: -83.3576 },
  { name: "Sandy Springs Bingo", address: "1 Galambos Way", city: "Sandy Springs", state: "Georgia", zip: "30328", phone: "(770) 730-5600", hours: "Tue & Sat 6pm", lat: 33.9304, lng: -84.3733 },
  { name: "Roswell GA Bingo Night", address: "38 Hill St", city: "Roswell", state: "Georgia", zip: "30075", phone: "(770) 641-3727", hours: "Wed & Sat 7pm", lat: 34.0232, lng: -84.3616 },
  { name: "Albany GA Bingo Hall", address: "225 Pine Ave", city: "Albany", state: "Georgia", zip: "31701", phone: "(229) 431-3232", hours: "Fri 7pm, Sat 2pm", lat: 31.5785, lng: -84.1557 },
  { name: "Warner Robins Bingo World", address: "202 N Davis Dr", city: "Warner Robins", state: "Georgia", zip: "31093", phone: "(478) 302-5400", hours: "Mon–Sat 6pm", lat: 32.6130, lng: -83.5985 },

  // North Carolina - more cities
  { name: "Charlotte VFW Bingo Hall", address: "600 E Trade St", city: "Charlotte", state: "North Carolina", zip: "28202", phone: "(704) 336-2241", hours: "Mon–Sat 7pm", lat: 35.2271, lng: -80.8431 },
  { name: "Raleigh Eagles Bingo", address: "222 W Hargett St", city: "Raleigh", state: "North Carolina", zip: "27601", phone: "(919) 996-3100", hours: "Tue, Thu, Sat 6pm", lat: 35.7796, lng: -78.6382 },
  { name: "Greensboro Bingo Palace", address: "300 W Washington St", city: "Greensboro", state: "North Carolina", zip: "27401", phone: "(336) 373-2000", hours: "Mon–Fri 6pm", lat: 36.0726, lng: -79.7920 },
  { name: "Durham Bingo Center", address: "101 City Hall Plaza", city: "Durham", state: "North Carolina", zip: "27701", phone: "(919) 560-4197", hours: "Wed & Sat 7pm", lat: 35.9940, lng: -78.8986 },
  { name: "Winston-Salem Bingo Night", address: "101 N Main St", city: "Winston-Salem", state: "North Carolina", zip: "27101", phone: "(336) 727-2000", hours: "Fri 6pm, Sat 2pm", lat: 36.0999, lng: -80.2442 },
  { name: "Fayetteville Bingo Hall", address: "433 Hay St", city: "Fayetteville", state: "North Carolina", zip: "28301", phone: "(910) 433-1023", hours: "Mon & Thu 7pm", lat: 35.0527, lng: -78.8784 },
  { name: "Cary Moose Lodge Bingo", address: "316 N Academy St", city: "Cary", state: "North Carolina", zip: "27513", phone: "(919) 469-4000", hours: "Tue & Sat 6pm", lat: 35.7915, lng: -78.7811 },
  { name: "Wilmington NC Bingo Hall", address: "102 N Third St", city: "Wilmington", state: "North Carolina", zip: "28401", phone: "(910) 341-7815", hours: "Wed & Sat 7pm", lat: 34.2257, lng: -77.9447 },
  { name: "High Point Bingo World", address: "211 S Hamilton St", city: "High Point", state: "North Carolina", zip: "27260", phone: "(336) 883-3111", hours: "Mon & Fri 6pm", lat: 35.9557, lng: -80.0053 },
  { name: "Asheville Elks Bingo", address: "70 Court Plaza", city: "Asheville", state: "North Carolina", zip: "28801", phone: "(828) 232-4500", hours: "Sat 2pm & 6pm", lat: 35.5951, lng: -82.5515 },

  // Virginia - more cities
  { name: "Virginia Beach VFW Bingo", address: "2401 Courthouse Dr", city: "Virginia Beach", state: "Virginia", zip: "23456", phone: "(757) 427-4111", hours: "Mon–Sat 6pm", lat: 36.8529, lng: -75.9780 },
  { name: "Arlington VA Bingo Hall", address: "2100 Clarendon Blvd", city: "Arlington", state: "Virginia", zip: "22201", phone: "(703) 228-3130", hours: "Tue, Thu, Sat 7pm", lat: 38.8816, lng: -77.0910 },
  { name: "Richmond Bingo Palace", address: "900 E Broad St", city: "Richmond", state: "Virginia", zip: "23219", phone: "(804) 646-7000", hours: "Mon–Fri 6pm", lat: 37.5407, lng: -77.4360 },
  { name: "Newport News Eagles Bingo", address: "2400 Washington Ave", city: "Newport News", state: "Virginia", zip: "23607", phone: "(757) 926-8420", hours: "Wed & Sat 7pm", lat: 37.0871, lng: -76.4730 },
  { name: "Hampton Bingo Center", address: "22 Lincoln St", city: "Hampton", state: "Virginia", zip: "23669", phone: "(757) 727-6337", hours: "Fri 6pm, Sat 2pm", lat: 37.0299, lng: -76.3452 },
  { name: "Alexandria VA Bingo Night", address: "301 King St", city: "Alexandria", state: "Virginia", zip: "22314", phone: "(703) 746-4000", hours: "Mon & Thu 7pm", lat: 38.8048, lng: -77.0469 },
  { name: "Portsmouth VA Bingo Hall", address: "801 Crawford St", city: "Portsmouth", state: "Virginia", zip: "23704", phone: "(757) 393-8000", hours: "Tue & Sat 6pm", lat: 36.8354, lng: -76.2983 },
  { name: "Roanoke Bingo World", address: "215 Church Ave SW", city: "Roanoke", state: "Virginia", zip: "24011", phone: "(540) 853-2000", hours: "Wed & Sat 7pm", lat: 37.2710, lng: -79.9414 },
  { name: "Chesapeake VA Eagles Bingo", address: "306 Cedar Rd", city: "Chesapeake", state: "Virginia", zip: "23322", phone: "(757) 382-6161", hours: "Mon & Fri 6pm", lat: 36.7682, lng: -76.2452 },
  { name: "Suffolk Moose Lodge Bingo", address: "441 Market St", city: "Suffolk", state: "Virginia", zip: "23434", phone: "(757) 514-4150", hours: "Sat 2pm & 6pm", lat: 36.7282, lng: -76.5836 },

  // Washington State - more cities
  { name: "Seattle VFW Bingo Hall", address: "600 4th Ave", city: "Seattle", state: "Washington", zip: "98104", phone: "(206) 684-0888", hours: "Mon–Sat 7pm", lat: 47.6062, lng: -122.3321 },
  { name: "Spokane Eagles Bingo", address: "808 W Spokane Falls Blvd", city: "Spokane", state: "Washington", zip: "99201", phone: "(509) 625-6010", hours: "Tue, Thu, Sat 6pm", lat: 47.6588, lng: -117.4260 },
  { name: "Tacoma Bingo Palace", address: "747 Market St", city: "Tacoma", state: "Washington", zip: "98402", phone: "(253) 591-5100", hours: "Mon–Fri 6pm", lat: 47.2529, lng: -122.4443 },
  { name: "Vancouver WA Bingo Hall", address: "415 W 6th St", city: "Vancouver", state: "Washington", zip: "98660", phone: "(360) 487-7800", hours: "Wed & Sat 7pm", lat: 45.6387, lng: -122.6615 },
  { name: "Renton Bingo Center", address: "1055 S Grady Way", city: "Renton", state: "Washington", zip: "98057", phone: "(425) 430-6500", hours: "Fri 6pm, Sat 2pm", lat: 47.4799, lng: -122.2021 },
  { name: "Kirkland Moose Lodge Bingo", address: "123 5th Ave", city: "Kirkland", state: "Washington", zip: "98033", phone: "(425) 587-3000", hours: "Tue & Sat 6pm", lat: 47.6815, lng: -122.2087 },
  { name: "Bellevue Bingo Night", address: "450 110th Ave NE", city: "Bellevue", state: "Washington", zip: "98004", phone: "(425) 452-6800", hours: "Mon & Thu 7pm", lat: 47.6101, lng: -122.2015 },
  { name: "Kent WA Bingo Hall", address: "220 4th Ave S", city: "Kent", state: "Washington", zip: "98032", phone: "(253) 856-5700", hours: "Wed & Sat 7pm", lat: 47.3809, lng: -122.2348 },
  { name: "Everett Eagles Bingo", address: "2930 Wetmore Ave", city: "Everett", state: "Washington", zip: "98201", phone: "(425) 257-8700", hours: "Mon–Fri 6pm", lat: 47.9790, lng: -122.2021 },
  { name: "Federal Way VFW Bingo", address: "33325 8th Ave S", city: "Federal Way", state: "Washington", zip: "98003", phone: "(253) 835-2501", hours: "Sat 2pm & 6pm", lat: 47.3223, lng: -122.3126 },

  // Tennessee - more cities
  { name: "Memphis VFW Bingo Hall", address: "125 N Main St", city: "Memphis", state: "Tennessee", zip: "38103", phone: "(901) 576-6000", hours: "Mon–Sat 7pm", lat: 35.1495, lng: -90.0490 },
  { name: "Nashville Eagles Bingo", address: "1 Public Square", city: "Nashville", state: "Tennessee", zip: "37201", phone: "(615) 862-5000", hours: "Tue, Thu, Sat 6pm", lat: 36.1627, lng: -86.7816 },
  { name: "Knoxville Bingo Palace", address: "400 Main St", city: "Knoxville", state: "Tennessee", zip: "37902", phone: "(865) 215-2000", hours: "Mon–Fri 6pm", lat: 35.9606, lng: -83.9207 },
  { name: "Chattanooga Bingo Center", address: "101 E 11th St", city: "Chattanooga", state: "Tennessee", zip: "37402", phone: "(423) 757-5152", hours: "Wed & Sat 7pm", lat: 35.0456, lng: -85.3097 },
  { name: "Clarksville TN Bingo Night", address: "1 Public Square", city: "Clarksville", state: "Tennessee", zip: "37040", phone: "(931) 645-7444", hours: "Fri 6pm, Sat 2pm", lat: 36.5298, lng: -87.3595 },
  { name: "Murfreesboro Bingo Hall", address: "111 W Vine St", city: "Murfreesboro", state: "Tennessee", zip: "37130", phone: "(615) 893-5210", hours: "Mon & Thu 7pm", lat: 35.8456, lng: -86.3903 },
  { name: "Jackson TN Bingo World", address: "107 E Lafayette St", city: "Jackson", state: "Tennessee", zip: "38301", phone: "(731) 425-8200", hours: "Tue & Sat 6pm", lat: 35.6145, lng: -88.8139 },
  { name: "Franklin TN Eagles Bingo", address: "109 3rd Ave S", city: "Franklin", state: "Tennessee", zip: "37064", phone: "(615) 791-3217", hours: "Wed & Sat 7pm", lat: 35.9251, lng: -86.8689 },
  { name: "Johnson City Moose Bingo", address: "601 E Main St", city: "Johnson City", state: "Tennessee", zip: "37601", phone: "(423) 434-6000", hours: "Mon & Fri 6pm", lat: 36.3134, lng: -82.3535 },
  { name: "Bartlett TN Bingo Hall", address: "6400 Stage Rd", city: "Bartlett", state: "Tennessee", zip: "38134", phone: "(901) 385-6400", hours: "Sat 2pm & 6pm", lat: 35.2045, lng: -89.8745 },

  // Indiana - more cities
  { name: "Indianapolis VFW Bingo", address: "200 E Washington St", city: "Indianapolis", state: "Indiana", zip: "46204", phone: "(317) 327-4622", hours: "Mon–Sat 7pm", lat: 39.7684, lng: -86.1581 },
  { name: "Fort Wayne Eagles Bingo", address: "1 Main St", city: "Fort Wayne", state: "Indiana", zip: "46802", phone: "(260) 427-1127", hours: "Tue, Thu, Sat 6pm", lat: 41.1306, lng: -85.1289 },
  { name: "Evansville Bingo Palace", address: "1 NW Martin Luther King Jr Blvd", city: "Evansville", state: "Indiana", zip: "47708", phone: "(812) 436-7700", hours: "Mon–Fri 6pm", lat: 37.9716, lng: -87.5711 },
  { name: "South Bend Bingo Center", address: "227 W Jefferson Blvd", city: "South Bend", state: "Indiana", zip: "46601", phone: "(574) 235-9261", hours: "Wed & Sat 7pm", lat: 41.6764, lng: -86.2520 },
  { name: "Carmel IN Bingo Night", address: "1 Civic Square", city: "Carmel", state: "Indiana", zip: "46032", phone: "(317) 571-2400", hours: "Fri 6pm, Sat 2pm", lat: 39.9784, lng: -86.1180 },
  { name: "Fishers Moose Lodge Bingo", address: "1 Municipal Dr", city: "Fishers", state: "Indiana", zip: "46038", phone: "(317) 595-3150", hours: "Mon & Thu 7pm", lat: 39.9567, lng: -85.9669 },
  { name: "Hammond Bingo Hall", address: "5925 Calumet Ave", city: "Hammond", state: "Indiana", zip: "46320", phone: "(219) 853-6301", hours: "Tue & Sat 6pm", lat: 41.5834, lng: -87.5000 },
  { name: "Gary IN Bingo World", address: "401 Broadway", city: "Gary", state: "Indiana", zip: "46402", phone: "(219) 881-1510", hours: "Wed & Sat 7pm", lat: 41.5934, lng: -87.3465 },
  { name: "Muncie Eagles Bingo", address: "300 N High St", city: "Muncie", state: "Indiana", zip: "47305", phone: "(765) 747-4826", hours: "Mon & Fri 6pm", lat: 40.1934, lng: -85.3863 },
  { name: "Terre Haute VFW Bingo", address: "17 Harding Ave", city: "Terre Haute", state: "Indiana", zip: "47807", phone: "(812) 232-0018", hours: "Sat 2pm & 6pm", lat: 39.4667, lng: -87.4139 },

  // Missouri - more cities
  { name: "Kansas City VFW Bingo", address: "414 E 12th St", city: "Kansas City", state: "Missouri", zip: "64106", phone: "(816) 513-3500", hours: "Mon–Sat 7pm", lat: 39.1005, lng: -94.5786 },
  { name: "St Louis Eagles Bingo", address: "1200 Market St", city: "St. Louis", state: "Missouri", zip: "63103", phone: "(314) 622-4000", hours: "Tue, Thu, Sat 6pm", lat: 38.6270, lng: -90.1994 },
  { name: "Springfield MO Bingo Hall", address: "840 Boonville Ave", city: "Springfield", state: "Missouri", zip: "65802", phone: "(417) 864-1000", hours: "Mon–Fri 6pm", lat: 37.2090, lng: -93.2923 },
  { name: "Columbia MO Bingo Palace", address: "701 E Broadway", city: "Columbia", state: "Missouri", zip: "65201", phone: "(573) 874-7460", hours: "Wed & Sat 7pm", lat: 38.9517, lng: -92.3341 },
  { name: "Independence MO Bingo", address: "111 E Maple Ave", city: "Independence", state: "Missouri", zip: "64050", phone: "(816) 325-7000", hours: "Fri 6pm, Sat 2pm", lat: 39.0911, lng: -94.4155 },
  { name: "Lee's Summit Bingo Night", address: "220 SE Green St", city: "Lee's Summit", state: "Missouri", zip: "64063", phone: "(816) 969-7700", hours: "Mon & Thu 7pm", lat: 38.9108, lng: -94.3821 },
  { name: "O'Fallon MO Bingo Center", address: "100 N Main St", city: "O'Fallon", state: "Missouri", zip: "63366", phone: "(636) 379-5400", hours: "Tue & Sat 6pm", lat: 38.8109, lng: -90.6998 },
  { name: "St Joseph MO Bingo", address: "1100 Frederick Ave", city: "St. Joseph", state: "Missouri", zip: "64501", phone: "(816) 271-4600", hours: "Wed & Sat 7pm", lat: 39.7675, lng: -94.8467 },
  { name: "Joplin Moose Lodge Bingo", address: "602 S Main St", city: "Joplin", state: "Missouri", zip: "64801", phone: "(417) 625-4325", hours: "Mon & Fri 6pm", lat: 37.0842, lng: -94.5133 },
  { name: "Florissant MO Bingo Hall", address: "955 Rue St Francois", city: "Florissant", state: "Missouri", zip: "63031", phone: "(314) 921-5700", hours: "Sat 2pm & 6pm", lat: 38.7892, lng: -90.3224 },

  // Colorado - more cities
  { name: "Denver VFW Bingo Hall", address: "1437 Bannock St", city: "Denver", state: "Colorado", zip: "80202", phone: "(720) 913-3000", hours: "Mon–Sat 7pm", lat: 39.7392, lng: -104.9903 },
  { name: "Colorado Springs Eagles Bingo", address: "107 N Nevada Ave", city: "Colorado Springs", state: "Colorado", zip: "80903", phone: "(719) 385-5961", hours: "Tue, Thu, Sat 6pm", lat: 38.8339, lng: -104.8214 },
  { name: "Aurora CO Bingo Palace", address: "15151 E Alameda Pkwy", city: "Aurora", state: "Colorado", zip: "80012", phone: "(303) 739-7000", hours: "Mon–Fri 6pm", lat: 39.7294, lng: -104.8319 },
  { name: "Fort Collins Bingo Center", address: "300 LaPorte Ave", city: "Fort Collins", state: "Colorado", zip: "80521", phone: "(970) 221-6830", hours: "Wed & Sat 7pm", lat: 40.5853, lng: -105.0844 },
  { name: "Lakewood CO Bingo Night", address: "480 S Allison Pkwy", city: "Lakewood", state: "Colorado", zip: "80226", phone: "(303) 987-7000", hours: "Fri 6pm, Sat 2pm", lat: 39.7047, lng: -105.0814 },
  { name: "Thornton Bingo Hall", address: "9500 Civic Center Dr", city: "Thornton", state: "Colorado", zip: "80229", phone: "(303) 538-7295", hours: "Mon & Thu 7pm", lat: 39.8680, lng: -104.9719 },
  { name: "Arvada Moose Bingo", address: "8101 Ralston Rd", city: "Arvada", state: "Colorado", zip: "80002", phone: "(720) 898-7000", hours: "Tue & Sat 6pm", lat: 39.8028, lng: -105.0875 },
  { name: "Westminster CO Bingo", address: "4800 W 92nd Ave", city: "Westminster", state: "Colorado", zip: "80031", phone: "(303) 658-2400", hours: "Wed & Sat 7pm", lat: 39.8366, lng: -105.0372 },
  { name: "Pueblo Elks Bingo", address: "1 City Hall Pl", city: "Pueblo", state: "Colorado", zip: "81003", phone: "(719) 553-2655", hours: "Mon & Fri 6pm", lat: 38.2544, lng: -104.6091 },
  { name: "Centennial CO Bingo Hall", address: "13133 E Arapahoe Rd", city: "Centennial", state: "Colorado", zip: "80112", phone: "(303) 325-8000", hours: "Sat 2pm & 6pm", lat: 39.5807, lng: -104.8772 },

  // Minnesota - more cities
  { name: "Minneapolis VFW Bingo Hall", address: "350 S 5th St", city: "Minneapolis", state: "Minnesota", zip: "55415", phone: "(612) 673-2489", hours: "Mon–Sat 7pm", lat: 44.9778, lng: -93.2650 },
  { name: "St Paul Eagles Bingo", address: "15 W Kellogg Blvd", city: "St. Paul", state: "Minnesota", zip: "55102", phone: "(651) 266-8989", hours: "Tue, Thu, Sat 6pm", lat: 44.9443, lng: -93.0935 },
  { name: "Rochester MN Bingo Palace", address: "201 4th St SE", city: "Rochester", state: "Minnesota", zip: "55904", phone: "(507) 328-2900", hours: "Mon–Fri 6pm", lat: 44.0121, lng: -92.4802 },
  { name: "Bloomington MN Bingo", address: "1800 W Old Shakopee Rd", city: "Bloomington", state: "Minnesota", zip: "55431", phone: "(952) 563-8700", hours: "Wed & Sat 7pm", lat: 44.8408, lng: -93.3772 },
  { name: "Duluth Bingo Center", address: "411 W 2nd St", city: "Duluth", state: "Minnesota", zip: "55802", phone: "(218) 730-5000", hours: "Fri 6pm, Sat 2pm", lat: 46.7867, lng: -92.1005 },
  { name: "Brooklyn Park Bingo Night", address: "5200 85th Ave N", city: "Brooklyn Park", state: "Minnesota", zip: "55443", phone: "(763) 493-8000", hours: "Mon & Thu 7pm", lat: 45.0941, lng: -93.3636 },
  { name: "Plymouth MN Bingo Hall", address: "3400 Plymouth Blvd", city: "Plymouth", state: "Minnesota", zip: "55447", phone: "(763) 509-5000", hours: "Tue & Sat 6pm", lat: 45.0105, lng: -93.4555 },
  { name: "Maple Grove Bingo World", address: "12800 Arbor Lakes Pkwy", city: "Maple Grove", state: "Minnesota", zip: "55369", phone: "(763) 494-6400", hours: "Wed & Sat 7pm", lat: 45.0724, lng: -93.4558 },
  { name: "Eden Prairie Moose Bingo", address: "8080 Mitchell Rd", city: "Eden Prairie", state: "Minnesota", zip: "55344", phone: "(952) 949-8300", hours: "Mon & Fri 6pm", lat: 44.8547, lng: -93.4708 },
  { name: "Coon Rapids Bingo Hall", address: "11155 Robinson Dr NW", city: "Coon Rapids", state: "Minnesota", zip: "55433", phone: "(763) 767-6400", hours: "Sat 2pm & 6pm", lat: 45.1233, lng: -93.3105 },

  // Maryland - more cities
  { name: "Baltimore VFW Bingo Hall", address: "100 N Holliday St", city: "Baltimore", state: "Maryland", zip: "21202", phone: "(410) 396-3100", hours: "Mon–Sat 7pm", lat: 39.2904, lng: -76.6122 },
  { name: "Columbia MD Bingo Palace", address: "6151 Guardian Gateway", city: "Columbia", state: "Maryland", zip: "21044", phone: "(410) 313-6400", hours: "Tue, Thu, Sat 6pm", lat: 39.2037, lng: -76.8610 },
  { name: "Germantown MD Bingo", address: "1 Father Hurley Blvd", city: "Germantown", state: "Maryland", zip: "20874", phone: "(240) 777-8000", hours: "Mon–Fri 6pm", lat: 39.1732, lng: -77.2717 },
  { name: "Silver Spring Eagles Bingo", address: "1 Veterans Pl", city: "Silver Spring", state: "Maryland", zip: "20910", phone: "(301) 587-1220", hours: "Wed & Sat 7pm", lat: 38.9907, lng: -77.0261 },
  { name: "Frederick MD Bingo Night", address: "101 N Court St", city: "Frederick", state: "Maryland", zip: "21701", phone: "(301) 600-1380", hours: "Fri 6pm, Sat 2pm", lat: 39.4143, lng: -77.4105 },
  { name: "Rockville MD Bingo Hall", address: "111 Maryland Ave", city: "Rockville", state: "Maryland", zip: "20850", phone: "(240) 314-5000", hours: "Mon & Thu 7pm", lat: 39.0840, lng: -77.1528 },
  { name: "Gaithersburg Bingo Center", address: "31 S Summit Ave", city: "Gaithersburg", state: "Maryland", zip: "20877", phone: "(301) 258-6310", hours: "Tue & Sat 6pm", lat: 39.1434, lng: -77.2014 },
  { name: "Annapolis Moose Bingo", address: "160 Duke of Gloucester St", city: "Annapolis", state: "Maryland", zip: "21401", phone: "(410) 263-7942", hours: "Wed & Sat 7pm", lat: 38.9784, lng: -76.4922 },
  { name: "Bowie MD Bingo Hall", address: "15901 Fred Shuttlesworth Dr", city: "Bowie", state: "Maryland", zip: "20716", phone: "(301) 262-6200", hours: "Mon & Fri 6pm", lat: 38.9523, lng: -76.7291 },
  { name: "Hagerstown Elks Bingo", address: "1 S Potomac St", city: "Hagerstown", state: "Maryland", zip: "21740", phone: "(301) 739-8577", hours: "Sat 2pm & 6pm", lat: 39.6418, lng: -77.7199 },

  // New Jersey - more cities
  { name: "Newark NJ VFW Bingo Hall", address: "920 Broad St", city: "Newark", state: "New Jersey", zip: "07102", phone: "(973) 733-6400", hours: "Mon–Sat 7pm", lat: 40.7357, lng: -74.1724 },
  { name: "Jersey City Eagles Bingo", address: "280 Grove St", city: "Jersey City", state: "New Jersey", zip: "07302", phone: "(201) 547-5555", hours: "Tue, Thu, Sat 6pm", lat: 40.7178, lng: -74.0431 },
  { name: "Paterson NJ Bingo Palace", address: "155 Market St", city: "Paterson", state: "New Jersey", zip: "07505", phone: "(973) 321-1334", hours: "Mon–Fri 6pm", lat: 40.9168, lng: -74.1718 },
  { name: "Elizabeth NJ Bingo Center", address: "50 Winfield Scott Plaza", city: "Elizabeth", state: "New Jersey", zip: "07201", phone: "(908) 820-4000", hours: "Wed & Sat 7pm", lat: 40.6640, lng: -74.2107 },
  { name: "Lakewood NJ Bingo Night", address: "231 3rd St", city: "Lakewood", state: "New Jersey", zip: "08701", phone: "(732) 364-2500", hours: "Fri 6pm, Sat 2pm", lat: 40.0979, lng: -74.2179 },
  { name: "Edison NJ Bingo Hall", address: "100 Municipal Blvd", city: "Edison", state: "New Jersey", zip: "08817", phone: "(732) 287-0900", hours: "Mon & Thu 7pm", lat: 40.5187, lng: -74.4121 },
  { name: "Woodbridge Moose Bingo", address: "1 Main St", city: "Woodbridge", state: "New Jersey", zip: "07095", phone: "(732) 634-4500", hours: "Tue & Sat 6pm", lat: 40.5579, lng: -74.2849 },
  { name: "Toms River Bingo World", address: "33 Washington St", city: "Toms River", state: "New Jersey", zip: "08753", phone: "(732) 341-1000", hours: "Wed & Sat 7pm", lat: 39.9534, lng: -74.1979 },
  { name: "Trenton NJ Bingo Hall", address: "319 E State St", city: "Trenton", state: "New Jersey", zip: "08608", phone: "(609) 989-3000", hours: "Mon & Fri 6pm", lat: 40.2171, lng: -74.7429 },
  { name: "Camden NJ Eagles Bingo", address: "520 Market St", city: "Camden", state: "New Jersey", zip: "08102", phone: "(856) 757-7100", hours: "Sat 2pm & 6pm", lat: 39.9259, lng: -75.1196 },

  // Massachusetts - more cities
  { name: "Boston VFW Bingo Hall", address: "1 City Hall Sq", city: "Boston", state: "Massachusetts", zip: "02201", phone: "(617) 635-4500", hours: "Mon–Sat 7pm", lat: 42.3601, lng: -71.0589 },
  { name: "Worcester Eagles Bingo", address: "455 Main St", city: "Worcester", state: "Massachusetts", zip: "01608", phone: "(508) 799-1000", hours: "Tue, Thu, Sat 6pm", lat: 42.2626, lng: -71.8023 },
  { name: "Springfield MA Bingo Palace", address: "36 Court St", city: "Springfield", state: "Massachusetts", zip: "01103", phone: "(413) 787-6000", hours: "Mon–Fri 6pm", lat: 42.1015, lng: -72.5898 },
  { name: "Cambridge Bingo Center", address: "795 Massachusetts Ave", city: "Cambridge", state: "Massachusetts", zip: "02139", phone: "(617) 349-4000", hours: "Wed & Sat 7pm", lat: 42.3736, lng: -71.1097 },
  { name: "Lowell MA Bingo Night", address: "375 Merrimack St", city: "Lowell", state: "Massachusetts", zip: "01852", phone: "(978) 970-4000", hours: "Fri 6pm, Sat 2pm", lat: 42.6334, lng: -71.3162 },
  { name: "New Bedford Bingo Hall", address: "133 William St", city: "New Bedford", state: "Massachusetts", zip: "02740", phone: "(508) 991-6161", hours: "Mon & Thu 7pm", lat: 41.6362, lng: -70.9342 },
  { name: "Brockton Moose Bingo", address: "45 School St", city: "Brockton", state: "Massachusetts", zip: "02301", phone: "(508) 580-7123", hours: "Tue & Sat 6pm", lat: 42.0834, lng: -71.0184 },
  { name: "Quincy MA Bingo World", address: "1305 Hancock St", city: "Quincy", state: "Massachusetts", zip: "02169", phone: "(617) 376-1000", hours: "Wed & Sat 7pm", lat: 42.2529, lng: -71.0023 },
  { name: "Lynn MA Bingo Hall", address: "3 City Hall Square", city: "Lynn", state: "Massachusetts", zip: "01901", phone: "(781) 598-4000", hours: "Mon & Fri 6pm", lat: 42.4668, lng: -70.9495 },
  { name: "Fall River Elks Bingo", address: "1 Government Center", city: "Fall River", state: "Massachusetts", zip: "02720", phone: "(508) 324-2600", hours: "Sat 2pm & 6pm", lat: 41.7015, lng: -71.1550 },

  // Wisconsin - more cities
  { name: "Madison VFW Bingo Hall", address: "210 Martin Luther King Jr Blvd", city: "Madison", state: "Wisconsin", zip: "53703", phone: "(608) 266-4611", hours: "Mon–Sat 7pm", lat: 43.0731, lng: -89.4012 },
  { name: "Green Bay Eagles Bingo", address: "100 N Jefferson St", city: "Green Bay", state: "Wisconsin", zip: "54301", phone: "(920) 448-3200", hours: "Tue, Thu, Sat 6pm", lat: 44.5133, lng: -88.0133 },
  { name: "Kenosha Bingo Palace", address: "625 52nd St", city: "Kenosha", state: "Wisconsin", zip: "53140", phone: "(262) 653-4000", hours: "Mon–Fri 6pm", lat: 42.5847, lng: -87.8212 },
  { name: "Racine Bingo Center", address: "730 Washington Ave", city: "Racine", state: "Wisconsin", zip: "53403", phone: "(262) 636-9101", hours: "Wed & Sat 7pm", lat: 42.7261, lng: -87.7829 },
  { name: "Appleton Bingo Night", address: "100 N Appleton St", city: "Appleton", state: "Wisconsin", zip: "54911", phone: "(920) 832-5905", hours: "Fri 6pm, Sat 2pm", lat: 44.2619, lng: -88.4154 },
  { name: "Waukesha Moose Bingo", address: "201 Delafield St", city: "Waukesha", state: "Wisconsin", zip: "53188", phone: "(262) 524-3500", hours: "Mon & Thu 7pm", lat: 43.0117, lng: -88.2315 },
  { name: "Oshkosh Bingo Hall", address: "215 Church Ave", city: "Oshkosh", state: "Wisconsin", zip: "54901", phone: "(920) 236-5000", hours: "Tue & Sat 6pm", lat: 44.0247, lng: -88.5426 },
  { name: "Eau Claire Bingo World", address: "203 S Farwell St", city: "Eau Claire", state: "Wisconsin", zip: "54701", phone: "(715) 839-5046", hours: "Wed & Sat 7pm", lat: 44.8113, lng: -91.4985 },
  { name: "Janesville Elks Bingo", address: "18 N Jackson St", city: "Janesville", state: "Wisconsin", zip: "53545", phone: "(608) 755-3000", hours: "Mon & Fri 6pm", lat: 42.6828, lng: -89.0187 },
  { name: "La Crosse VFW Bingo", address: "400 La Crosse St", city: "La Crosse", state: "Wisconsin", zip: "54601", phone: "(608) 789-7500", hours: "Sat 2pm & 6pm", lat: 43.8014, lng: -91.2396 },

  // Oregon - more cities
  { name: "Portland VFW Bingo Hall", address: "1221 SW 4th Ave", city: "Portland", state: "Oregon", zip: "97204", phone: "(503) 823-4000", hours: "Mon–Sat 7pm", lat: 45.5051, lng: -122.6750 },
  { name: "Eugene Eagles Bingo", address: "125 E 8th Ave", city: "Eugene", state: "Oregon", zip: "97401", phone: "(541) 682-4203", hours: "Tue, Thu, Sat 6pm", lat: 44.0521, lng: -123.0868 },
  { name: "Salem OR Bingo Palace", address: "555 Liberty St SE", city: "Salem", state: "Oregon", zip: "97301", phone: "(503) 588-6002", hours: "Mon–Fri 6pm", lat: 44.9429, lng: -123.0351 },
  { name: "Gresham Bingo Center", address: "1333 NW Eastman Pkwy", city: "Gresham", state: "Oregon", zip: "97030", phone: "(503) 618-2700", hours: "Wed & Sat 7pm", lat: 45.5001, lng: -122.4302 },
  { name: "Hillsboro OR Bingo Night", address: "150 E Main St", city: "Hillsboro", state: "Oregon", zip: "97123", phone: "(503) 615-3404", hours: "Fri 6pm, Sat 2pm", lat: 45.5229, lng: -122.9898 },
  { name: "Beaverton Moose Bingo", address: "4755 SW Griffith Dr", city: "Beaverton", state: "Oregon", zip: "97005", phone: "(503) 526-2222", hours: "Mon & Thu 7pm", lat: 45.4871, lng: -122.8037 },
  { name: "Medford OR Bingo Hall", address: "411 W 8th St", city: "Medford", state: "Oregon", zip: "97501", phone: "(541) 774-2000", hours: "Tue & Sat 6pm", lat: 42.3265, lng: -122.8756 },
  { name: "Bend Elks Bingo", address: "710 NW Wall St", city: "Bend", state: "Oregon", zip: "97701", phone: "(541) 388-5505", hours: "Wed & Sat 7pm", lat: 44.0582, lng: -121.3153 },
  { name: "Springfield OR Bingo World", address: "225 5th St", city: "Springfield", state: "Oregon", zip: "97477", phone: "(541) 726-3700", hours: "Mon & Fri 6pm", lat: 44.0462, lng: -122.9971 },
  { name: "Corvallis VFW Bingo", address: "501 SW Madison Ave", city: "Corvallis", state: "Oregon", zip: "97333", phone: "(541) 766-6945", hours: "Sat 2pm & 6pm", lat: 44.5646, lng: -123.2620 },

  // Nevada - more cities
  { name: "Las Vegas VFW Bingo Hall", address: "495 S Main St", city: "Las Vegas", state: "Nevada", zip: "89101", phone: "(702) 229-6011", hours: "Mon–Sat 7pm", lat: 36.1699, lng: -115.1398 },
  { name: "Henderson NV Eagles Bingo", address: "240 S Water St", city: "Henderson", state: "Nevada", zip: "89015", phone: "(702) 565-2040", hours: "Tue, Thu, Sat 6pm", lat: 36.0395, lng: -114.9817 },
  { name: "Reno Bingo Palace", address: "1 E 1st St", city: "Reno", state: "Nevada", zip: "89501", phone: "(775) 334-2255", hours: "Mon–Fri 6pm", lat: 39.5296, lng: -119.8138 },
  { name: "North Las Vegas Bingo", address: "2250 Las Vegas Blvd N", city: "North Las Vegas", state: "Nevada", zip: "89030", phone: "(702) 633-1705", hours: "Wed & Sat 7pm", lat: 36.1989, lng: -115.1175 },
  { name: "Sparks NV Bingo Night", address: "431 Prater Way", city: "Sparks", state: "Nevada", zip: "89431", phone: "(775) 353-2291", hours: "Fri 6pm, Sat 2pm", lat: 39.5349, lng: -119.7527 },
  { name: "Carson City Bingo Hall", address: "201 N Carson St", city: "Carson City", state: "Nevada", zip: "89701", phone: "(775) 887-2100", hours: "Mon & Thu 7pm", lat: 39.1638, lng: -119.7674 },
  { name: "Elko NV Bingo World", address: "1751 College Ave", city: "Elko", state: "Nevada", zip: "89801", phone: "(775) 738-2020", hours: "Tue & Sat 6pm", lat: 40.8324, lng: -115.7631 },
  { name: "Boulder City Eagles Bingo", address: "401 California Ave", city: "Boulder City", state: "Nevada", zip: "89005", phone: "(702) 293-9208", hours: "Wed & Sat 7pm", lat: 35.9788, lng: -114.8328 },
  { name: "Mesquite NV Bingo Hall", address: "10 E Mesquite Blvd", city: "Mesquite", state: "Nevada", zip: "89027", phone: "(702) 346-2670", hours: "Mon & Fri 6pm", lat: 36.8060, lng: -114.0672 },
  { name: "Fernley Moose Bingo", address: "595 Silver Lace Blvd", city: "Fernley", state: "Nevada", zip: "89408", phone: "(775) 784-0400", hours: "Sat 2pm & 6pm", lat: 39.6082, lng: -119.2527 },

  // South Carolina - more cities
  { name: "Columbia SC VFW Bingo", address: "1737 Main St", city: "Columbia", state: "South Carolina", zip: "29201", phone: "(803) 545-3000", hours: "Mon–Sat 7pm", lat: 34.0007, lng: -81.0348 },
  { name: "Charleston SC Eagles Bingo", address: "80 Broad St", city: "Charleston", state: "South Carolina", zip: "29401", phone: "(843) 577-6970", hours: "Tue, Thu, Sat 6pm", lat: 32.7765, lng: -79.9311 },
  { name: "North Charleston Bingo Hall", address: "2500 City Hall Ln", city: "North Charleston", state: "South Carolina", zip: "29406", phone: "(843) 740-2500", hours: "Mon–Fri 6pm", lat: 32.8546, lng: -79.9748 },
  { name: "Mount Pleasant Bingo", address: "100 Ann Edwards Ln", city: "Mount Pleasant", state: "South Carolina", zip: "29464", phone: "(843) 884-8517", hours: "Wed & Sat 7pm", lat: 32.8323, lng: -79.8284 },
  { name: "Rock Hill SC Bingo Night", address: "155 Johnston St", city: "Rock Hill", state: "South Carolina", zip: "29730", phone: "(803) 329-5514", hours: "Fri 6pm, Sat 2pm", lat: 34.9249, lng: -81.0251 },
  { name: "Greenville SC Bingo Hall", address: "206 S Main St", city: "Greenville", state: "South Carolina", zip: "29601", phone: "(864) 467-4710", hours: "Mon & Thu 7pm", lat: 34.8526, lng: -82.3940 },
  { name: "Summerville Bingo World", address: "200 S Main St", city: "Summerville", state: "South Carolina", zip: "29483", phone: "(843) 851-4040", hours: "Tue & Sat 6pm", lat: 33.0185, lng: -80.1756 },
  { name: "Hilton Head Bingo Palace", address: "1 Town Center Ct", city: "Hilton Head Island", state: "South Carolina", zip: "29928", phone: "(843) 341-4750", hours: "Wed & Sat 7pm", lat: 32.2163, lng: -80.7526 },
  { name: "Spartanburg Elks Bingo", address: "145 W Broad St", city: "Spartanburg", state: "South Carolina", zip: "29306", phone: "(864) 596-2000", hours: "Mon & Fri 6pm", lat: 34.9496, lng: -81.9321 },
  { name: "Florence SC Bingo Hall", address: "324 W Evans St", city: "Florence", state: "South Carolina", zip: "29501", phone: "(843) 665-3252", hours: "Sat 2pm & 6pm", lat: 34.1954, lng: -79.7626 },

  // Kentucky - more cities
  { name: "Louisville VFW Bingo Hall", address: "527 W Jefferson St", city: "Louisville", state: "Kentucky", zip: "40202", phone: "(502) 574-5660", hours: "Mon–Sat 7pm", lat: 38.2527, lng: -85.7585 },
  { name: "Lexington Eagles Bingo", address: "200 E Main St", city: "Lexington", state: "Kentucky", zip: "40507", phone: "(859) 258-3000", hours: "Tue, Thu, Sat 6pm", lat: 38.0406, lng: -84.5037 },
  { name: "Bowling Green Bingo", address: "1001 College St", city: "Bowling Green", state: "Kentucky", zip: "42101", phone: "(270) 393-3000", hours: "Mon–Fri 6pm", lat: 36.9903, lng: -86.4436 },
  { name: "Owensboro Bingo Center", address: "101 E 4th St", city: "Owensboro", state: "Kentucky", zip: "42303", phone: "(270) 687-8500", hours: "Wed & Sat 7pm", lat: 37.7719, lng: -87.1111 },
  { name: "Covington KY Bingo Night", address: "20 W Pike St", city: "Covington", state: "Kentucky", zip: "41011", phone: "(859) 292-2133", hours: "Fri 6pm, Sat 2pm", lat: 39.0837, lng: -84.5086 },
  { name: "Richmond KY Bingo Hall", address: "239 W Main St", city: "Richmond", state: "Kentucky", zip: "40475", phone: "(859) 623-1000", hours: "Mon & Thu 7pm", lat: 37.7479, lng: -84.2947 },
  { name: "Florence KY Bingo Palace", address: "8100 Ewing Blvd", city: "Florence", state: "Kentucky", zip: "41042", phone: "(859) 647-5420", hours: "Tue & Sat 6pm", lat: 38.9989, lng: -84.6277 },
  { name: "Georgetown KY Bingo", address: "100 N Broadway", city: "Georgetown", state: "Kentucky", zip: "40324", phone: "(502) 863-9800", hours: "Wed & Sat 7pm", lat: 38.2098, lng: -84.5588 },
  { name: "Henderson KY Eagles Bingo", address: "222 First St", city: "Henderson", state: "Kentucky", zip: "42420", phone: "(270) 831-1200", hours: "Mon & Fri 6pm", lat: 37.8362, lng: -87.5900 },
  { name: "Hopkinsville Bingo World", address: "1201 E 9th St", city: "Hopkinsville", state: "Kentucky", zip: "42240", phone: "(270) 890-0200", hours: "Sat 2pm & 6pm", lat: 36.8659, lng: -87.4886 },

  // Iowa - more cities
  { name: "Des Moines VFW Bingo Hall", address: "400 Robert D Ray Dr", city: "Des Moines", state: "Iowa", zip: "50309", phone: "(515) 283-4944", hours: "Mon–Sat 7pm", lat: 41.5868, lng: -93.6250 },
  { name: "Cedar Rapids Eagles Bingo", address: "101 1st St SE", city: "Cedar Rapids", state: "Iowa", zip: "52401", phone: "(319) 286-5080", hours: "Tue, Thu, Sat 6pm", lat: 41.9779, lng: -91.6656 },
  { name: "Davenport Bingo Palace", address: "226 W 4th St", city: "Davenport", state: "Iowa", zip: "52801", phone: "(563) 326-7700", hours: "Mon–Fri 6pm", lat: 41.5236, lng: -90.5776 },
  { name: "Sioux City Bingo Center", address: "405 6th St", city: "Sioux City", state: "Iowa", zip: "51101", phone: "(712) 279-6168", hours: "Wed & Sat 7pm", lat: 42.4999, lng: -96.4003 },
  { name: "Iowa City Bingo Night", address: "410 E Washington St", city: "Iowa City", state: "Iowa", zip: "52240", phone: "(319) 356-5000", hours: "Fri 6pm, Sat 2pm", lat: 41.6611, lng: -91.5302 },
  { name: "Waterloo IA Bingo Hall", address: "715 Mulberry St", city: "Waterloo", state: "Iowa", zip: "50703", phone: "(319) 291-4321", hours: "Mon & Thu 7pm", lat: 42.4928, lng: -92.3426 },
  { name: "Cedar Falls Bingo World", address: "220 Clay St", city: "Cedar Falls", state: "Iowa", zip: "50613", phone: "(319) 268-5101", hours: "Tue & Sat 6pm", lat: 42.5349, lng: -92.4453 },
  { name: "Ames Moose Bingo", address: "515 Clark Ave", city: "Ames", state: "Iowa", zip: "50010", phone: "(515) 239-5100", hours: "Wed & Sat 7pm", lat: 42.0308, lng: -93.6319 },
  { name: "Dubuque Eagles Bingo", address: "350 W 6th St", city: "Dubuque", state: "Iowa", zip: "52001", phone: "(563) 589-4100", hours: "Mon & Fri 6pm", lat: 42.5006, lng: -90.6646 },
  { name: "Council Bluffs VFW Bingo", address: "209 Pearl St", city: "Council Bluffs", state: "Iowa", zip: "51503", phone: "(712) 328-4627", hours: "Sat 2pm & 6pm", lat: 41.2619, lng: -95.8608 },

  // Kansas - more cities
  { name: "Wichita VFW Bingo Hall", address: "455 N Main St", city: "Wichita", state: "Kansas", zip: "67202", phone: "(316) 268-4331", hours: "Mon–Sat 7pm", lat: 37.6872, lng: -97.3301 },
  { name: "Overland Park Eagles Bingo", address: "8500 Santa Fe Dr", city: "Overland Park", state: "Kansas", zip: "66212", phone: "(913) 895-6000", hours: "Tue, Thu, Sat 6pm", lat: 38.9822, lng: -94.6708 },
  { name: "Kansas City KS Bingo", address: "701 N 7th St Trfy", city: "Kansas City", state: "Kansas", zip: "66101", phone: "(913) 573-5000", hours: "Mon–Fri 6pm", lat: 39.1147, lng: -94.6277 },
  { name: "Topeka Bingo Palace", address: "215 SE 7th St", city: "Topeka", state: "Kansas", zip: "66603", phone: "(785) 368-3940", hours: "Wed & Sat 7pm", lat: 39.0558, lng: -95.6890 },
  { name: "Olathe Bingo Center", address: "100 E Santa Fe St", city: "Olathe", state: "Kansas", zip: "66061", phone: "(913) 971-8500", hours: "Fri 6pm, Sat 2pm", lat: 38.8814, lng: -94.8191 },
  { name: "Lawrence KS Bingo Night", address: "6 E 6th St", city: "Lawrence", state: "Kansas", zip: "66044", phone: "(785) 832-3000", hours: "Mon & Thu 7pm", lat: 38.9717, lng: -95.2353 },
  { name: "Shawnee KS Bingo Hall", address: "11110 Johnson Dr", city: "Shawnee", state: "Kansas", zip: "66203", phone: "(913) 631-2500", hours: "Tue & Sat 6pm", lat: 39.0228, lng: -94.7155 },
  { name: "Manhattan KS Elks Bingo", address: "1101 Poyntz Ave", city: "Manhattan", state: "Kansas", zip: "66502", phone: "(785) 587-2400", hours: "Wed & Sat 7pm", lat: 39.1836, lng: -96.5717 },
  { name: "Salina KS Bingo World", address: "300 W Ash St", city: "Salina", state: "Kansas", zip: "67401", phone: "(785) 826-7000", hours: "Mon & Fri 6pm", lat: 38.8403, lng: -97.6114 },
  { name: "Hutchinson Moose Bingo", address: "125 E Avenue B", city: "Hutchinson", state: "Kansas", zip: "67501", phone: "(620) 694-1311", hours: "Sat 2pm & 6pm", lat: 38.0608, lng: -97.9298 },

  // Oklahoma - more cities
  { name: "Oklahoma City VFW Bingo", address: "200 N Walker Ave", city: "Oklahoma City", state: "Oklahoma", zip: "73102", phone: "(405) 297-2200", hours: "Mon–Sat 7pm", lat: 35.4676, lng: -97.5164 },
  { name: "Tulsa Eagles Bingo", address: "175 E 2nd St", city: "Tulsa", state: "Oklahoma", zip: "74103", phone: "(918) 596-2100", hours: "Tue, Thu, Sat 6pm", lat: 36.1540, lng: -95.9928 },
  { name: "Norman OK Bingo Palace", address: "201 W Gray St", city: "Norman", state: "Oklahoma", zip: "73069", phone: "(405) 321-1600", hours: "Mon–Fri 6pm", lat: 35.2226, lng: -97.4395 },
  { name: "Broken Arrow Bingo", address: "220 S 1st St", city: "Broken Arrow", state: "Oklahoma", zip: "74012", phone: "(918) 258-0540", hours: "Wed & Sat 7pm", lat: 36.0526, lng: -95.7908 },
  { name: "Lawton OK Bingo Night", address: "212 SW 9th St", city: "Lawton", state: "Oklahoma", zip: "73501", phone: "(580) 581-3424", hours: "Fri 6pm, Sat 2pm", lat: 34.6036, lng: -98.3959 },
  { name: "Edmond OK Bingo Hall", address: "20 S Littler Ave", city: "Edmond", state: "Oklahoma", zip: "73034", phone: "(405) 216-7000", hours: "Mon & Thu 7pm", lat: 35.6528, lng: -97.4781 },
  { name: "Moore OK Bingo World", address: "301 N Broadway", city: "Moore", state: "Oklahoma", zip: "73160", phone: "(405) 793-4804", hours: "Tue & Sat 6pm", lat: 35.3395, lng: -97.4867 },
  { name: "Midwest City Elks Bingo", address: "100 N Midwest Blvd", city: "Midwest City", state: "Oklahoma", zip: "73110", phone: "(405) 739-1220", hours: "Wed & Sat 7pm", lat: 35.4495, lng: -97.3967 },
  { name: "Enid OK Eagles Bingo", address: "401 W Owen K Garriott Rd", city: "Enid", state: "Oklahoma", zip: "73701", phone: "(580) 234-0400", hours: "Mon & Fri 6pm", lat: 36.3956, lng: -97.8784 },
  { name: "Stillwater OK Bingo Hall", address: "723 S Lewis St", city: "Stillwater", state: "Oklahoma", zip: "74074", phone: "(405) 372-0025", hours: "Sat 2pm & 6pm", lat: 36.1156, lng: -97.0584 },

  // Louisiana - more cities
  { name: "New Orleans VFW Bingo Hall", address: "1300 Perdido St", city: "New Orleans", state: "Louisiana", zip: "70112", phone: "(504) 658-4000", hours: "Mon–Sat 7pm", lat: 29.9511, lng: -90.0715 },
  { name: "Baton Rouge Eagles Bingo", address: "222 St Louis St", city: "Baton Rouge", state: "Louisiana", zip: "70802", phone: "(225) 389-3000", hours: "Tue, Thu, Sat 6pm", lat: 30.4515, lng: -91.1871 },
  { name: "Shreveport Bingo Palace", address: "505 Travis St", city: "Shreveport", state: "Louisiana", zip: "71101", phone: "(318) 673-5100", hours: "Mon–Fri 6pm", lat: 32.5252, lng: -93.7502 },
  { name: "Metairie LA Bingo Hall", address: "2 Galleria Blvd", city: "Metairie", state: "Louisiana", zip: "70001", phone: "(504) 736-6000", hours: "Wed & Sat 7pm", lat: 29.9799, lng: -90.1591 },
  { name: "Bossier City Bingo Night", address: "620 Benton Rd", city: "Bossier City", state: "Louisiana", zip: "71111", phone: "(318) 741-8522", hours: "Fri 6pm, Sat 2pm", lat: 32.5160, lng: -93.7321 },
  { name: "Kenner LA Bingo Hall", address: "1801 Williams Blvd", city: "Kenner", state: "Louisiana", zip: "70062", phone: "(504) 468-7200", hours: "Mon & Thu 7pm", lat: 29.9941, lng: -90.2418 },
  { name: "Lafayette LA Bingo World", address: "705 W University Ave", city: "Lafayette", state: "Louisiana", zip: "70506", phone: "(337) 291-8300", hours: "Tue & Sat 6pm", lat: 30.2241, lng: -92.0198 },
  { name: "Lake Charles Bingo Center", address: "326 W Pujo St", city: "Lake Charles", state: "Louisiana", zip: "70601", phone: "(337) 491-1200", hours: "Wed & Sat 7pm", lat: 30.2266, lng: -93.2174 },
  { name: "Monroe LA Eagles Bingo", address: "400 Lea Joyner Memorial Expy", city: "Monroe", state: "Louisiana", zip: "71201", phone: "(318) 329-2200", hours: "Mon & Fri 6pm", lat: 32.5093, lng: -92.1193 },
  { name: "Alexandria LA VFW Bingo", address: "915 3rd St", city: "Alexandria", state: "Louisiana", zip: "71301", phone: "(318) 441-6100", hours: "Sat 2pm & 6pm", lat: 31.3113, lng: -92.4451 },

  // Mississippi - more cities
  { name: "Jackson MS VFW Bingo Hall", address: "219 S President St", city: "Jackson", state: "Mississippi", zip: "39201", phone: "(601) 960-1084", hours: "Mon–Sat 7pm", lat: 32.2988, lng: -90.1848 },
  { name: "Gulfport Eagles Bingo", address: "2309 15th St", city: "Gulfport", state: "Mississippi", zip: "39501", phone: "(228) 868-5700", hours: "Tue, Thu, Sat 6pm", lat: 30.3674, lng: -89.0928 },
  { name: "Southaven MS Bingo Palace", address: "8691 Northwest Dr", city: "Southaven", state: "Mississippi", zip: "38671", phone: "(662) 393-6900", hours: "Mon–Fri 6pm", lat: 34.9887, lng: -89.9873 },
  { name: "Hattiesburg Bingo Center", address: "200 Forrest St", city: "Hattiesburg", state: "Mississippi", zip: "39401", phone: "(601) 545-4570", hours: "Wed & Sat 7pm", lat: 31.3271, lng: -89.2903 },
  { name: "Biloxi Bingo Night", address: "140 Lameuse St", city: "Biloxi", state: "Mississippi", zip: "39530", phone: "(228) 435-6200", hours: "Fri 6pm, Sat 2pm", lat: 30.3960, lng: -88.8853 },
  { name: "Olive Branch Bingo Hall", address: "9200 Pigeon Roost Rd", city: "Olive Branch", state: "Mississippi", zip: "38654", phone: "(662) 892-9200", hours: "Mon & Thu 7pm", lat: 34.9618, lng: -89.8292 },
  { name: "Tupelo MS Bingo World", address: "71 E Troy St", city: "Tupelo", state: "Mississippi", zip: "38804", phone: "(662) 841-6500", hours: "Tue & Sat 6pm", lat: 34.2576, lng: -88.7034 },
  { name: "Meridian Elks Bingo", address: "601 23rd Ave", city: "Meridian", state: "Mississippi", zip: "39301", phone: "(601) 693-2081", hours: "Wed & Sat 7pm", lat: 32.3643, lng: -88.7037 },
  { name: "Greenville MS Eagles Bingo", address: "300 Washington Ave", city: "Greenville", state: "Mississippi", zip: "38701", phone: "(662) 378-1545", hours: "Mon & Fri 6pm", lat: 33.4101, lng: -91.0612 },
  { name: "Horn Lake Bingo Hall", address: "3101 Goodman Rd W", city: "Horn Lake", state: "Mississippi", zip: "38637", phone: "(662) 393-6152", hours: "Sat 2pm & 6pm", lat: 34.9551, lng: -90.0345 },

  // Nebraska - more cities
  { name: "Omaha VFW Bingo Hall", address: "1819 Farnam St", city: "Omaha", state: "Nebraska", zip: "68102", phone: "(402) 444-5000", hours: "Mon–Sat 7pm", lat: 41.2565, lng: -95.9345 },
  { name: "Lincoln NE Eagles Bingo", address: "555 S 10th St", city: "Lincoln", state: "Nebraska", zip: "68508", phone: "(402) 441-7511", hours: "Tue, Thu, Sat 6pm", lat: 40.8136, lng: -96.7026 },
  { name: "Bellevue NE Bingo Palace", address: "1500 Wall St", city: "Bellevue", state: "Nebraska", zip: "68005", phone: "(402) 293-3000", hours: "Mon–Fri 6pm", lat: 41.1544, lng: -95.9146 },
  { name: "Grand Island Bingo Hall", address: "100 E 1st St", city: "Grand Island", state: "Nebraska", zip: "68801", phone: "(308) 385-5444", hours: "Wed & Sat 7pm", lat: 40.9264, lng: -98.3420 },
  { name: "Kearney NE Bingo Night", address: "18 E 22nd St", city: "Kearney", state: "Nebraska", zip: "68847", phone: "(308) 233-3200", hours: "Fri 6pm, Sat 2pm", lat: 40.6991, lng: -99.0817 },
  { name: "Fremont NE Bingo Hall", address: "400 E Military Ave", city: "Fremont", state: "Nebraska", zip: "68025", phone: "(402) 727-2600", hours: "Mon & Thu 7pm", lat: 41.4333, lng: -96.4978 },
  { name: "North Platte Bingo World", address: "211 N Jeffers St", city: "North Platte", state: "Nebraska", zip: "69101", phone: "(308) 535-3214", hours: "Tue & Sat 6pm", lat: 41.1236, lng: -100.7654 },
  { name: "Hastings NE Moose Bingo", address: "201 N Hastings Ave", city: "Hastings", state: "Nebraska", zip: "68901", phone: "(402) 461-2300", hours: "Wed & Sat 7pm", lat: 40.5861, lng: -98.3881 },
  { name: "Columbus NE Eagles Bingo", address: "2424 14th St", city: "Columbus", state: "Nebraska", zip: "68601", phone: "(402) 562-4451", hours: "Mon & Fri 6pm", lat: 41.4298, lng: -97.3687 },
  { name: "Norfolk NE Bingo Hall", address: "309 N 5th St", city: "Norfolk", state: "Nebraska", zip: "68701", phone: "(402) 844-2000", hours: "Sat 2pm & 6pm", lat: 42.0289, lng: -97.4170 },
];

async function main() {
  console.log(`Seeding ${additionalHalls.length} additional bingo halls...`);

  const slugCounts = new Map<string, number>();

  // Pre-load existing slugs to avoid conflicts
  const existing = await prisma.bingoHall.findMany({ select: { slug: true } });
  for (const h of existing) {
    slugCounts.set(h.slug, 1);
  }

  let added = 0;
  for (const hall of additionalHalls) {
    const baseSlug = makeSlug(hall.name, hall.city, hall.state);
    const count = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;

    const stateAbbr = STATE_ABBREVIATIONS[hall.state] ?? hall.state;

    try {
      await prisma.bingoHall.upsert({
        where: { slug },
        update: {},
        create: {
          name: hall.name,
          slug,
          address: hall.address,
          city: hall.city,
          state: stateAbbr,
          stateSlug: slugify(hall.state),
          citySlug: slugify(hall.city),
          zip: hall.zip,
          phone: hall.phone,
          hours: hall.hours,
          website: hall.website,
          description: hall.description,
          lat: hall.lat,
          lng: hall.lng,
          status: "active",
        },
      });
      added++;
    } catch (e) {
      console.error(`Failed to insert ${hall.name}:`, e);
    }
  }

  const total = await prisma.bingoHall.count();
  console.log(`Done! Added ${added} halls. Total: ${total} bingo halls in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
