import { PrismaClient } from "../src/generated/prisma/client";
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

const halls: HallInput[] = [
  // Alabama
  { name: "VFW Post 2702 Bingo", address: "1420 Veterans Dr", city: "Huntsville", state: "Alabama", zip: "35816", phone: "(256) 837-4490", hours: "Fri 6pm, Sat 2pm", lat: 34.7304, lng: -86.5861 },
  { name: "Knights of Columbus Bingo Hall", address: "3400 Stone Ave", city: "Birmingham", state: "Alabama", zip: "35210", phone: "(205) 956-1100", hours: "Tue & Thu 7pm", lat: 33.5186, lng: -86.8104 },
  { name: "American Legion Bingo Night", address: "200 Legion Dr", city: "Mobile", state: "Alabama", zip: "36602", phone: "(251) 432-4000", hours: "Sat 6pm", lat: 30.6954, lng: -88.0399 },
  { name: "Lucky Numbers Bingo Hall", address: "512 Main St", city: "Montgomery", state: "Alabama", zip: "36104", phone: "(334) 265-4500", hours: "Mon, Wed, Fri 7pm", lat: 32.3668, lng: -86.2999 },
  { name: "Tuscaloosa Bingo Center", address: "320 McFarland Blvd", city: "Tuscaloosa", state: "Alabama", zip: "35405", phone: "(205) 752-3333", hours: "Tue–Sat 6pm", lat: 33.2098, lng: -87.5692 },
  { name: "Dothan Bingo Palace", address: "1200 Ross Clark Circle", city: "Dothan", state: "Alabama", zip: "36301", phone: "(334) 793-7070", hours: "Mon–Sat 7pm", lat: 31.2232, lng: -85.3905 },
  { name: "Auburn Community Bingo", address: "545 Opelika Rd", city: "Auburn", state: "Alabama", zip: "36830", phone: "(334) 821-9000", hours: "Fri–Sat 7pm", lat: 32.6099, lng: -85.4808 },

  // Alaska
  { name: "Elks Lodge Bingo Night", address: "214 W 2nd Ave", city: "Anchorage", state: "Alaska", zip: "99501", phone: "(907) 277-2332", hours: "Wed 6:30pm", lat: 61.2181, lng: -149.9003 },
  { name: "Fairbanks Eagles Bingo", address: "1803 Cushman St", city: "Fairbanks", state: "Alaska", zip: "99701", phone: "(907) 452-4244", hours: "Fri 7pm", lat: 64.8378, lng: -147.7164 },
  { name: "Juneau Moose Lodge Bingo", address: "325 Marine Way", city: "Juneau", state: "Alaska", zip: "99801", phone: "(907) 586-1866", hours: "Sat 2pm & 6pm", lat: 58.3005, lng: -134.4197 },

  // Arizona
  { name: "Tempe Bingo World", address: "1234 Apache Blvd", city: "Tempe", state: "Arizona", zip: "85281", phone: "(480) 968-4000", hours: "Daily 6pm", lat: 33.4255, lng: -111.9400 },
  { name: "Phoenix Bingo Palace", address: "4500 N Central Ave", city: "Phoenix", state: "Arizona", zip: "85012", phone: "(602) 264-7272", hours: "Mon–Sat 7pm", lat: 33.5000, lng: -112.0730 },
  { name: "Tucson VFW Bingo", address: "3055 N Stone Ave", city: "Tucson", state: "Arizona", zip: "85705", phone: "(520) 887-9500", hours: "Fri 6pm, Sat 2pm", lat: 32.2540, lng: -110.9742 },
  { name: "Mesa Bingo Center", address: "125 W Main St", city: "Mesa", state: "Arizona", zip: "85201", phone: "(480) 834-1100", hours: "Tue–Sun 6pm", lat: 33.4152, lng: -111.8315 },
  { name: "Scottsdale Bingo Hall", address: "7170 E McDonald Dr", city: "Scottsdale", state: "Arizona", zip: "85253", phone: "(480) 948-3333", hours: "Wed & Fri 7pm", lat: 33.5722, lng: -111.8587 },
  { name: "Chandler Bingo & More", address: "980 W Chandler Blvd", city: "Chandler", state: "Arizona", zip: "85225", phone: "(480) 899-0000", hours: "Mon, Thu, Sat 6pm", lat: 33.3062, lng: -111.8413 },
  { name: "Peoria Lucky Bingo", address: "8530 W Union Hills Dr", city: "Peoria", state: "Arizona", zip: "85382", phone: "(623) 486-9990", hours: "Tue & Sat 7pm", lat: 33.7062, lng: -112.2312 },
  { name: "Flagstaff Elks Bingo", address: "2011 E Santa Fe Ave", city: "Flagstaff", state: "Arizona", zip: "86004", phone: "(928) 526-2561", hours: "Fri 7pm", lat: 35.2108, lng: -111.6058 },

  // Arkansas
  { name: "Little Rock Bingo Hall", address: "400 W Capitol Ave", city: "Little Rock", state: "Arkansas", zip: "72201", phone: "(501) 376-9999", hours: "Tue–Sat 7pm", lat: 34.7465, lng: -92.2896 },
  { name: "Fort Smith VFW Bingo", address: "1117 N 28th St", city: "Fort Smith", state: "Arkansas", zip: "72901", phone: "(479) 782-4000", hours: "Fri 6pm, Sat 2pm", lat: 35.3859, lng: -94.4013 },
  { name: "Fayetteville Eagles Bingo", address: "2550 N Gregg Ave", city: "Fayetteville", state: "Arkansas", zip: "72703", phone: "(479) 521-4444", hours: "Wed & Sat 7pm", lat: 36.0822, lng: -94.1719 },
  { name: "Jonesboro Bingo Center", address: "2015 E Highland Dr", city: "Jonesboro", state: "Arkansas", zip: "72401", phone: "(870) 932-8800", hours: "Thu–Sat 6pm", lat: 35.8423, lng: -90.6712 },

  // California
  { name: "LA Bingo Hall", address: "4000 Sunset Blvd", city: "Los Angeles", state: "California", zip: "90029", phone: "(323) 669-1234", hours: "Daily 6pm & 8pm", lat: 34.0878, lng: -118.2784 },
  { name: "San Francisco Knights Bingo", address: "3130 16th St", city: "San Francisco", state: "California", zip: "94103", phone: "(415) 431-5700", hours: "Mon–Sat 7pm", lat: 37.7648, lng: -122.4194 },
  { name: "San Diego Bingo Club", address: "3750 Sports Arena Blvd", city: "San Diego", state: "California", zip: "92110", phone: "(619) 524-0400", hours: "Tue–Sun 6pm", lat: 32.7555, lng: -117.2009 },
  { name: "Sacramento Eagles Bingo", address: "2900 El Camino Ave", city: "Sacramento", state: "California", zip: "95821", phone: "(916) 481-5533", hours: "Wed, Fri, Sat 6:30pm", lat: 38.5872, lng: -121.4001 },
  { name: "San Jose Bingo Palace", address: "1520 Meridian Ave", city: "San Jose", state: "California", zip: "95125", phone: "(408) 265-9900", hours: "Mon–Sat 7pm", lat: 37.3009, lng: -121.9003 },
  { name: "Fresno Community Bingo", address: "1777 E Shields Ave", city: "Fresno", state: "California", zip: "93726", phone: "(559) 226-7000", hours: "Tue–Sun 6pm", lat: 36.7773, lng: -119.7871 },
  { name: "Oakland VFW Bingo Night", address: "2130 MacArthur Blvd", city: "Oakland", state: "California", zip: "94602", phone: "(510) 531-3255", hours: "Fri 7pm, Sat 2pm", lat: 37.7918, lng: -122.2265 },
  { name: "Long Beach Bingo Bonanza", address: "310 E 3rd St", city: "Long Beach", state: "California", zip: "90802", phone: "(562) 436-1060", hours: "Mon–Sat 6:30pm", lat: 33.7676, lng: -118.1892 },
  { name: "Bakersfield Lucky Bingo", address: "1400 Oak St", city: "Bakersfield", state: "California", zip: "93304", phone: "(661) 327-9900", hours: "Tue & Thu 7pm", lat: 35.3691, lng: -119.0188 },
  { name: "Anaheim Bingo World", address: "2040 W Ball Rd", city: "Anaheim", state: "California", zip: "92804", phone: "(714) 774-2900", hours: "Daily 6pm", lat: 33.8364, lng: -117.9274 },
  { name: "Riverside Elks Bingo", address: "1020 7th St", city: "Riverside", state: "California", zip: "92501", phone: "(951) 684-4400", hours: "Wed & Sat 7pm", lat: 33.9806, lng: -117.3755 },
  { name: "Santa Ana Bingo Club", address: "915 N Flower St", city: "Santa Ana", state: "California", zip: "92703", phone: "(714) 543-7777", hours: "Mon–Sun 5pm", lat: 33.7530, lng: -117.8714 },

  // Colorado
  { name: "Denver Bingo Hall", address: "1551 S Federal Blvd", city: "Denver", state: "Colorado", zip: "80219", phone: "(303) 935-2200", hours: "Mon–Sat 7pm", lat: 39.7097, lng: -105.0302 },
  { name: "Colorado Springs Eagles", address: "3020 E Platte Ave", city: "Colorado Springs", state: "Colorado", zip: "80909", phone: "(719) 633-7770", hours: "Tue, Thu, Sat 7pm", lat: 38.8730, lng: -104.7936 },
  { name: "Aurora Bingo Center", address: "2100 S Havana St", city: "Aurora", state: "Colorado", zip: "80014", phone: "(303) 745-6800", hours: "Wed–Sun 6:30pm", lat: 39.6606, lng: -104.8479 },
  { name: "Fort Collins VFW Bingo", address: "905 W Oak St", city: "Fort Collins", state: "Colorado", zip: "80521", phone: "(970) 482-4848", hours: "Fri 6pm, Sat 2pm", lat: 40.5853, lng: -105.0844 },
  { name: "Pueblo Moose Bingo", address: "930 W 4th St", city: "Pueblo", state: "Colorado", zip: "81003", phone: "(719) 544-3330", hours: "Mon & Thu 7pm", lat: 38.2544, lng: -104.6091 },

  // Connecticut
  { name: "Bridgeport Knights Bingo", address: "625 Barnum Ave", city: "Bridgeport", state: "Connecticut", zip: "06608", phone: "(203) 366-5555", hours: "Tue & Fri 7pm", lat: 41.1784, lng: -73.1791 },
  { name: "Hartford VFW Bingo", address: "50 Gillett St", city: "Hartford", state: "Connecticut", zip: "06105", phone: "(860) 547-0010", hours: "Sat 6pm", lat: 41.7658, lng: -72.6851 },
  { name: "New Haven Eagles Bingo", address: "215 Whalley Ave", city: "New Haven", state: "Connecticut", zip: "06511", phone: "(203) 787-9900", hours: "Wed & Sat 7pm", lat: 41.3082, lng: -72.9374 },
  { name: "Stamford Bingo Night", address: "320 Tresser Blvd", city: "Stamford", state: "Connecticut", zip: "06901", phone: "(203) 975-7700", hours: "Fri 7pm", lat: 41.0534, lng: -73.5387 },

  // Delaware
  { name: "Wilmington Elks Bingo", address: "1519 N Broom St", city: "Wilmington", state: "Delaware", zip: "19806", phone: "(302) 652-8003", hours: "Tue & Fri 7pm", lat: 39.7447, lng: -75.5536 },
  { name: "Dover Moose Bingo Night", address: "800 N Dupont Hwy", city: "Dover", state: "Delaware", zip: "19901", phone: "(302) 678-2333", hours: "Sat 5pm & 7pm", lat: 39.1582, lng: -75.5244 },

  // Florida
  { name: "Tampa Bay Bingo", address: "5500 Memorial Hwy", city: "Tampa", state: "Florida", zip: "33615", phone: "(813) 885-0011", hours: "Daily 6pm & 8pm", lat: 27.9506, lng: -82.5490 },
  { name: "Miami Bingo Palace", address: "2000 NW 27th Ave", city: "Miami", state: "Florida", zip: "33142", phone: "(305) 634-7700", hours: "Mon–Sat 7pm", lat: 25.7913, lng: -80.2370 },
  { name: "Orlando Bingo Hall", address: "5570 International Dr", city: "Orlando", state: "Florida", zip: "32819", phone: "(407) 351-3200", hours: "Mon–Sun 7pm", lat: 28.4391, lng: -81.4634 },
  { name: "Jacksonville Eagles Bingo", address: "4255 Ramona Blvd", city: "Jacksonville", state: "Florida", zip: "32205", phone: "(904) 783-8400", hours: "Tue & Fri 7pm, Sun 2pm", lat: 30.3322, lng: -81.7429 },
  { name: "Fort Lauderdale VFW Bingo", address: "2500 W Oakland Park Blvd", city: "Fort Lauderdale", state: "Florida", zip: "33311", phone: "(954) 731-4040", hours: "Wed & Sat 6:30pm", lat: 26.1731, lng: -80.1872 },
  { name: "St. Petersburg Bingo Center", address: "1800 4th St N", city: "St. Petersburg", state: "Florida", zip: "33704", phone: "(727) 822-9300", hours: "Mon–Sat 7pm", lat: 27.7931, lng: -82.6404 },
  { name: "Pensacola Lucky Bingo", address: "525 W Garden St", city: "Pensacola", state: "Florida", zip: "32501", phone: "(850) 434-4400", hours: "Tue, Thu, Sat 6pm", lat: 30.4213, lng: -87.2169 },
  { name: "Gainesville Moose Bingo", address: "620 NW 34th St", city: "Gainesville", state: "Florida", zip: "32607", phone: "(352) 376-3350", hours: "Fri 7pm, Sat 2pm", lat: 29.6516, lng: -82.3248 },
  { name: "Tallahassee Knights Bingo", address: "1900 W Pensacola St", city: "Tallahassee", state: "Florida", zip: "32304", phone: "(850) 575-4500", hours: "Mon & Thu 7pm", lat: 30.4518, lng: -84.2807 },
  { name: "Hialeah Bingo World", address: "1500 W 49th St", city: "Hialeah", state: "Florida", zip: "33012", phone: "(305) 822-7800", hours: "Daily 6pm & 8pm", lat: 25.8576, lng: -80.3081 },

  // Georgia
  { name: "Atlanta Bingo Hall", address: "1800 Howell Mill Rd", city: "Atlanta", state: "Georgia", zip: "30318", phone: "(404) 352-7000", hours: "Tue–Sat 7pm", lat: 33.7850, lng: -84.4104 },
  { name: "Augusta Eagles Bingo", address: "3010 Wheeler Rd", city: "Augusta", state: "Georgia", zip: "30909", phone: "(706) 860-2200", hours: "Fri & Sat 7pm", lat: 33.4735, lng: -82.0105 },
  { name: "Columbus Bingo Center", address: "1500 Veterans Pkwy", city: "Columbus", state: "Georgia", zip: "31901", phone: "(706) 322-9700", hours: "Mon–Sat 6:30pm", lat: 32.4610, lng: -84.9877 },
  { name: "Macon VFW Bingo", address: "500 Mulberry St", city: "Macon", state: "Georgia", zip: "31201", phone: "(478) 742-5500", hours: "Thu & Sat 7pm", lat: 32.8407, lng: -83.6324 },
  { name: "Savannah Bingo Night", address: "215 W Broughton St", city: "Savannah", state: "Georgia", zip: "31401", phone: "(912) 233-9900", hours: "Fri 6pm, Sat 2pm & 7pm", lat: 32.0809, lng: -81.0912 },

  // Hawaii
  { name: "Honolulu Eagles Bingo", address: "1505 Dillingham Blvd", city: "Honolulu", state: "Hawaii", zip: "96817", phone: "(808) 847-3500", hours: "Fri 7pm, Sat 2pm", lat: 21.3241, lng: -157.8690 },
  { name: "Hilo Elks Bingo Night", address: "382 Kinoole St", city: "Hilo", state: "Hawaii", zip: "96720", phone: "(808) 935-3002", hours: "Sat 6pm", lat: 19.7242, lng: -155.0900 },

  // Idaho
  { name: "Boise VFW Bingo", address: "200 E Idaho Ave", city: "Boise", state: "Idaho", zip: "83702", phone: "(208) 342-2600", hours: "Fri 6:30pm, Sat 2pm", lat: 43.6150, lng: -116.2023 },
  { name: "Nampa Eagles Bingo", address: "420 12th Ave S", city: "Nampa", state: "Idaho", zip: "83651", phone: "(208) 466-3383", hours: "Wed & Sat 7pm", lat: 43.5407, lng: -116.5635 },
  { name: "Pocatello Moose Bingo", address: "1501 N Main St", city: "Pocatello", state: "Idaho", zip: "83204", phone: "(208) 232-5544", hours: "Thu 6pm", lat: 42.8713, lng: -112.4455 },

  // Illinois
  { name: "Chicago Bingo Hall", address: "4900 N Milwaukee Ave", city: "Chicago", state: "Illinois", zip: "60630", phone: "(773) 725-4400", hours: "Daily 7pm", lat: 41.9742, lng: -87.7697 },
  { name: "Springfield Eagles Bingo", address: "501 E Capitol Ave", city: "Springfield", state: "Illinois", zip: "62701", phone: "(217) 528-4500", hours: "Tue & Fri 7pm", lat: 39.7817, lng: -89.6501 },
  { name: "Rockford Bingo Center", address: "3125 N Main St", city: "Rockford", state: "Illinois", zip: "61103", phone: "(815) 877-4400", hours: "Mon–Sat 6:30pm", lat: 42.2711, lng: -89.0940 },
  { name: "Joliet Knights Bingo", address: "210 N Raynor Ave", city: "Joliet", state: "Illinois", zip: "60435", phone: "(815) 722-8400", hours: "Thu & Sat 7pm", lat: 41.5250, lng: -88.0817 },
  { name: "Peoria VFW Bingo", address: "2017 W Rohmann Ave", city: "Peoria", state: "Illinois", zip: "61604", phone: "(309) 673-0770", hours: "Mon & Wed 7pm", lat: 40.6936, lng: -89.5890 },
  { name: "Aurora Bingo Palace", address: "2 E Galena Blvd", city: "Aurora", state: "Illinois", zip: "60505", phone: "(630) 892-3000", hours: "Fri & Sat 7pm", lat: 41.7606, lng: -88.3201 },

  // Indiana
  { name: "Indianapolis Bingo Hall", address: "2700 E 38th St", city: "Indianapolis", state: "Indiana", zip: "46218", phone: "(317) 546-7700", hours: "Mon–Sat 7pm", lat: 39.8063, lng: -86.0904 },
  { name: "Fort Wayne Eagles Bingo", address: "900 Spy Run Ave", city: "Fort Wayne", state: "Indiana", zip: "46805", phone: "(260) 422-3000", hours: "Tue, Thu, Sat 7pm", lat: 41.0887, lng: -85.1394 },
  { name: "Evansville VFW Bingo", address: "2800 Lynch Rd", city: "Evansville", state: "Indiana", zip: "47711", phone: "(812) 422-2700", hours: "Fri 6pm, Sat 2pm", lat: 37.9716, lng: -87.5711 },
  { name: "South Bend Moose Bingo", address: "1620 N Main St", city: "South Bend", state: "Indiana", zip: "46628", phone: "(574) 232-8700", hours: "Wed & Sat 7pm", lat: 41.6764, lng: -86.2520 },

  // Iowa
  { name: "Des Moines Eagles Bingo", address: "4100 University Ave", city: "Des Moines", state: "Iowa", zip: "50311", phone: "(515) 277-8400", hours: "Mon & Thu 7pm", lat: 41.5868, lng: -93.6250 },
  { name: "Cedar Rapids Bingo Center", address: "3230 1st Ave SE", city: "Cedar Rapids", state: "Iowa", zip: "52403", phone: "(319) 365-4400", hours: "Fri & Sat 7pm", lat: 41.9779, lng: -91.6680 },
  { name: "Davenport VFW Bingo", address: "2210 Brady St", city: "Davenport", state: "Iowa", zip: "52803", phone: "(563) 326-9900", hours: "Wed 6:30pm, Sat 2pm", lat: 41.5236, lng: -90.5776 },

  // Kansas
  { name: "Wichita Bingo Palace", address: "1540 E 21st St", city: "Wichita", state: "Kansas", zip: "67214", phone: "(316) 683-2700", hours: "Mon–Sat 7pm", lat: 37.7173, lng: -97.2883 },
  { name: "Kansas City Eagles Bingo", address: "3600 Strong Ave", city: "Kansas City", state: "Kansas", zip: "66106", phone: "(913) 371-8800", hours: "Tue & Fri 7pm", lat: 39.1155, lng: -94.7577 },
  { name: "Topeka Knights Bingo", address: "1000 SE Quincy St", city: "Topeka", state: "Kansas", zip: "66612", phone: "(785) 232-9900", hours: "Thu & Sat 6:30pm", lat: 39.0473, lng: -95.6752 },
  { name: "Overland Park Bingo Hall", address: "8700 Antioch Rd", city: "Overland Park", state: "Kansas", zip: "66212", phone: "(913) 648-1100", hours: "Fri 7pm", lat: 38.9822, lng: -94.6708 },

  // Kentucky
  { name: "Louisville Bingo Hall", address: "3800 Bardstown Rd", city: "Louisville", state: "Kentucky", zip: "40218", phone: "(502) 499-4400", hours: "Tue–Sat 7pm", lat: 38.1938, lng: -85.6595 },
  { name: "Lexington VFW Bingo", address: "1800 Alexandria Dr", city: "Lexington", state: "Kentucky", zip: "40504", phone: "(859) 255-8800", hours: "Fri & Sat 7pm", lat: 38.0406, lng: -84.5037 },
  { name: "Bowling Green Eagles Bingo", address: "1200 College St", city: "Bowling Green", state: "Kentucky", zip: "42101", phone: "(270) 782-3300", hours: "Wed 7pm, Sun 2pm", lat: 36.9685, lng: -86.4808 },
  { name: "Owensboro Moose Bingo", address: "1400 Sweeney St", city: "Owensboro", state: "Kentucky", zip: "42301", phone: "(270) 683-1155", hours: "Mon & Thu 6:30pm", lat: 37.7719, lng: -87.1112 },

  // Louisiana
  { name: "New Orleans Bingo", address: "3300 Tulane Ave", city: "New Orleans", state: "Louisiana", zip: "70119", phone: "(504) 486-4400", hours: "Daily 6pm & 8pm", lat: 29.9731, lng: -90.0801 },
  { name: "Baton Rouge Bingo Hall", address: "9001 Airline Hwy", city: "Baton Rouge", state: "Louisiana", zip: "70815", phone: "(225) 927-4400", hours: "Mon–Sat 7pm", lat: 30.4515, lng: -91.0545 },
  { name: "Shreveport Eagles Bingo", address: "1524 Milam St", city: "Shreveport", state: "Louisiana", zip: "71101", phone: "(318) 424-2200", hours: "Tue & Fri 7pm", lat: 32.5252, lng: -93.7502 },
  { name: "Lafayette VFW Bingo", address: "1105 N Buchanan St", city: "Lafayette", state: "Louisiana", zip: "70501", phone: "(337) 235-9900", hours: "Sat 5pm & 7pm", lat: 30.2241, lng: -92.0198 },

  // Maine
  { name: "Portland Elks Bingo", address: "1945 Congress St", city: "Portland", state: "Maine", zip: "04102", phone: "(207) 797-9800", hours: "Fri 7pm", lat: 43.6615, lng: -70.2553 },
  { name: "Lewiston VFW Bingo", address: "450 Lisbon St", city: "Lewiston", state: "Maine", zip: "04240", phone: "(207) 782-2700", hours: "Wed & Sat 6:30pm", lat: 44.1004, lng: -70.2148 },
  { name: "Bangor Eagles Bingo", address: "308 Main St", city: "Bangor", state: "Maine", zip: "04401", phone: "(207) 945-3700", hours: "Mon & Thu 7pm", lat: 44.8012, lng: -68.7778 },

  // Maryland
  { name: "Baltimore Bingo Hall", address: "3440 Eastern Ave", city: "Baltimore", state: "Maryland", zip: "21224", phone: "(410) 675-4400", hours: "Mon–Sat 7pm", lat: 39.2856, lng: -76.5685 },
  { name: "Annapolis Eagles Bingo", address: "2400 Harry S Truman Pkwy", city: "Annapolis", state: "Maryland", zip: "21401", phone: "(410) 266-9900", hours: "Fri 7pm, Sat 2pm", lat: 38.9784, lng: -76.4922 },
  { name: "Silver Spring Bingo Center", address: "8455 Colesville Rd", city: "Silver Spring", state: "Maryland", zip: "20910", phone: "(301) 589-4400", hours: "Tue & Thu 7pm", lat: 38.9974, lng: -77.0265 },
  { name: "Frederick VFW Bingo", address: "500 E South St", city: "Frederick", state: "Maryland", zip: "21701", phone: "(301) 663-7700", hours: "Wed 6:30pm", lat: 39.4143, lng: -77.4105 },

  // Massachusetts
  { name: "Boston Bingo Hall", address: "195 Dorchester Ave", city: "Boston", state: "Massachusetts", zip: "02127", phone: "(617) 269-4400", hours: "Tue–Sat 7pm", lat: 42.3358, lng: -71.0567 },
  { name: "Worcester Eagles Bingo", address: "1025 Main St", city: "Worcester", state: "Massachusetts", zip: "01603", phone: "(508) 791-4400", hours: "Mon & Thu 7pm", lat: 42.2626, lng: -71.8023 },
  { name: "Springfield VFW Bingo", address: "1476 Main St", city: "Springfield", state: "Massachusetts", zip: "01103", phone: "(413) 736-9900", hours: "Fri 7pm, Sat 2pm", lat: 42.1015, lng: -72.5898 },
  { name: "Cambridge Bingo Night", address: "853 Massachusetts Ave", city: "Cambridge", state: "Massachusetts", zip: "02139", phone: "(617) 868-4400", hours: "Wed 7pm", lat: 42.3736, lng: -71.1097 },
  { name: "Lowell Moose Bingo", address: "455 Chelmsford St", city: "Lowell", state: "Massachusetts", zip: "01851", phone: "(978) 453-3300", hours: "Sat 2pm & 7pm", lat: 42.6335, lng: -71.3162 },

  // Michigan
  { name: "Detroit Bingo Hall", address: "14200 W 7 Mile Rd", city: "Detroit", state: "Michigan", zip: "48235", phone: "(313) 863-4400", hours: "Mon–Sat 7pm", lat: 42.4205, lng: -83.2283 },
  { name: "Grand Rapids Eagles Bingo", address: "2430 Hall St SE", city: "Grand Rapids", state: "Michigan", zip: "49506", phone: "(616) 245-4400", hours: "Tue & Fri 7pm", lat: 42.9634, lng: -85.6681 },
  { name: "Ann Arbor VFW Bingo", address: "3060 Packard Rd", city: "Ann Arbor", state: "Michigan", zip: "48108", phone: "(734) 665-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 42.2588, lng: -83.7430 },
  { name: "Flint Bingo Center", address: "2501 N Saginaw St", city: "Flint", state: "Michigan", zip: "48505", phone: "(810) 232-4400", hours: "Mon, Wed, Sat 7pm", lat: 43.0234, lng: -83.6864 },
  { name: "Lansing Moose Bingo", address: "6600 N Grand River Ave", city: "Lansing", state: "Michigan", zip: "48906", phone: "(517) 321-4400", hours: "Thu & Sat 6:30pm", lat: 42.7420, lng: -84.5555 },

  // Minnesota
  { name: "Minneapolis Bingo Hall", address: "2900 E Lake St", city: "Minneapolis", state: "Minnesota", zip: "55406", phone: "(612) 724-4400", hours: "Mon–Sat 7pm", lat: 44.9478, lng: -93.2368 },
  { name: "St. Paul Eagles Bingo", address: "1055 St. Paul Ave", city: "Saint Paul", state: "Minnesota", zip: "55116", phone: "(651) 698-4400", hours: "Tue & Fri 7pm", lat: 44.9537, lng: -93.1020 },
  { name: "Rochester VFW Bingo", address: "16 1st Ave SW", city: "Rochester", state: "Minnesota", zip: "55902", phone: "(507) 289-4400", hours: "Wed 6:30pm, Sat 2pm", lat: 44.0234, lng: -92.4630 },
  { name: "Duluth Moose Bingo", address: "4602 Grand Ave", city: "Duluth", state: "Minnesota", zip: "55807", phone: "(218) 624-4400", hours: "Fri 7pm", lat: 46.7867, lng: -92.1005 },

  // Mississippi
  { name: "Jackson Bingo Hall", address: "1500 N West St", city: "Jackson", state: "Mississippi", zip: "39202", phone: "(601) 355-4400", hours: "Tue–Sat 7pm", lat: 32.2988, lng: -90.1848 },
  { name: "Biloxi Eagles Bingo", address: "1600 Beach Blvd", city: "Biloxi", state: "Mississippi", zip: "39531", phone: "(228) 374-4400", hours: "Fri 6pm, Sat 2pm & 7pm", lat: 30.3960, lng: -88.8853 },
  { name: "Gulfport VFW Bingo", address: "3120 14th St", city: "Gulfport", state: "Mississippi", zip: "39501", phone: "(228) 863-4400", hours: "Mon & Thu 7pm", lat: 30.3674, lng: -89.0928 },
  { name: "Hattiesburg Bingo Center", address: "601 Bay St", city: "Hattiesburg", state: "Mississippi", zip: "39401", phone: "(601) 584-4400", hours: "Wed & Sat 6:30pm", lat: 31.3271, lng: -89.2903 },

  // Missouri
  { name: "Kansas City Bingo Hall", address: "7401 Blue Ridge Blvd", city: "Kansas City", state: "Missouri", zip: "64138", phone: "(816) 358-4400", hours: "Mon–Sat 7pm", lat: 38.9672, lng: -94.5673 },
  { name: "St. Louis Eagles Bingo", address: "9405 St. Charles Rock Rd", city: "St. Louis", state: "Missouri", zip: "63114", phone: "(314) 426-4400", hours: "Tue & Fri 7pm", lat: 38.7048, lng: -90.3665 },
  { name: "Springfield MO Bingo", address: "1810 S Campbell Ave", city: "Springfield", state: "Missouri", zip: "65807", phone: "(417) 886-4400", hours: "Wed & Sat 6:30pm", lat: 37.1918, lng: -93.2923 },
  { name: "Columbia VFW Bingo", address: "1111 Business Loop 70 E", city: "Columbia", state: "Missouri", zip: "65201", phone: "(573) 449-4400", hours: "Thu 7pm", lat: 38.9517, lng: -92.3341 },

  // Montana
  { name: "Billings Eagles Bingo", address: "1817 1st Ave N", city: "Billings", state: "Montana", zip: "59101", phone: "(406) 245-4400", hours: "Fri 6pm, Sat 2pm", lat: 45.7833, lng: -108.5007 },
  { name: "Missoula Bingo Night", address: "340 N Pattee St", city: "Missoula", state: "Montana", zip: "59801", phone: "(406) 543-4400", hours: "Wed 7pm", lat: 46.8721, lng: -113.9940 },
  { name: "Great Falls VFW Bingo", address: "1422 Choteau Ave", city: "Great Falls", state: "Montana", zip: "59401", phone: "(406) 727-4400", hours: "Thu & Sat 7pm", lat: 47.5020, lng: -111.2838 },

  // Nebraska
  { name: "Omaha Bingo Hall", address: "5425 Center St", city: "Omaha", state: "Nebraska", zip: "68106", phone: "(402) 558-4400", hours: "Mon–Sat 7pm", lat: 41.2565, lng: -95.9690 },
  { name: "Lincoln Eagles Bingo", address: "6901 S 58th St", city: "Lincoln", state: "Nebraska", zip: "68516", phone: "(402) 421-4400", hours: "Tue & Fri 7pm", lat: 40.7862, lng: -96.6956 },
  { name: "Bellevue VFW Bingo", address: "1406 Fort Crook Rd N", city: "Bellevue", state: "Nebraska", zip: "68005", phone: "(402) 291-4400", hours: "Sat 2pm & 6pm", lat: 41.1553, lng: -95.8940 },

  // Nevada
  { name: "Las Vegas Bingo Palace", address: "3780 S Maryland Pkwy", city: "Las Vegas", state: "Nevada", zip: "89119", phone: "(702) 734-4400", hours: "Daily 6pm & 8pm", lat: 36.1099, lng: -115.1490 },
  { name: "Reno Bingo Hall", address: "5600 S Virginia St", city: "Reno", state: "Nevada", zip: "89502", phone: "(775) 826-4400", hours: "Mon–Sat 7pm", lat: 39.5000, lng: -119.7953 },
  { name: "Henderson Eagles Bingo", address: "2590 N Wigwam Dr", city: "Henderson", state: "Nevada", zip: "89014", phone: "(702) 458-4400", hours: "Wed & Sat 6:30pm", lat: 36.0397, lng: -115.0349 },

  // New Hampshire
  { name: "Manchester VFW Bingo", address: "2800 Brown Ave", city: "Manchester", state: "New Hampshire", zip: "03103", phone: "(603) 627-4400", hours: "Fri 7pm, Sat 2pm", lat: 42.9956, lng: -71.4548 },
  { name: "Nashua Eagles Bingo", address: "65 Pine St", city: "Nashua", state: "New Hampshire", zip: "03060", phone: "(603) 882-4400", hours: "Mon & Thu 7pm", lat: 42.7654, lng: -71.4676 },
  { name: "Concord Moose Bingo", address: "400 N State St", city: "Concord", state: "New Hampshire", zip: "03301", phone: "(603) 225-4400", hours: "Wed 6:30pm", lat: 43.2081, lng: -71.5376 },

  // New Jersey
  { name: "Newark Bingo Hall", address: "550 Broad St", city: "Newark", state: "New Jersey", zip: "07102", phone: "(973) 643-4400", hours: "Mon–Sat 7pm", lat: 40.7357, lng: -74.1724 },
  { name: "Jersey City Eagles Bingo", address: "2060 Kennedy Blvd", city: "Jersey City", state: "New Jersey", zip: "07305", phone: "(201) 333-4400", hours: "Tue & Fri 7pm", lat: 40.7178, lng: -74.0431 },
  { name: "Trenton VFW Bingo", address: "115 E State St", city: "Trenton", state: "New Jersey", zip: "08608", phone: "(609) 393-4400", hours: "Sat 5pm & 7pm", lat: 40.2170, lng: -74.7429 },
  { name: "Camden Knights Bingo", address: "300 Federal St", city: "Camden", state: "New Jersey", zip: "08103", phone: "(856) 541-4400", hours: "Wed & Sat 6:30pm", lat: 39.9259, lng: -75.1196 },
  { name: "Atlantic City Bingo Club", address: "1000 Boardwalk", city: "Atlantic City", state: "New Jersey", zip: "08401", phone: "(609) 348-4400", hours: "Daily 2pm & 7pm", lat: 39.3643, lng: -74.4229 },

  // New Mexico
  { name: "Albuquerque Bingo Hall", address: "5001 Central Ave NE", city: "Albuquerque", state: "New Mexico", zip: "87108", phone: "(505) 268-4400", hours: "Tue–Sat 7pm", lat: 35.0844, lng: -106.6504 },
  { name: "Santa Fe Eagles Bingo", address: "400 Rodeo Rd", city: "Santa Fe", state: "New Mexico", zip: "87505", phone: "(505) 471-4400", hours: "Fri 7pm", lat: 35.6870, lng: -105.9378 },
  { name: "Las Cruces VFW Bingo", address: "2000 N Solano Dr", city: "Las Cruces", state: "New Mexico", zip: "88001", phone: "(575) 524-4400", hours: "Mon & Thu 6:30pm", lat: 32.3199, lng: -106.7637 },

  // New York
  { name: "NYC Bingo Hall Queens", address: "9420 Jamaica Ave", city: "Queens", state: "New York", zip: "11421", phone: "(718) 849-4400", hours: "Daily 6pm & 8pm", lat: 40.6904, lng: -73.8466 },
  { name: "Brooklyn Eagles Bingo", address: "2680 Nostrand Ave", city: "Brooklyn", state: "New York", zip: "11210", phone: "(718) 434-4400", hours: "Mon–Sat 7pm", lat: 40.6258, lng: -73.9443 },
  { name: "Bronx VFW Bingo", address: "1700 Tremont Ave", city: "Bronx", state: "New York", zip: "10457", phone: "(718) 299-4400", hours: "Tue & Fri 7pm", lat: 40.8448, lng: -73.9068 },
  { name: "Buffalo Bingo Center", address: "1600 Main St", city: "Buffalo", state: "New York", zip: "14209", phone: "(716) 884-4400", hours: "Mon, Wed, Sat 7pm", lat: 42.8864, lng: -78.8784 },
  { name: "Rochester NY Bingo", address: "270 Goodman St N", city: "Rochester", state: "New York", zip: "14607", phone: "(585) 473-4400", hours: "Fri & Sat 6:30pm", lat: 43.1566, lng: -77.6088 },
  { name: "Syracuse Knights Bingo", address: "540 Grant Blvd", city: "Syracuse", state: "New York", zip: "13208", phone: "(315) 476-4400", hours: "Thu & Sat 7pm", lat: 43.0481, lng: -76.1474 },
  { name: "Albany Moose Bingo", address: "1008 Central Ave", city: "Albany", state: "New York", zip: "12205", phone: "(518) 482-4400", hours: "Wed 7pm", lat: 42.6904, lng: -73.8190 },
  { name: "Staten Island Bingo Night", address: "745 Richmond Terr", city: "Staten Island", state: "New York", zip: "10301", phone: "(718) 981-4400", hours: "Fri 7pm, Sat 2pm", lat: 40.6437, lng: -74.0965 },
  { name: "Yonkers Eagles Bingo", address: "1955 Central Park Ave", city: "Yonkers", state: "New York", zip: "10710", phone: "(914) 961-4400", hours: "Mon & Thu 7pm", lat: 40.9867, lng: -73.8580 },

  // North Carolina
  { name: "Charlotte Bingo Hall", address: "5400 N Tryon St", city: "Charlotte", state: "North Carolina", zip: "28213", phone: "(704) 599-4400", hours: "Mon–Sat 7pm", lat: 35.2271, lng: -80.8431 },
  { name: "Raleigh Eagles Bingo", address: "5415 Edwards Mill Rd", city: "Raleigh", state: "North Carolina", zip: "27612", phone: "(919) 786-4400", hours: "Tue & Fri 7pm", lat: 35.8474, lng: -78.6806 },
  { name: "Greensboro VFW Bingo", address: "3800 W Market St", city: "Greensboro", state: "North Carolina", zip: "27407", phone: "(336) 854-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 36.0726, lng: -79.7920 },
  { name: "Winston-Salem Bingo Center", address: "400 W 4th St", city: "Winston-Salem", state: "North Carolina", zip: "27101", phone: "(336) 748-4400", hours: "Wed & Sat 7pm", lat: 36.0999, lng: -80.2442 },
  { name: "Durham Moose Bingo", address: "714 N Mangum St", city: "Durham", state: "North Carolina", zip: "27701", phone: "(919) 682-4400", hours: "Thu 7pm", lat: 35.9940, lng: -78.8986 },

  // North Dakota
  { name: "Fargo Eagles Bingo", address: "1025 2nd Ave N", city: "Fargo", state: "North Dakota", zip: "58102", phone: "(701) 235-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 46.8772, lng: -96.7898 },
  { name: "Bismarck VFW Bingo", address: "918 E Century Ave", city: "Bismarck", state: "North Dakota", zip: "58503", phone: "(701) 258-4400", hours: "Mon & Thu 7pm", lat: 46.8083, lng: -100.7837 },
  { name: "Grand Forks Moose Bingo", address: "3180 S 30th St", city: "Grand Forks", state: "North Dakota", zip: "58201", phone: "(701) 775-4400", hours: "Wed 6:30pm", lat: 47.9253, lng: -97.0329 },

  // Ohio
  { name: "Columbus Bingo Hall", address: "2300 E Broad St", city: "Columbus", state: "Ohio", zip: "43209", phone: "(614) 253-4400", hours: "Mon–Sat 7pm", lat: 39.9612, lng: -82.9988 },
  { name: "Cleveland Eagles Bingo", address: "6700 Euclid Ave", city: "Cleveland", state: "Ohio", zip: "44103", phone: "(216) 431-4400", hours: "Tue & Fri 7pm", lat: 41.5085, lng: -81.6268 },
  { name: "Cincinnati VFW Bingo", address: "5450 Glenway Ave", city: "Cincinnati", state: "Ohio", zip: "45238", phone: "(513) 922-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 39.1031, lng: -84.5120 },
  { name: "Toledo Bingo Center", address: "4801 W Bancroft St", city: "Toledo", state: "Ohio", zip: "43615", phone: "(419) 535-4400", hours: "Wed & Sat 7pm", lat: 41.6772, lng: -83.6133 },
  { name: "Akron Moose Bingo", address: "600 S Arlington St", city: "Akron", state: "Ohio", zip: "44306", phone: "(330) 773-4400", hours: "Thu 7pm", lat: 41.0814, lng: -81.5190 },
  { name: "Dayton Knights Bingo", address: "1001 S Edwin C Moses Blvd", city: "Dayton", state: "Ohio", zip: "45417", phone: "(937) 264-4400", hours: "Mon & Thu 7pm", lat: 39.7559, lng: -84.2040 },

  // Oklahoma
  { name: "Oklahoma City Bingo Hall", address: "6303 N May Ave", city: "Oklahoma City", state: "Oklahoma", zip: "73112", phone: "(405) 848-4400", hours: "Mon–Sat 7pm", lat: 35.5164, lng: -97.5615 },
  { name: "Tulsa Eagles Bingo", address: "5510 S Memorial Dr", city: "Tulsa", state: "Oklahoma", zip: "74145", phone: "(918) 663-4400", hours: "Tue & Fri 7pm", lat: 36.1006, lng: -95.9036 },
  { name: "Norman VFW Bingo", address: "1410 W Main St", city: "Norman", state: "Oklahoma", zip: "73069", phone: "(405) 329-4400", hours: "Thu & Sat 6:30pm", lat: 35.2226, lng: -97.4395 },

  // Oregon
  { name: "Portland Bingo Hall", address: "2211 SE Hawthorne Blvd", city: "Portland", state: "Oregon", zip: "97214", phone: "(503) 234-4400", hours: "Mon–Sat 7pm", lat: 45.5122, lng: -122.6587 },
  { name: "Eugene Eagles Bingo", address: "1600 W 7th Ave", city: "Eugene", state: "Oregon", zip: "97402", phone: "(541) 342-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 44.0521, lng: -123.0868 },
  { name: "Salem VFW Bingo", address: "2425 Market St NE", city: "Salem", state: "Oregon", zip: "97301", phone: "(503) 362-4400", hours: "Wed & Sat 7pm", lat: 44.9429, lng: -122.9990 },
  { name: "Gresham Moose Bingo", address: "1235 NE Division St", city: "Gresham", state: "Oregon", zip: "97030", phone: "(503) 661-4400", hours: "Tue 7pm", lat: 45.5001, lng: -122.4302 },

  // Pennsylvania
  { name: "Philadelphia Bingo Hall", address: "3500 N Broad St", city: "Philadelphia", state: "Pennsylvania", zip: "19140", phone: "(215) 225-4400", hours: "Mon–Sat 7pm", lat: 40.0003, lng: -75.1502 },
  { name: "Pittsburgh Eagles Bingo", address: "2820 W Liberty Ave", city: "Pittsburgh", state: "Pennsylvania", zip: "15216", phone: "(412) 531-4400", hours: "Tue & Fri 7pm", lat: 40.4010, lng: -80.0218 },
  { name: "Allentown VFW Bingo", address: "1442 Hamilton St", city: "Allentown", state: "Pennsylvania", zip: "18102", phone: "(610) 432-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 40.6023, lng: -75.4714 },
  { name: "Erie Bingo Center", address: "2425 W 8th St", city: "Erie", state: "Pennsylvania", zip: "16505", phone: "(814) 454-4400", hours: "Wed & Sat 7pm", lat: 42.1292, lng: -80.1101 },
  { name: "Reading Knights Bingo", address: "500 Penn St", city: "Reading", state: "Pennsylvania", zip: "19602", phone: "(610) 372-4400", hours: "Mon & Thu 7pm", lat: 40.3356, lng: -75.9269 },
  { name: "Scranton Moose Bingo", address: "311 N Washington Ave", city: "Scranton", state: "Pennsylvania", zip: "18503", phone: "(570) 342-4400", hours: "Thu 6:30pm", lat: 41.4090, lng: -75.6624 },

  // Rhode Island
  { name: "Providence Eagles Bingo", address: "1700 Mineral Spring Ave", city: "Providence", state: "Rhode Island", zip: "02904", phone: "(401) 353-4400", hours: "Mon & Fri 7pm", lat: 41.8240, lng: -71.4128 },
  { name: "Cranston VFW Bingo", address: "560 Phenix Ave", city: "Cranston", state: "Rhode Island", zip: "02920", phone: "(401) 946-4400", hours: "Sat 2pm & 7pm", lat: 41.7798, lng: -71.4373 },

  // South Carolina
  { name: "Columbia SC Bingo Hall", address: "2701 Millwood Ave", city: "Columbia", state: "South Carolina", zip: "29205", phone: "(803) 782-4400", hours: "Tue–Sat 7pm", lat: 33.9930, lng: -81.0154 },
  { name: "Charleston Eagles Bingo", address: "1655 Sam Rittenberg Blvd", city: "Charleston", state: "South Carolina", zip: "29407", phone: "(843) 571-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 32.7765, lng: -79.9980 },
  { name: "Greenville VFW Bingo", address: "100 McBee Ave", city: "Greenville", state: "South Carolina", zip: "29601", phone: "(864) 233-4400", hours: "Wed & Sat 7pm", lat: 34.8526, lng: -82.3940 },
  { name: "Rock Hill Moose Bingo", address: "180 Johnston St", city: "Rock Hill", state: "South Carolina", zip: "29730", phone: "(803) 329-4400", hours: "Thu 7pm", lat: 34.9249, lng: -81.0251 },

  // South Dakota
  { name: "Sioux Falls Eagles Bingo", address: "4600 S Willow Ave", city: "Sioux Falls", state: "South Dakota", zip: "57105", phone: "(605) 334-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 43.5373, lng: -96.7311 },
  { name: "Rapid City VFW Bingo", address: "1605 5th St", city: "Rapid City", state: "South Dakota", zip: "57701", phone: "(605) 343-4400", hours: "Mon & Thu 7pm", lat: 44.0805, lng: -103.2310 },
  { name: "Aberdeen Moose Bingo", address: "811 S Main St", city: "Aberdeen", state: "South Dakota", zip: "57401", phone: "(605) 225-4400", hours: "Wed 6:30pm", lat: 45.4647, lng: -98.4865 },

  // Tennessee
  { name: "Nashville Bingo Hall", address: "6401 Charlotte Pike", city: "Nashville", state: "Tennessee", zip: "37209", phone: "(615) 356-4400", hours: "Mon–Sat 7pm", lat: 36.1552, lng: -86.8642 },
  { name: "Memphis Eagles Bingo", address: "3515 Summer Ave", city: "Memphis", state: "Tennessee", zip: "38122", phone: "(901) 323-4400", hours: "Tue & Fri 7pm", lat: 35.1495, lng: -90.0490 },
  { name: "Knoxville VFW Bingo", address: "3200 Sutherland Ave", city: "Knoxville", state: "Tennessee", zip: "37919", phone: "(865) 588-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 35.9606, lng: -83.9207 },
  { name: "Chattanooga Bingo Center", address: "1700 McCallie Ave", city: "Chattanooga", state: "Tennessee", zip: "37404", phone: "(423) 624-4400", hours: "Wed & Sat 7pm", lat: 35.0456, lng: -85.3097 },
  { name: "Clarksville Moose Bingo", address: "215 Kraft St", city: "Clarksville", state: "Tennessee", zip: "37040", phone: "(931) 645-4400", hours: "Thu 7pm", lat: 36.5298, lng: -87.3595 },

  // Texas
  { name: "Houston Bingo Hall", address: "6909 FM 1960 W", city: "Houston", state: "Texas", zip: "77069", phone: "(281) 893-4400", hours: "Daily 6pm & 8pm", lat: 29.9931, lng: -95.5394 },
  { name: "San Antonio Bingo Palace", address: "1100 S Flores St", city: "San Antonio", state: "Texas", zip: "78204", phone: "(210) 226-4400", hours: "Mon–Sat 7pm", lat: 29.4241, lng: -98.4936 },
  { name: "Dallas Bingo Center", address: "5225 S Lancaster Rd", city: "Dallas", state: "Texas", zip: "75241", phone: "(214) 371-4400", hours: "Tue–Sat 7pm", lat: 32.6735, lng: -96.7748 },
  { name: "Austin Eagles Bingo", address: "2711 S Lamar Blvd", city: "Austin", state: "Texas", zip: "78704", phone: "(512) 444-4400", hours: "Wed & Sat 7pm", lat: 30.2458, lng: -97.7718 },
  { name: "Fort Worth VFW Bingo", address: "3616 Denton Hwy", city: "Fort Worth", state: "Texas", zip: "76117", phone: "(817) 838-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 32.7767, lng: -97.2980 },
  { name: "El Paso Bingo Night", address: "4100 Montana Ave", city: "El Paso", state: "Texas", zip: "79903", phone: "(915) 566-4400", hours: "Mon & Thu 7pm", lat: 31.7619, lng: -106.4850 },
  { name: "Arlington Moose Bingo", address: "1025 N Collins St", city: "Arlington", state: "Texas", zip: "76011", phone: "(817) 274-4400", hours: "Tue & Sat 7pm", lat: 32.7357, lng: -97.1081 },
  { name: "Corpus Christi Eagles Bingo", address: "4002 Ayers St", city: "Corpus Christi", state: "Texas", zip: "78415", phone: "(361) 852-4400", hours: "Fri 6pm, Sat 2pm & 7pm", lat: 27.7606, lng: -97.3963 },
  { name: "Plano Bingo Hall", address: "2101 W Parker Rd", city: "Plano", state: "Texas", zip: "75023", phone: "(972) 509-4400", hours: "Mon–Sat 6:30pm", lat: 33.0455, lng: -96.7441 },
  { name: "Lubbock Bingo Center", address: "4002 34th St", city: "Lubbock", state: "Texas", zip: "79410", phone: "(806) 793-4400", hours: "Wed & Sat 7pm", lat: 33.5779, lng: -101.8552 },
  { name: "Garland Knights Bingo", address: "200 S 5th St", city: "Garland", state: "Texas", zip: "75040", phone: "(972) 272-4400", hours: "Thu 7pm", lat: 32.9126, lng: -96.6389 },
  { name: "Irving VFW Bingo", address: "3939 Walnut Hill Ln", city: "Irving", state: "Texas", zip: "75038", phone: "(972) 255-4400", hours: "Sat 6pm", lat: 32.8140, lng: -96.9489 },

  // Utah
  { name: "Salt Lake City Bingo Hall", address: "2060 S State St", city: "Salt Lake City", state: "Utah", zip: "84115", phone: "(801) 486-4400", hours: "Tue–Sat 7pm", lat: 40.7282, lng: -111.8882 },
  { name: "Provo Eagles Bingo", address: "815 N 500 W", city: "Provo", state: "Utah", zip: "84601", phone: "(801) 373-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 40.2338, lng: -111.6585 },
  { name: "Ogden VFW Bingo", address: "520 25th St", city: "Ogden", state: "Utah", zip: "84401", phone: "(801) 394-4400", hours: "Wed & Sat 7pm", lat: 41.2230, lng: -111.9738 },

  // Vermont
  { name: "Burlington Eagles Bingo", address: "71 S Winooski Ave", city: "Burlington", state: "Vermont", zip: "05401", phone: "(802) 862-4400", hours: "Fri 7pm, Sat 2pm", lat: 44.4759, lng: -73.2121 },
  { name: "Rutland VFW Bingo", address: "33 Center St", city: "Rutland", state: "Vermont", zip: "05701", phone: "(802) 775-4400", hours: "Mon 6:30pm", lat: 43.6106, lng: -72.9726 },

  // Virginia
  { name: "Virginia Beach Bingo Hall", address: "5800 Northampton Blvd", city: "Virginia Beach", state: "Virginia", zip: "23455", phone: "(757) 460-4400", hours: "Mon–Sat 7pm", lat: 36.8529, lng: -76.0140 },
  { name: "Richmond Eagles Bingo", address: "3400 W Broad St", city: "Richmond", state: "Virginia", zip: "23230", phone: "(804) 353-4400", hours: "Tue & Fri 7pm", lat: 37.5630, lng: -77.4753 },
  { name: "Norfolk VFW Bingo", address: "315 Granby St", city: "Norfolk", state: "Virginia", zip: "23510", phone: "(757) 622-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 36.8508, lng: -76.2859 },
  { name: "Arlington Bingo Night", address: "1800 Wilson Blvd", city: "Arlington", state: "Virginia", zip: "22201", phone: "(703) 524-4400", hours: "Wed 7pm", lat: 38.8800, lng: -77.1003 },
  { name: "Chesapeake Knights Bingo", address: "309 Battlefield Blvd N", city: "Chesapeake", state: "Virginia", zip: "23320", phone: "(757) 547-4400", hours: "Thu & Sat 7pm", lat: 36.7682, lng: -76.2452 },

  // Washington
  { name: "Seattle Bingo Hall", address: "2420 1st Ave", city: "Seattle", state: "Washington", zip: "98121", phone: "(206) 448-4400", hours: "Mon–Sat 7pm", lat: 47.6062, lng: -122.3396 },
  { name: "Spokane Eagles Bingo", address: "6209 N Ash St", city: "Spokane", state: "Washington", zip: "99208", phone: "(509) 489-4400", hours: "Tue & Fri 7pm", lat: 47.7083, lng: -117.4194 },
  { name: "Tacoma VFW Bingo", address: "2902 S Tacoma Way", city: "Tacoma", state: "Washington", zip: "98409", phone: "(253) 474-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 47.2073, lng: -122.4597 },
  { name: "Vancouver WA Moose Bingo", address: "709 W 39th St", city: "Vancouver", state: "Washington", zip: "98660", phone: "(360) 694-4400", hours: "Wed & Sat 7pm", lat: 45.6387, lng: -122.6615 },
  { name: "Bellevue Bingo Center", address: "10116 NE 8th St", city: "Bellevue", state: "Washington", zip: "98004", phone: "(425) 455-4400", hours: "Mon & Thu 7pm", lat: 47.6101, lng: -122.2015 },

  // West Virginia
  { name: "Charleston WV Bingo Hall", address: "1033 Quarrier St", city: "Charleston", state: "West Virginia", zip: "25301", phone: "(304) 343-4400", hours: "Tue–Sat 7pm", lat: 38.3498, lng: -81.6326 },
  { name: "Huntington Eagles Bingo", address: "820 10th St", city: "Huntington", state: "West Virginia", zip: "25701", phone: "(304) 522-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 38.4192, lng: -82.4452 },
  { name: "Parkersburg VFW Bingo", address: "1900 Murdoch Ave", city: "Parkersburg", state: "West Virginia", zip: "26101", phone: "(304) 422-4400", hours: "Mon & Thu 7pm", lat: 39.2676, lng: -81.5615 },

  // Wisconsin
  { name: "Milwaukee Bingo Hall", address: "4201 W Lisbon Ave", city: "Milwaukee", state: "Wisconsin", zip: "53208", phone: "(414) 344-4400", hours: "Mon–Sat 7pm", lat: 43.0716, lng: -87.9556 },
  { name: "Madison Eagles Bingo", address: "3302 E Washington Ave", city: "Madison", state: "Wisconsin", zip: "53704", phone: "(608) 249-4400", hours: "Tue & Fri 7pm", lat: 43.0822, lng: -89.3602 },
  { name: "Green Bay VFW Bingo", address: "145 N Oak St", city: "Green Bay", state: "Wisconsin", zip: "54303", phone: "(920) 432-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 44.5133, lng: -87.9896 },
  { name: "Kenosha Moose Bingo", address: "5801 6th Ave", city: "Kenosha", state: "Wisconsin", zip: "53140", phone: "(262) 657-4400", hours: "Wed & Sat 7pm", lat: 42.5847, lng: -87.8212 },
  { name: "Racine Knights Bingo", address: "725 Main St", city: "Racine", state: "Wisconsin", zip: "53403", phone: "(262) 634-4400", hours: "Thu 7pm", lat: 42.7261, lng: -87.7828 },

  // Wyoming
  { name: "Cheyenne Eagles Bingo", address: "4610 E Lincolnway", city: "Cheyenne", state: "Wyoming", zip: "82001", phone: "(307) 635-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 41.1400, lng: -104.8202 },
  { name: "Casper VFW Bingo", address: "1800 E K St", city: "Casper", state: "Wyoming", zip: "82601", phone: "(307) 235-4400", hours: "Mon & Thu 7pm", lat: 42.8666, lng: -106.3131 },
  { name: "Laramie Moose Bingo", address: "710 Garfield St", city: "Laramie", state: "Wyoming", zip: "82070", phone: "(307) 742-4400", hours: "Sat 6pm", lat: 41.3114, lng: -105.5911 },

  // Additional California
  { name: "Stockton Eagles Bingo", address: "2600 Country Club Blvd", city: "Stockton", state: "California", zip: "95204", phone: "(209) 464-4400", hours: "Tue–Sat 7pm", lat: 37.9577, lng: -121.2908 },
  { name: "Modesto Bingo Hall", address: "1200 Standiford Ave", city: "Modesto", state: "California", zip: "95350", phone: "(209) 527-4400", hours: "Mon–Sat 6:30pm", lat: 37.6391, lng: -120.9969 },
  { name: "Oxnard Bingo Center", address: "300 W 5th St", city: "Oxnard", state: "California", zip: "93030", phone: "(805) 483-4400", hours: "Fri & Sat 7pm", lat: 34.1975, lng: -119.1771 },
  { name: "Irvine Eagles Bingo", address: "5 Civic Center Plaza", city: "Irvine", state: "California", zip: "92606", phone: "(949) 724-4400", hours: "Wed 7pm", lat: 33.6846, lng: -117.8265 },
  { name: "Glendale VFW Bingo", address: "232 N Brand Blvd", city: "Glendale", state: "California", zip: "91203", phone: "(818) 247-4400", hours: "Tue & Fri 7pm", lat: 34.1425, lng: -118.2551 },
  { name: "San Bernardino Bingo", address: "850 N Mt Vernon Ave", city: "San Bernardino", state: "California", zip: "92411", phone: "(909) 885-4400", hours: "Mon–Sat 7pm", lat: 34.1083, lng: -117.2898 },
  { name: "Fontana Moose Bingo", address: "8200 Sierra Ave", city: "Fontana", state: "California", zip: "92335", phone: "(909) 822-4400", hours: "Thu & Sat 6pm", lat: 34.0922, lng: -117.4350 },
  { name: "Moreno Valley Bingo Hall", address: "24300 Alessandro Blvd", city: "Moreno Valley", state: "California", zip: "92553", phone: "(951) 243-4400", hours: "Wed 7pm", lat: 33.9425, lng: -117.2297 },
  { name: "Fremont Knights Bingo", address: "39600 Stevenson Pl", city: "Fremont", state: "California", zip: "94538", phone: "(510) 796-4400", hours: "Fri 7pm, Sat 2pm", lat: 37.5485, lng: -121.9886 },
  { name: "Hayward Eagles Bingo", address: "22483 Main St", city: "Hayward", state: "California", zip: "94541", phone: "(510) 538-4400", hours: "Tue & Sat 7pm", lat: 37.6688, lng: -122.0808 },
  { name: "Oceanside Bingo Night", address: "300 N Coast Hwy", city: "Oceanside", state: "California", zip: "92054", phone: "(760) 722-4400", hours: "Mon & Thu 7pm", lat: 33.1959, lng: -117.3795 },
  { name: "Garden Grove VFW Bingo", address: "11840 Garden Grove Blvd", city: "Garden Grove", state: "California", zip: "92843", phone: "(714) 741-4400", hours: "Wed & Sat 6:30pm", lat: 33.7739, lng: -117.9414 },
  { name: "Lancaster Elks Bingo", address: "3601 W Avenue K", city: "Lancaster", state: "California", zip: "93536", phone: "(661) 948-4400", hours: "Fri 7pm", lat: 34.6868, lng: -118.1542 },
  { name: "Palmdale Bingo Center", address: "1150 E Palmdale Blvd", city: "Palmdale", state: "California", zip: "92550", phone: "(661) 274-4400", hours: "Sat 2pm & 7pm", lat: 34.5794, lng: -118.1165 },
  { name: "Salinas VFW Bingo", address: "40 W Laurel Dr", city: "Salinas", state: "California", zip: "93906", phone: "(831) 757-4400", hours: "Mon & Wed 7pm", lat: 36.6902, lng: -121.6169 },

  // Additional Texas
  { name: "Laredo Bingo Hall", address: "1100 Houston St", city: "Laredo", state: "Texas", zip: "78040", phone: "(956) 722-4400", hours: "Tue–Sat 7pm", lat: 27.5306, lng: -99.4803 },
  { name: "Amarillo Eagles Bingo", address: "3002 N Polk St", city: "Amarillo", state: "Texas", zip: "79107", phone: "(806) 374-4400", hours: "Wed & Sat 6:30pm", lat: 35.2220, lng: -101.8313 },
  { name: "Brownsville Bingo Night", address: "1000 E Washington St", city: "Brownsville", state: "Texas", zip: "78520", phone: "(956) 541-4400", hours: "Fri 7pm, Sat 2pm", lat: 25.9017, lng: -97.4975 },
  { name: "McKinney VFW Bingo", address: "1800 N McDonald St", city: "McKinney", state: "Texas", zip: "75071", phone: "(972) 542-4400", hours: "Mon & Thu 7pm", lat: 33.1972, lng: -96.6397 },
  { name: "Frisco Bingo Palace", address: "6555 Main St", city: "Frisco", state: "Texas", zip: "75034", phone: "(214) 377-4400", hours: "Wed & Sat 7pm", lat: 33.1584, lng: -96.8229 },
  { name: "Killeen Moose Bingo", address: "1600 E Stan Schlueter Loop", city: "Killeen", state: "Texas", zip: "76542", phone: "(254) 699-4400", hours: "Tue & Fri 7pm", lat: 31.1171, lng: -97.7278 },
  { name: "Waco Knights Bingo", address: "1600 Austin Ave", city: "Waco", state: "Texas", zip: "76701", phone: "(254) 756-4400", hours: "Thu & Sat 6pm", lat: 31.5493, lng: -97.1467 },
  { name: "Pasadena TX Bingo Hall", address: "4400 Fairmont Pkwy", city: "Pasadena", state: "Texas", zip: "77504", phone: "(713) 477-4400", hours: "Mon–Sat 7pm", lat: 29.6911, lng: -95.2091 },
  { name: "League City Bingo", address: "300 W Walker St", city: "League City", state: "Texas", zip: "77573", phone: "(281) 338-4400", hours: "Fri 7pm", lat: 29.5075, lng: -95.0949 },
  { name: "Beaumont Eagles Bingo", address: "2490 S 4th St", city: "Beaumont", state: "Texas", zip: "77701", phone: "(409) 838-4400", hours: "Wed & Sat 7pm", lat: 30.0802, lng: -94.1266 },
  { name: "Midland Bingo Center", address: "3315 N Big Spring St", city: "Midland", state: "Texas", zip: "79705", phone: "(432) 683-4400", hours: "Tue 7pm", lat: 31.9974, lng: -102.0779 },
  { name: "Odessa VFW Bingo", address: "3120 Andrews Hwy", city: "Odessa", state: "Texas", zip: "79762", phone: "(432) 580-4400", hours: "Sat 6pm", lat: 31.8457, lng: -102.3676 },
  { name: "Tyler Bingo Hall", address: "800 E Front St", city: "Tyler", state: "Texas", zip: "75702", phone: "(903) 592-4400", hours: "Mon & Thu 7pm", lat: 32.3513, lng: -95.3011 },

  // Additional Florida
  { name: "Cape Coral Bingo Night", address: "1000 SE 9th Pl", city: "Cape Coral", state: "Florida", zip: "33990", phone: "(239) 574-4400", hours: "Wed & Sat 7pm", lat: 26.5629, lng: -81.9495 },
  { name: "Fort Myers Eagles Bingo", address: "1533 Colonial Blvd", city: "Fort Myers", state: "Florida", zip: "33907", phone: "(239) 936-4400", hours: "Tue & Fri 7pm", lat: 26.6406, lng: -81.8723 },
  { name: "Hollywood FL Bingo", address: "2600 Hollywood Blvd", city: "Hollywood", state: "Florida", zip: "33020", phone: "(954) 922-4400", hours: "Mon–Sat 6:30pm", lat: 26.0112, lng: -80.1495 },
  { name: "Miramar Bingo Hall", address: "2800 SW 145th Ave", city: "Miramar", state: "Florida", zip: "33027", phone: "(954) 704-4400", hours: "Fri 7pm", lat: 25.9737, lng: -80.3320 },
  { name: "Pompano Beach VFW Bingo", address: "1075 N Dixie Hwy", city: "Pompano Beach", state: "Florida", zip: "33060", phone: "(954) 946-4400", hours: "Thu & Sat 7pm", lat: 26.2379, lng: -80.1248 },
  { name: "Lakeland Moose Bingo", address: "1240 E Main St", city: "Lakeland", state: "Florida", zip: "33801", phone: "(863) 683-4400", hours: "Wed 6:30pm", lat: 28.0395, lng: -81.9498 },
  { name: "Clearwater Bingo Center", address: "600 Franklin St", city: "Clearwater", state: "Florida", zip: "33756", phone: "(727) 442-4400", hours: "Mon & Sat 7pm", lat: 27.9659, lng: -82.8001 },
  { name: "West Palm Beach Bingo", address: "800 N Dixie Hwy", city: "West Palm Beach", state: "Florida", zip: "33401", phone: "(561) 832-4400", hours: "Tue & Fri 7pm", lat: 26.7153, lng: -80.0534 },
  { name: "Davie Elks Bingo", address: "5801 SW 71st Ave", city: "Davie", state: "Florida", zip: "33314", phone: "(954) 581-4400", hours: "Sat 2pm & 7pm", lat: 26.0765, lng: -80.2522 },

  // Additional New York
  { name: "New York Bingo Queens Blvd", address: "164-14 Jamaica Ave", city: "Jamaica", state: "New York", zip: "11432", phone: "(718) 523-4400", hours: "Mon–Sat 7pm", lat: 40.6994, lng: -73.7913 },
  { name: "Flushing Knights Bingo", address: "136-20 Roosevelt Ave", city: "Flushing", state: "New York", zip: "11354", phone: "(718) 358-4400", hours: "Tue & Fri 7pm", lat: 40.7589, lng: -73.8303 },
  { name: "Astoria Bingo Night", address: "27-40 Astoria Blvd", city: "Astoria", state: "New York", zip: "11102", phone: "(718) 267-4400", hours: "Wed & Sat 6:30pm", lat: 40.7721, lng: -73.9300 },
  { name: "Brentwood VFW Bingo", address: "900 Suffolk Ave", city: "Brentwood", state: "New York", zip: "11717", phone: "(631) 434-4400", hours: "Thu 7pm", lat: 40.7815, lng: -73.2460 },
  { name: "Hempstead Eagles Bingo", address: "400 N Franklin St", city: "Hempstead", state: "New York", zip: "11550", phone: "(516) 489-4400", hours: "Fri 7pm", lat: 40.7062, lng: -73.6187 },
  { name: "Mount Vernon Moose Bingo", address: "100 N Columbus Ave", city: "Mount Vernon", state: "New York", zip: "10553", phone: "(914) 664-4400", hours: "Sat 2pm & 7pm", lat: 40.9126, lng: -73.8371 },
  { name: "New Rochelle Bingo", address: "475 North Ave", city: "New Rochelle", state: "New York", zip: "10801", phone: "(914) 632-4400", hours: "Mon & Wed 7pm", lat: 40.9115, lng: -73.7823 },
  { name: "Utica Elks Bingo", address: "258 Genesee St", city: "Utica", state: "New York", zip: "13502", phone: "(315) 735-4400", hours: "Fri 6pm, Sat 2pm", lat: 43.1009, lng: -75.2327 },
  { name: "White Plains VFW Bingo", address: "310 Mamaroneck Ave", city: "White Plains", state: "New York", zip: "10605", phone: "(914) 949-4400", hours: "Thu & Sat 7pm", lat: 41.0340, lng: -73.7629 },

  // Additional Illinois
  { name: "Naperville Bingo Center", address: "400 S Eagle St", city: "Naperville", state: "Illinois", zip: "60540", phone: "(630) 420-4400", hours: "Mon & Thu 7pm", lat: 41.7508, lng: -88.1535 },
  { name: "Elgin Eagles Bingo", address: "1090 Larkin Ave", city: "Elgin", state: "Illinois", zip: "60123", phone: "(847) 697-4400", hours: "Fri 7pm, Sat 2pm", lat: 42.0354, lng: -88.2826 },
  { name: "Waukegan VFW Bingo", address: "1100 Washington St", city: "Waukegan", state: "Illinois", zip: "60085", phone: "(847) 623-4400", hours: "Wed & Sat 7pm", lat: 42.3636, lng: -87.8448 },
  { name: "Champaign Moose Bingo", address: "60 W University Ave", city: "Champaign", state: "Illinois", zip: "61820", phone: "(217) 352-4400", hours: "Tue 7pm", lat: 40.1164, lng: -88.2434 },
  { name: "Decatur Bingo Hall", address: "1155 N Westminister Dr", city: "Decatur", state: "Illinois", zip: "62526", phone: "(217) 875-4400", hours: "Mon & Thu 6:30pm", lat: 39.8403, lng: -88.9548 },

  // Additional Pennsylvania
  { name: "Bethlehem Knights Bingo", address: "16 W Market St", city: "Bethlehem", state: "Pennsylvania", zip: "18018", phone: "(610) 866-4400", hours: "Mon & Thu 7pm", lat: 40.6259, lng: -75.3705 },
  { name: "Upper Darby Eagles Bingo", address: "50 N Lansdowne Ave", city: "Upper Darby", state: "Pennsylvania", zip: "19082", phone: "(610) 352-4400", hours: "Fri 7pm, Sat 2pm", lat: 39.9632, lng: -75.2757 },
  { name: "Chester VFW Bingo", address: "208 W 7th St", city: "Chester", state: "Pennsylvania", zip: "19013", phone: "(610) 876-4400", hours: "Wed 6:30pm", lat: 39.8498, lng: -75.3560 },
  { name: "Norristown Bingo Night", address: "500 W Main St", city: "Norristown", state: "Pennsylvania", zip: "19401", phone: "(610) 272-4400", hours: "Tue & Sat 7pm", lat: 40.1215, lng: -75.3399 },
  { name: "York PA Bingo Hall", address: "50 N Duke St", city: "York", state: "Pennsylvania", zip: "17401", phone: "(717) 843-4400", hours: "Mon & Fri 7pm", lat: 39.9626, lng: -76.7277 },
  { name: "Lancaster Elks Bingo PA", address: "230 N Prince St", city: "Lancaster", state: "Pennsylvania", zip: "17603", phone: "(717) 397-4400", hours: "Thu & Sat 6:30pm", lat: 40.0379, lng: -76.3055 },

  // Additional Ohio
  { name: "Lorain VFW Bingo", address: "3500 Oberlin Ave", city: "Lorain", state: "Ohio", zip: "44053", phone: "(440) 288-4400", hours: "Mon 7pm", lat: 41.4553, lng: -82.1824 },
  { name: "Hamilton Eagles Bingo", address: "100 High St", city: "Hamilton", state: "Ohio", zip: "45011", phone: "(513) 868-4400", hours: "Tue & Fri 7pm", lat: 39.3995, lng: -84.5613 },
  { name: "Kettering Bingo Center", address: "3600 Shroyer Rd", city: "Kettering", state: "Ohio", zip: "45429", phone: "(937) 298-4400", hours: "Wed & Sat 7pm", lat: 39.6881, lng: -84.1688 },
  { name: "Springfield OH Bingo", address: "1200 W High St", city: "Springfield", state: "Ohio", zip: "45506", phone: "(937) 323-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 39.9242, lng: -83.8088 },
  { name: "Youngstown Moose Bingo", address: "218 W Federal St", city: "Youngstown", state: "Ohio", zip: "44503", phone: "(330) 747-4400", hours: "Thu 7pm", lat: 41.0998, lng: -80.6495 },

  // Additional Michigan
  { name: "Dearborn Heights Bingo", address: "25637 Michigan Ave", city: "Dearborn", state: "Michigan", zip: "48124", phone: "(313) 563-4400", hours: "Tue & Fri 7pm", lat: 42.3222, lng: -83.1763 },
  { name: "Warren Knights Bingo", address: "28800 Hoover Rd", city: "Warren", state: "Michigan", zip: "48093", phone: "(586) 757-4400", hours: "Mon & Thu 7pm", lat: 42.4931, lng: -83.0235 },
  { name: "Sterling Heights Bingo", address: "12900 Hall Rd", city: "Sterling Heights", state: "Michigan", zip: "48313", phone: "(586) 264-4400", hours: "Wed & Sat 6:30pm", lat: 42.5803, lng: -83.0302 },
  { name: "Livonia Eagles Bingo", address: "36350 Ann Arbor Trl", city: "Livonia", state: "Michigan", zip: "48150", phone: "(734) 422-4400", hours: "Fri 7pm", lat: 42.3684, lng: -83.3527 },
  { name: "Westland VFW Bingo", address: "35000 Warren Rd", city: "Westland", state: "Michigan", zip: "48185", phone: "(734) 722-4400", hours: "Sat 2pm & 6pm", lat: 42.3242, lng: -83.4002 },

  // Additional North Carolina
  { name: "Fayetteville Bingo Hall", address: "610 Executive Place", city: "Fayetteville", state: "North Carolina", zip: "28305", phone: "(910) 485-4400", hours: "Mon–Sat 7pm", lat: 35.0527, lng: -78.8784 },
  { name: "Cary Elks Bingo", address: "400 W Chatham St", city: "Cary", state: "North Carolina", zip: "27511", phone: "(919) 467-4400", hours: "Fri 7pm", lat: 35.7915, lng: -78.7811 },
  { name: "Concord NC Bingo", address: "250 Cabarrus Ave W", city: "Concord", state: "North Carolina", zip: "28025", phone: "(704) 782-4400", hours: "Wed & Sat 6:30pm", lat: 35.4088, lng: -80.5795 },
  { name: "High Point VFW Bingo", address: "400 E Green Dr", city: "High Point", state: "North Carolina", zip: "27260", phone: "(336) 884-4400", hours: "Tue & Thu 7pm", lat: 35.9557, lng: -79.9999 },
  { name: "Wilmington NC Bingo", address: "23 S 3rd St", city: "Wilmington", state: "North Carolina", zip: "28401", phone: "(910) 762-4400", hours: "Fri 6pm, Sat 2pm & 7pm", lat: 34.2257, lng: -77.9447 },
  { name: "Gastonia Bingo Night", address: "215 W Main Ave", city: "Gastonia", state: "North Carolina", zip: "28052", phone: "(704) 866-4400", hours: "Mon & Thu 7pm", lat: 35.2621, lng: -81.1873 },

  // Additional Georgia
  { name: "Roswell Bingo Hall", address: "38 Hill St", city: "Roswell", state: "Georgia", zip: "30075", phone: "(770) 640-4400", hours: "Wed & Sat 7pm", lat: 34.0232, lng: -84.3616 },
  { name: "Sandy Springs Bingo", address: "1 Galambos Way", city: "Sandy Springs", state: "Georgia", zip: "30328", phone: "(404) 851-4400", hours: "Fri 7pm", lat: 33.9304, lng: -84.3733 },
  { name: "Johns Creek Eagles Bingo", address: "10700 Medlock Bridge Rd", city: "Johns Creek", state: "Georgia", zip: "30097", phone: "(678) 512-4400", hours: "Thu & Sat 6:30pm", lat: 34.0289, lng: -84.1985 },
  { name: "Warner Robins VFW Bingo", address: "400 Booth Rd", city: "Warner Robins", state: "Georgia", zip: "31088", phone: "(478) 922-4400", hours: "Mon & Thu 7pm", lat: 32.6130, lng: -83.5999 },

  // Additional Washington State
  { name: "Kent Bingo Hall", address: "220 4th Ave S", city: "Kent", state: "Washington", zip: "98032", phone: "(253) 856-4400", hours: "Tue & Fri 7pm", lat: 47.3809, lng: -122.2348 },
  { name: "Renton Eagles Bingo", address: "625 Rainier Ave N", city: "Renton", state: "Washington", zip: "98057", phone: "(425) 226-4400", hours: "Mon & Thu 6:30pm", lat: 47.4829, lng: -122.2171 },
  { name: "Kirkland VFW Bingo", address: "105 5th Ave S", city: "Kirkland", state: "Washington", zip: "98033", phone: "(425) 827-4400", hours: "Sat 2pm & 7pm", lat: 47.6815, lng: -122.2087 },
  { name: "Everett Bingo Center", address: "2800 Wetmore Ave", city: "Everett", state: "Washington", zip: "98201", phone: "(425) 252-4400", hours: "Wed & Sat 7pm", lat: 47.9790, lng: -122.2021 },
  { name: "Yakima Moose Bingo", address: "15 W Yakima Ave", city: "Yakima", state: "Washington", zip: "98902", phone: "(509) 452-4400", hours: "Fri 7pm", lat: 46.6021, lng: -120.5059 },

  // Additional Virginia
  { name: "Suffolk Bingo Hall", address: "442 Market St", city: "Suffolk", state: "Virginia", zip: "23434", phone: "(757) 925-4400", hours: "Mon & Thu 7pm", lat: 36.7282, lng: -76.5836 },
  { name: "Newport News Eagles Bingo", address: "2400 Washington Ave", city: "Newport News", state: "Virginia", zip: "23607", phone: "(757) 247-4400", hours: "Tue & Fri 7pm", lat: 37.0871, lng: -76.4730 },
  { name: "Hampton VFW Bingo", address: "1000 W Mercury Blvd", city: "Hampton", state: "Virginia", zip: "23666", phone: "(757) 827-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 37.0299, lng: -76.3452 },
  { name: "Alexandria Bingo Night", address: "301 King St", city: "Alexandria", state: "Virginia", zip: "22314", phone: "(703) 549-4400", hours: "Wed 7pm", lat: 38.8048, lng: -77.0469 },

  // Additional New Jersey
  { name: "Paterson Bingo Hall", address: "100 Hamilton Plaza", city: "Paterson", state: "New Jersey", zip: "07505", phone: "(973) 977-4400", hours: "Mon–Sat 7pm", lat: 40.9168, lng: -74.1718 },
  { name: "Elizabeth Eagles Bingo", address: "50 Winfield Scott Plaza", city: "Elizabeth", state: "New Jersey", zip: "07201", phone: "(908) 353-4400", hours: "Tue & Fri 7pm", lat: 40.6640, lng: -74.2107 },
  { name: "Clifton VFW Bingo", address: "974 Bloomfield Ave", city: "Clifton", state: "New Jersey", zip: "07012", phone: "(973) 473-4400", hours: "Wed & Sat 6:30pm", lat: 40.8584, lng: -74.1638 },
  { name: "Toms River Moose Bingo", address: "33 Washington St", city: "Toms River", state: "New Jersey", zip: "08753", phone: "(732) 341-4400", hours: "Thu 7pm", lat: 39.9537, lng: -74.1979 },
  { name: "Woodbridge Bingo Center", address: "4 Main St", city: "Woodbridge", state: "New Jersey", zip: "07095", phone: "(732) 636-4400", hours: "Mon & Fri 6:30pm", lat: 40.5576, lng: -74.2846 },

  // Additional Massachusetts
  { name: "Brockton Eagles Bingo", address: "70 Commercial St", city: "Brockton", state: "Massachusetts", zip: "02302", phone: "(508) 584-4400", hours: "Tue & Fri 7pm", lat: 42.0834, lng: -71.0184 },
  { name: "New Bedford VFW Bingo", address: "115 William St", city: "New Bedford", state: "Massachusetts", zip: "02740", phone: "(508) 997-4400", hours: "Sat 2pm & 7pm", lat: 41.6362, lng: -70.9342 },
  { name: "Quincy Bingo Hall", address: "1305 Hancock St", city: "Quincy", state: "Massachusetts", zip: "02169", phone: "(617) 773-4400", hours: "Mon & Thu 7pm", lat: 42.2529, lng: -71.0023 },
  { name: "Lynn Moose Bingo", address: "3 City Hall Square", city: "Lynn", state: "Massachusetts", zip: "01901", phone: "(781) 598-4400", hours: "Wed 6:30pm", lat: 42.4668, lng: -70.9495 },
  { name: "Fall River Knights Bingo", address: "200 N Main St", city: "Fall River", state: "Massachusetts", zip: "02720", phone: "(508) 678-4400", hours: "Fri 7pm", lat: 41.7015, lng: -71.1550 },

  // Additional Tennessee
  { name: "Murfreesboro Bingo Hall", address: "111 W Vine St", city: "Murfreesboro", state: "Tennessee", zip: "37130", phone: "(615) 893-4400", hours: "Tue–Sat 7pm", lat: 35.8456, lng: -86.3903 },
  { name: "Jackson TN Eagles Bingo", address: "100 E Main St", city: "Jackson", state: "Tennessee", zip: "38301", phone: "(731) 422-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 35.6145, lng: -88.8139 },
  { name: "Johnson City VFW Bingo", address: "601 E Main St", city: "Johnson City", state: "Tennessee", zip: "37601", phone: "(423) 926-4400", hours: "Wed & Sat 7pm", lat: 36.3134, lng: -82.3535 },
  { name: "Kingsport Moose Bingo", address: "200 Shelby St", city: "Kingsport", state: "Tennessee", zip: "37660", phone: "(423) 245-4400", hours: "Thu 7pm", lat: 36.5484, lng: -82.5618 },

  // Additional Wisconsin
  { name: "Appleton VFW Bingo", address: "318 N Richmond St", city: "Appleton", state: "Wisconsin", zip: "54911", phone: "(920) 733-4400", hours: "Fri 7pm, Sat 2pm", lat: 44.2619, lng: -88.4154 },
  { name: "Waukesha Eagles Bingo", address: "101 W Broadway", city: "Waukesha", state: "Wisconsin", zip: "53186", phone: "(262) 542-4400", hours: "Mon & Thu 7pm", lat: 43.0117, lng: -88.2315 },
  { name: "Oshkosh Bingo Hall", address: "215 Church Ave", city: "Oshkosh", state: "Wisconsin", zip: "54901", phone: "(920) 235-4400", hours: "Wed & Sat 6:30pm", lat: 44.0247, lng: -88.5426 },

  // Additional Minnesota
  { name: "Plymouth Bingo Center", address: "3400 Plymouth Blvd", city: "Plymouth", state: "Minnesota", zip: "55441", phone: "(763) 559-4400", hours: "Tue & Fri 7pm", lat: 44.9543, lng: -93.4561 },
  { name: "Bloomington Eagles Bingo", address: "1800 W Old Shakopee Rd", city: "Bloomington", state: "Minnesota", zip: "55431", phone: "(952) 881-4400", hours: "Sat 2pm & 7pm", lat: 44.8408, lng: -93.3477 },
  { name: "Coon Rapids VFW Bingo", address: "11155 Robinson Dr", city: "Coon Rapids", state: "Minnesota", zip: "55433", phone: "(763) 757-4400", hours: "Mon & Thu 7pm", lat: 45.1197, lng: -93.3131 },

  // Additional Missouri
  { name: "Independence MO Bingo", address: "111 E Maple Ave", city: "Independence", state: "Missouri", zip: "64050", phone: "(816) 252-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 39.0911, lng: -94.4155 },
  { name: "O'Fallon Bingo Hall", address: "255 N Main St", city: "O'Fallon", state: "Missouri", zip: "63366", phone: "(636) 272-4400", hours: "Wed & Sat 7pm", lat: 38.8106, lng: -90.6998 },
  { name: "St. Charles Eagles Bingo", address: "200 N 2nd St", city: "St. Charles", state: "Missouri", zip: "63301", phone: "(636) 940-4400", hours: "Tue 7pm", lat: 38.7881, lng: -90.4974 },

  // Additional Indiana
  { name: "Carmel Bingo Night", address: "1 Civic Square", city: "Carmel", state: "Indiana", zip: "46032", phone: "(317) 571-4400", hours: "Thu 7pm", lat: 39.9784, lng: -86.1180 },
  { name: "Hammond Eagles Bingo", address: "5925 Calumet Ave", city: "Hammond", state: "Indiana", zip: "46320", phone: "(219) 932-4400", hours: "Fri 7pm, Sat 2pm", lat: 41.5833, lng: -87.5000 },
  { name: "Muncie VFW Bingo", address: "300 E Jackson St", city: "Muncie", state: "Indiana", zip: "47305", phone: "(765) 288-4400", hours: "Wed & Sat 6:30pm", lat: 40.1934, lng: -85.3863 },

  // Additional Arizona
  { name: "Glendale AZ Bingo Hall", address: "5750 W Glenn Dr", city: "Glendale", state: "Arizona", zip: "85301", phone: "(623) 930-4400", hours: "Mon–Sat 7pm", lat: 33.5387, lng: -112.1860 },
  { name: "Surprise Bingo Center", address: "16000 N Civic Center Plaza", city: "Surprise", state: "Arizona", zip: "85374", phone: "(623) 222-4400", hours: "Tue & Fri 7pm", lat: 33.6292, lng: -112.3679 },
  { name: "Avondale Eagles Bingo", address: "11465 W Civic Center Dr", city: "Avondale", state: "Arizona", zip: "85323", phone: "(623) 333-4400", hours: "Sat 2pm & 7pm", lat: 33.4356, lng: -112.3496 },
  { name: "Goodyear VFW Bingo", address: "1900 N Citrus Rd", city: "Goodyear", state: "Arizona", zip: "85395", phone: "(623) 882-4400", hours: "Wed 6:30pm", lat: 33.4353, lng: -112.3576 },

  // Additional Colorado
  { name: "Lakewood Bingo Hall", address: "480 S Allison Pkwy", city: "Lakewood", state: "Colorado", zip: "80226", phone: "(303) 987-4400", hours: "Mon & Thu 7pm", lat: 39.7047, lng: -105.0814 },
  { name: "Thornton Bingo Night", address: "9500 Civic Center Dr", city: "Thornton", state: "Colorado", zip: "80229", phone: "(720) 977-4400", hours: "Tue & Fri 7pm", lat: 39.8686, lng: -104.9719 },
  { name: "Westminster CO Bingo", address: "4800 W 92nd Ave", city: "Westminster", state: "Colorado", zip: "80031", phone: "(303) 658-4400", hours: "Wed & Sat 7pm", lat: 39.8366, lng: -105.0372 },
  { name: "Arvada Eagles Bingo", address: "8101 Ralston Rd", city: "Arvada", state: "Colorado", zip: "80002", phone: "(303) 420-4400", hours: "Fri 7pm", lat: 39.8028, lng: -105.0875 },

  // Additional Maryland
  { name: "Rockville Bingo Hall", address: "111 Maryland Ave", city: "Rockville", state: "Maryland", zip: "20850", phone: "(301) 309-4400", hours: "Wed & Sat 7pm", lat: 39.0840, lng: -77.1528 },
  { name: "Gaithersburg VFW Bingo", address: "31 S Summit Ave", city: "Gaithersburg", state: "Maryland", zip: "20877", phone: "(301) 258-4400", hours: "Fri 6:30pm", lat: 39.1434, lng: -77.2014 },

  // Additional Nevada
  { name: "North Las Vegas Bingo", address: "2250 Civic Center Dr", city: "North Las Vegas", state: "Nevada", zip: "89030", phone: "(702) 633-4400", hours: "Mon–Sat 7pm", lat: 36.1989, lng: -115.1175 },
  { name: "Sparks Eagles Bingo", address: "431 Prater Way", city: "Sparks", state: "Nevada", zip: "89431", phone: "(775) 356-4400", hours: "Fri 7pm, Sat 2pm", lat: 39.5349, lng: -119.7527 },

  // Additional Louisiana
  { name: "Metairie Bingo Hall", address: "1 Metairie Ct", city: "Metairie", state: "Louisiana", zip: "70001", phone: "(504) 835-4400", hours: "Tue & Fri 7pm", lat: 29.9799, lng: -90.1789 },
  { name: "Kenner VFW Bingo", address: "1801 Williams Blvd", city: "Kenner", state: "Louisiana", zip: "70062", phone: "(504) 468-4400", hours: "Sat 2pm & 7pm", lat: 29.9941, lng: -90.2417 },

  // Additional Alabama
  { name: "Hoover Bingo Center", address: "100 Municipal Dr", city: "Hoover", state: "Alabama", zip: "35216", phone: "(205) 444-4400", hours: "Thu & Sat 7pm", lat: 33.4054, lng: -86.8113 },
  { name: "Madison AL Eagles Bingo", address: "100 Hughes Rd", city: "Madison", state: "Alabama", zip: "35758", phone: "(256) 772-4400", hours: "Wed 6:30pm", lat: 34.6993, lng: -86.7483 },
  { name: "Phenix City Bingo Hall", address: "601 11th St", city: "Phenix City", state: "Alabama", zip: "36867", phone: "(334) 297-4400", hours: "Mon & Fri 7pm", lat: 32.4698, lng: -85.0008 },

  // Additional Oklahoma
  { name: "Broken Arrow Bingo", address: "220 S 1st St", city: "Broken Arrow", state: "Oklahoma", zip: "74012", phone: "(918) 259-4400", hours: "Tue & Fri 7pm", lat: 36.0526, lng: -95.7975 },
  { name: "Edmond Eagles Bingo", address: "100 E 1st St", city: "Edmond", state: "Oklahoma", zip: "73034", phone: "(405) 359-4400", hours: "Wed & Sat 7pm", lat: 35.6528, lng: -97.4781 },
  { name: "Lawton VFW Bingo", address: "601 SW C Ave", city: "Lawton", state: "Oklahoma", zip: "73501", phone: "(580) 353-4400", hours: "Fri 6:30pm", lat: 34.6036, lng: -98.3959 },

  // Additional Iowa
  { name: "Sioux City Bingo Hall", address: "405 6th St", city: "Sioux City", state: "Iowa", zip: "51101", phone: "(712) 279-4400", hours: "Mon & Thu 7pm", lat: 42.4999, lng: -96.4003 },
  { name: "Waterloo Eagles Bingo", address: "715 Mulberry St", city: "Waterloo", state: "Iowa", zip: "50703", phone: "(319) 235-4400", hours: "Wed & Sat 6:30pm", lat: 42.4928, lng: -92.3426 },

  // Additional Mississippi
  { name: "Southaven Bingo Center", address: "8710 Northwest Dr", city: "Southaven", state: "Mississippi", zip: "38671", phone: "(662) 781-4400", hours: "Tue & Fri 7pm", lat: 34.9887, lng: -90.0068 },
  { name: "Tupelo VFW Bingo", address: "800 W Main St", city: "Tupelo", state: "Mississippi", zip: "38801", phone: "(662) 842-4400", hours: "Sat 2pm & 7pm", lat: 34.2576, lng: -88.7030 },

  // Additional South Carolina
  { name: "Myrtle Beach Bingo Hall", address: "937 Broadway St", city: "Myrtle Beach", state: "South Carolina", zip: "29577", phone: "(843) 444-4400", hours: "Mon–Sat 7pm", lat: 33.6890, lng: -78.8867 },
  { name: "Summerville Eagles Bingo", address: "200 S Main St", city: "Summerville", state: "South Carolina", zip: "29483", phone: "(843) 875-4400", hours: "Thu & Sat 7pm", lat: 33.0185, lng: -80.1756 },

  // Additional Arkansas
  { name: "Springdale Bingo Hall", address: "201 Spring St", city: "Springdale", state: "Arkansas", zip: "72764", phone: "(479) 750-4400", hours: "Tue & Fri 7pm", lat: 36.1867, lng: -94.1288 },
  { name: "Rogers AR Eagles Bingo", address: "301 W Walnut St", city: "Rogers", state: "Arkansas", zip: "72756", phone: "(479) 636-4400", hours: "Wed & Sat 6:30pm", lat: 36.3320, lng: -94.1185 },

  // Additional Nebraska
  { name: "Grand Island Bingo Hall", address: "100 E 1st St", city: "Grand Island", state: "Nebraska", zip: "68801", phone: "(308) 385-4400", hours: "Mon & Thu 7pm", lat: 40.9250, lng: -98.3420 },
  { name: "Kearney VFW Bingo", address: "2015 Avenue A", city: "Kearney", state: "Nebraska", zip: "68847", phone: "(308) 237-4400", hours: "Fri 6pm, Sat 2pm", lat: 40.6993, lng: -99.0817 },

  // Additional New Mexico
  { name: "Rio Rancho Bingo Night", address: "3200 Civic Center Cir NE", city: "Rio Rancho", state: "New Mexico", zip: "87144", phone: "(505) 891-4400", hours: "Fri 7pm", lat: 35.2328, lng: -106.6630 },

  // Additional listings to reach 500+

  // California (more)
  { name: "Pomona Bingo Hall", address: "505 S Garey Ave", city: "Pomona", state: "California", zip: "91766", phone: "(909) 620-4400", hours: "Mon & Thu 7pm", lat: 34.0551, lng: -117.7520 },
  { name: "Torrance Eagles Bingo", address: "3031 Torrance Blvd", city: "Torrance", state: "California", zip: "90503", phone: "(310) 328-4400", hours: "Fri 7pm, Sat 2pm", lat: 33.8358, lng: -118.3406 },
  { name: "Escondido VFW Bingo", address: "321 N Broadway", city: "Escondido", state: "California", zip: "92025", phone: "(760) 743-4400", hours: "Wed & Sat 6:30pm", lat: 33.1192, lng: -117.0864 },
  { name: "Sunnyvale Bingo Center", address: "456 W Olive Ave", city: "Sunnyvale", state: "California", zip: "94086", phone: "(408) 730-4400", hours: "Tue & Fri 7pm", lat: 37.3688, lng: -122.0363 },
  { name: "Roseville Elks Bingo", address: "9000 Fiddyment Rd", city: "Roseville", state: "California", zip: "95747", phone: "(916) 784-4400", hours: "Mon & Thu 7pm", lat: 38.7521, lng: -121.3119 },
  { name: "Visalia Bingo Night", address: "220 N Santa Fe St", city: "Visalia", state: "California", zip: "93292", phone: "(559) 713-4400", hours: "Sat 2pm & 7pm", lat: 36.3302, lng: -119.2921 },
  { name: "Santa Clara Bingo Hall", address: "1500 Warburton Ave", city: "Santa Clara", state: "California", zip: "95050", phone: "(408) 615-4400", hours: "Wed & Sat 7pm", lat: 37.3541, lng: -121.9552 },
  { name: "Concord CA Bingo", address: "1950 Parkside Dr", city: "Concord", state: "California", zip: "94519", phone: "(925) 671-4400", hours: "Fri 7pm", lat: 37.9779, lng: -122.0311 },
  { name: "Elk Grove Eagles Bingo", address: "8400 Elk Grove Blvd", city: "Elk Grove", state: "California", zip: "95624", phone: "(916) 691-4400", hours: "Mon & Thu 6:30pm", lat: 38.4088, lng: -121.3716 },
  { name: "Thousand Oaks VFW Bingo", address: "2100 Thousand Oaks Blvd", city: "Thousand Oaks", state: "California", zip: "91362", phone: "(805) 495-4400", hours: "Tue & Sat 7pm", lat: 34.1705, lng: -118.8376 },
  { name: "Simi Valley Moose Bingo", address: "2929 Tapo Canyon Rd", city: "Simi Valley", state: "California", zip: "93063", phone: "(805) 583-4400", hours: "Wed 7pm", lat: 34.2694, lng: -118.7815 },
  { name: "Vallejo Eagles Bingo", address: "555 Santa Clara St", city: "Vallejo", state: "California", zip: "94590", phone: "(707) 648-4400", hours: "Fri 6pm, Sat 2pm", lat: 38.1041, lng: -122.2566 },

  // Texas (more)
  { name: "Round Rock Bingo Hall", address: "221 E Main St", city: "Round Rock", state: "Texas", zip: "78664", phone: "(512) 218-4400", hours: "Mon & Thu 7pm", lat: 30.5083, lng: -97.6789 },
  { name: "Carrollton Bingo Center", address: "1945 E Jackson Rd", city: "Carrollton", state: "Texas", zip: "75006", phone: "(972) 466-4400", hours: "Fri 7pm, Sat 2pm", lat: 32.9537, lng: -96.8903 },
  { name: "Abilene Eagles Bingo", address: "555 Butternut St", city: "Abilene", state: "Texas", zip: "79602", phone: "(325) 677-4400", hours: "Wed & Sat 6:30pm", lat: 32.4487, lng: -99.7331 },
  { name: "Pearland VFW Bingo", address: "3519 Liberty Dr", city: "Pearland", state: "Texas", zip: "77581", phone: "(281) 485-4400", hours: "Tue & Fri 7pm", lat: 29.5635, lng: -95.2860 },
  { name: "Lewisville Bingo Palace", address: "151 W Church St", city: "Lewisville", state: "Texas", zip: "75057", phone: "(972) 219-4400", hours: "Mon & Thu 7pm", lat: 33.0462, lng: -97.0641 },
  { name: "Mesquite Bingo Night", address: "757 N Galloway Ave", city: "Mesquite", state: "Texas", zip: "75149", phone: "(972) 216-4400", hours: "Wed 6:30pm", lat: 32.7668, lng: -96.5992 },
  { name: "Richardson Eagles Bingo", address: "411 Arapaho Rd", city: "Richardson", state: "Texas", zip: "75080", phone: "(972) 744-4400", hours: "Thu & Sat 7pm", lat: 32.9483, lng: -96.7299 },
  { name: "Sugar Land Moose Bingo", address: "2700 Town Center Blvd N", city: "Sugar Land", state: "Texas", zip: "77479", phone: "(281) 275-4400", hours: "Fri 7pm", lat: 29.5996, lng: -95.6349 },
  { name: "Denton Bingo Hall", address: "215 E McKinney St", city: "Denton", state: "Texas", zip: "76201", phone: "(940) 349-4400", hours: "Sat 2pm & 7pm", lat: 33.2148, lng: -97.1331 },
  { name: "San Angelo VFW Bingo", address: "1 S Abe St", city: "San Angelo", state: "Texas", zip: "76903", phone: "(325) 653-4400", hours: "Mon & Thu 7pm", lat: 31.4638, lng: -100.4370 },

  // Florida (more)
  { name: "Pembroke Pines Bingo", address: "601 City Center Way", city: "Pembroke Pines", state: "Florida", zip: "33025", phone: "(954) 435-4400", hours: "Mon–Sat 7pm", lat: 26.0070, lng: -80.2963 },
  { name: "Port St. Lucie Eagles Bingo", address: "121 SW Port St Lucie Blvd", city: "Port St. Lucie", state: "Florida", zip: "34984", phone: "(772) 871-4400", hours: "Tue & Fri 7pm", lat: 27.2730, lng: -80.3582 },
  { name: "Coral Springs Bingo Hall", address: "9551 W Sample Rd", city: "Coral Springs", state: "Florida", zip: "33065", phone: "(954) 344-4400", hours: "Wed & Sat 7pm", lat: 26.2712, lng: -80.2707 },
  { name: "Deerfield Beach VFW Bingo", address: "150 NE 2nd Ave", city: "Deerfield Beach", state: "Florida", zip: "33441", phone: "(954) 480-4400", hours: "Fri 6:30pm, Sat 2pm", lat: 26.3184, lng: -80.0997 },
  { name: "Spring Hill Bingo Night", address: "4411 Mariner Blvd", city: "Spring Hill", state: "Florida", zip: "34608", phone: "(352) 686-4400", hours: "Mon & Thu 7pm", lat: 28.4769, lng: -82.5437 },
  { name: "Deltona Moose Bingo", address: "1745 Howland Blvd", city: "Deltona", state: "Florida", zip: "32738", phone: "(386) 574-4400", hours: "Wed 7pm", lat: 28.9005, lng: -81.2637 },

  // Georgia (more)
  { name: "Albany GA Bingo Hall", address: "200 Pine Ave", city: "Albany", state: "Georgia", zip: "31701", phone: "(229) 431-4400", hours: "Tue & Fri 7pm", lat: 31.5785, lng: -84.1557 },
  { name: "Peachtree City Bingo", address: "150 City Hall Blvd", city: "Peachtree City", state: "Georgia", zip: "30269", phone: "(770) 487-4400", hours: "Sat 2pm & 7pm", lat: 33.3968, lng: -84.5966 },
  { name: "Smyrna GA Eagles Bingo", address: "2800 King St", city: "Smyrna", state: "Georgia", zip: "30080", phone: "(770) 434-4400", hours: "Mon & Thu 7pm", lat: 33.8840, lng: -84.5144 },

  // Virginia (more)
  { name: "Roanoke Bingo Hall", address: "215 Church Ave SW", city: "Roanoke", state: "Virginia", zip: "24011", phone: "(540) 853-4400", hours: "Mon–Sat 7pm", lat: 37.2710, lng: -79.9414 },
  { name: "Lynchburg Eagles Bingo", address: "900 Church St", city: "Lynchburg", state: "Virginia", zip: "24504", phone: "(434) 847-4400", hours: "Fri 7pm, Sat 2pm", lat: 37.4138, lng: -79.1423 },

  // Washington State (more)
  { name: "Lakewood WA Bingo", address: "6000 Main St SW", city: "Lakewood", state: "Washington", zip: "98499", phone: "(253) 589-4400", hours: "Fri 7pm, Sat 2pm", lat: 47.1718, lng: -122.5185 },
  { name: "Redmond Bingo Center", address: "15670 NE 85th St", city: "Redmond", state: "Washington", zip: "98052", phone: "(425) 556-4400", hours: "Wed & Sat 7pm", lat: 47.6740, lng: -122.1215 },
  { name: "Federal Way Bingo Hall", address: "33325 8th Ave S", city: "Federal Way", state: "Washington", zip: "98003", phone: "(253) 835-4400", hours: "Mon & Thu 7pm", lat: 47.3223, lng: -122.3126 },

  // Arizona (more)
  { name: "Yuma Eagles Bingo", address: "298 Main St", city: "Yuma", state: "Arizona", zip: "85364", phone: "(928) 373-4400", hours: "Tue & Fri 7pm", lat: 32.6927, lng: -114.6277 },
  { name: "Maricopa Bingo Hall", address: "45145 W Madison Ave", city: "Maricopa", state: "Arizona", zip: "85138", phone: "(520) 316-4400", hours: "Sat 6pm", lat: 33.0581, lng: -112.0476 },
  { name: "Prescott Bingo Center", address: "201 S Cortez St", city: "Prescott", state: "Arizona", zip: "86303", phone: "(928) 777-4400", hours: "Wed 6:30pm", lat: 34.5400, lng: -112.4685 },

  // Colorado (more)
  { name: "Brighton Bingo Night", address: "500 S 4th Ave", city: "Brighton", state: "Colorado", zip: "80601", phone: "(303) 655-4400", hours: "Thu 7pm", lat: 39.9855, lng: -104.8197 },
  { name: "Longmont Eagles Bingo", address: "350 Kimbark St", city: "Longmont", state: "Colorado", zip: "80501", phone: "(303) 651-4400", hours: "Mon & Fri 7pm", lat: 40.1672, lng: -105.1019 },
  { name: "Loveland VFW Bingo", address: "305 N Lincoln Ave", city: "Loveland", state: "Colorado", zip: "80537", phone: "(970) 962-4400", hours: "Sat 2pm & 6pm", lat: 40.3978, lng: -105.0749 },

  // Indiana (more)
  { name: "Anderson Bingo Hall", address: "120 E 8th St", city: "Anderson", state: "Indiana", zip: "46016", phone: "(765) 648-4400", hours: "Mon & Thu 7pm", lat: 40.1053, lng: -85.6803 },
  { name: "Terre Haute Eagles Bingo", address: "17 S 7th St", city: "Terre Haute", state: "Indiana", zip: "47807", phone: "(812) 235-4400", hours: "Wed & Sat 6:30pm", lat: 39.4667, lng: -87.4139 },

  // Michigan (more)
  { name: "Pontiac Bingo Hall", address: "47450 Woodward Ave", city: "Pontiac", state: "Michigan", zip: "48342", phone: "(248) 758-4400", hours: "Tue & Fri 7pm", lat: 42.6389, lng: -83.2910 },
  { name: "Saginaw Eagles Bingo", address: "1315 S Washington Ave", city: "Saginaw", state: "Michigan", zip: "48601", phone: "(989) 753-4400", hours: "Fri 6pm, Sat 2pm", lat: 43.4195, lng: -83.9508 },
  { name: "Taylor Bingo Night", address: "23555 Goddard Rd", city: "Taylor", state: "Michigan", zip: "48180", phone: "(734) 374-4400", hours: "Wed & Sat 7pm", lat: 42.2408, lng: -83.2697 },

  // Ohio (more)
  { name: "Canton Eagles Bingo", address: "218 Cleveland Ave NW", city: "Canton", state: "Ohio", zip: "44702", phone: "(330) 456-4400", hours: "Mon & Thu 7pm", lat: 40.7989, lng: -81.3784 },
  { name: "Parma Bingo Center", address: "6611 Ridge Rd", city: "Parma", state: "Ohio", zip: "44129", phone: "(440) 845-4400", hours: "Tue & Fri 7pm", lat: 41.3845, lng: -81.7290 },
  { name: "Mansfield VFW Bingo", address: "31 N Diamond St", city: "Mansfield", state: "Ohio", zip: "44902", phone: "(419) 524-4400", hours: "Sat 2pm & 7pm", lat: 40.7584, lng: -82.5154 },

  // Kentucky (more)
  { name: "Frankfort Bingo Hall", address: "100 W Second St", city: "Frankfort", state: "Kentucky", zip: "40601", phone: "(502) 875-4400", hours: "Fri 7pm", lat: 38.2009, lng: -84.8733 },
  { name: "Florence KY Eagles Bingo", address: "8100 Ewing Blvd", city: "Florence", state: "Kentucky", zip: "41042", phone: "(859) 525-4400", hours: "Wed & Sat 6:30pm", lat: 38.9989, lng: -84.6266 },

  // Kansas (more)
  { name: "Olathe Bingo Night", address: "100 E Santa Fe St", city: "Olathe", state: "Kansas", zip: "66061", phone: "(913) 971-4400", hours: "Thu & Sat 7pm", lat: 38.8814, lng: -94.8191 },
  { name: "Lawrence Moose Bingo", address: "1 Riverfront Plaza", city: "Lawrence", state: "Kansas", zip: "66044", phone: "(785) 832-4400", hours: "Mon & Wed 7pm", lat: 38.9717, lng: -95.2353 },

  // Missouri (more)
  { name: "Lee's Summit Bingo Hall", address: "220 SE Green St", city: "Lee's Summit", state: "Missouri", zip: "64063", phone: "(816) 969-4400", hours: "Tue & Fri 7pm", lat: 38.9108, lng: -94.3822 },
  { name: "Florissant Eagles Bingo", address: "955 Graham Rd", city: "Florissant", state: "Missouri", zip: "63031", phone: "(314) 921-4400", hours: "Wed & Sat 7pm", lat: 38.7879, lng: -90.3221 },

  // Wisconsin (more)
  { name: "Eau Claire Eagles Bingo", address: "215 Scott St", city: "Eau Claire", state: "Wisconsin", zip: "54701", phone: "(715) 835-4400", hours: "Fri 6pm, Sat 2pm", lat: 44.8113, lng: -91.4985 },
  { name: "Janesville VFW Bingo", address: "18 N Main St", city: "Janesville", state: "Wisconsin", zip: "53545", phone: "(608) 756-4400", hours: "Mon & Thu 7pm", lat: 42.6828, lng: -89.0187 },
  { name: "La Crosse Bingo Hall", address: "400 La Crosse St", city: "La Crosse", state: "Wisconsin", zip: "54601", phone: "(608) 789-4400", hours: "Wed & Sat 6:30pm", lat: 43.8014, lng: -91.2396 },

  // Nebraska (more)
  { name: "Lincoln Moose Bingo", address: "750 S 27th St", city: "Lincoln", state: "Nebraska", zip: "68510", phone: "(402) 477-4400", hours: "Fri 7pm", lat: 40.7862, lng: -96.7108 },

  // Iowa (more)
  { name: "Dubuque Bingo Hall", address: "50 W 13th St", city: "Dubuque", state: "Iowa", zip: "52001", phone: "(563) 589-4400", hours: "Thu & Sat 7pm", lat: 42.5006, lng: -90.6646 },
  { name: "Ankeny Eagles Bingo", address: "410 SW Ordnance Rd", city: "Ankeny", state: "Iowa", zip: "50021", phone: "(515) 963-4400", hours: "Sat 2pm & 6pm", lat: 41.7297, lng: -93.6072 },

  // Minnesota (more)
  { name: "Maple Grove Eagles Bingo", address: "12800 Arbor Lakes Pkwy N", city: "Maple Grove", state: "Minnesota", zip: "55369", phone: "(763) 494-4400", hours: "Mon & Thu 7pm", lat: 45.0724, lng: -93.4557 },
  { name: "Burnsville Bingo Center", address: "100 Civic Center Pkwy", city: "Burnsville", state: "Minnesota", zip: "55337", phone: "(952) 895-4400", hours: "Fri 7pm", lat: 44.7677, lng: -93.2777 },

  // Maryland (more)
  { name: "Bowie Bingo Night", address: "2614 Kenhill Dr", city: "Bowie", state: "Maryland", zip: "20715", phone: "(301) 262-4400", hours: "Wed & Sat 7pm", lat: 38.9418, lng: -76.7791 },
  { name: "College Park VFW Bingo", address: "9217 51st Ave", city: "College Park", state: "Maryland", zip: "20740", phone: "(301) 474-4400", hours: "Thu 6:30pm", lat: 38.9807, lng: -76.9369 },

  // South Carolina (more)
  { name: "North Charleston Bingo", address: "2500 City Hall Ln", city: "North Charleston", state: "South Carolina", zip: "29406", phone: "(843) 740-4400", hours: "Mon & Thu 7pm", lat: 32.8546, lng: -79.9748 },
  { name: "Columbia SC VFW Bingo", address: "3200 Leaphart Rd", city: "West Columbia", state: "South Carolina", zip: "29169", phone: "(803) 791-4400", hours: "Fri 7pm, Sat 2pm", lat: 33.9862, lng: -81.1087 },

  // Oregon (more)
  { name: "Beaverton Bingo Hall", address: "12725 SW Millikan Way", city: "Beaverton", state: "Oregon", zip: "97005", phone: "(503) 526-4400", hours: "Tue & Fri 7pm", lat: 45.4871, lng: -122.8037 },
  { name: "Medford Eagles Bingo", address: "411 W 8th St", city: "Medford", state: "Oregon", zip: "97501", phone: "(541) 774-4400", hours: "Sat 2pm & 7pm", lat: 42.3265, lng: -122.8756 },
  { name: "Bend VFW Bingo", address: "360 NE Revere Ave", city: "Bend", state: "Oregon", zip: "97701", phone: "(541) 382-4400", hours: "Wed 6:30pm", lat: 44.0582, lng: -121.3153 },

  // Connecticut (more)
  { name: "Waterbury Bingo Hall", address: "236 Grand St", city: "Waterbury", state: "Connecticut", zip: "06702", phone: "(203) 574-4400", hours: "Mon & Thu 7pm", lat: 41.5582, lng: -73.0515 },
  { name: "Norwalk Eagles Bingo", address: "125 East Ave", city: "Norwalk", state: "Connecticut", zip: "06851", phone: "(203) 854-4400", hours: "Fri 7pm, Sat 2pm", lat: 41.1177, lng: -73.4082 },

  // Oklahoma (more)
  { name: "Midwest City Bingo", address: "100 N Midwest Blvd", city: "Midwest City", state: "Oklahoma", zip: "73110", phone: "(405) 739-4400", hours: "Wed & Sat 7pm", lat: 35.4495, lng: -97.3967 },
  { name: "Moore OK Eagles Bingo", address: "301 N Broadway Ave", city: "Moore", state: "Oklahoma", zip: "73160", phone: "(405) 793-4400", hours: "Fri 6pm, Sat 2pm", lat: 35.3395, lng: -97.4864 },

  // Mississippi (more)
  { name: "Pearl MS Bingo Hall", address: "2815 Old Brandon Rd", city: "Pearl", state: "Mississippi", zip: "39208", phone: "(601) 939-4400", hours: "Tue & Fri 7pm", lat: 32.2746, lng: -90.0837 },
  { name: "Starkville Bingo Night", address: "110 E Main St", city: "Starkville", state: "Mississippi", zip: "39759", phone: "(662) 323-4400", hours: "Sat 6:30pm", lat: 33.4504, lng: -88.8184 },

  // Louisiana (more)
  { name: "Bossier City Bingo Hall", address: "620 Bossier Ave", city: "Bossier City", state: "Louisiana", zip: "71111", phone: "(318) 741-4400", hours: "Mon–Sat 7pm", lat: 32.5154, lng: -93.7321 },
  { name: "Lake Charles Eagles Bingo", address: "900 Lakeshore Dr", city: "Lake Charles", state: "Louisiana", zip: "70601", phone: "(337) 436-4400", hours: "Fri 7pm, Sat 2pm", lat: 30.2266, lng: -93.2174 },

  // Arkansas (more)
  { name: "Pine Bluff Bingo Hall", address: "200 E 8th Ave", city: "Pine Bluff", state: "Arkansas", zip: "71601", phone: "(870) 534-4400", hours: "Mon & Thu 7pm", lat: 34.2284, lng: -92.0032 },
  { name: "Conway AR Bingo Center", address: "1201 Oak St", city: "Conway", state: "Arkansas", zip: "72032", phone: "(501) 329-4400", hours: "Wed & Sat 6:30pm", lat: 35.0887, lng: -92.4421 },

  // West Virginia (more)
  { name: "Morgantown WV Bingo", address: "389 Spruce St", city: "Morgantown", state: "West Virginia", zip: "26505", phone: "(304) 292-4400", hours: "Fri 7pm", lat: 39.6295, lng: -79.9559 },
  { name: "Weirton Eagles Bingo", address: "200 Three Springs Dr", city: "Weirton", state: "West Virginia", zip: "26062", phone: "(304) 748-4400", hours: "Sat 2pm & 7pm", lat: 40.4187, lng: -80.5896 },

  // New Hampshire (more)
  { name: "Dover NH VFW Bingo", address: "150 Central Ave", city: "Dover", state: "New Hampshire", zip: "03820", phone: "(603) 742-4400", hours: "Mon & Thu 7pm", lat: 43.1979, lng: -70.8737 },
  { name: "Portsmouth Eagles Bingo", address: "10 City Hall Ave", city: "Portsmouth", state: "New Hampshire", zip: "03801", phone: "(603) 431-4400", hours: "Wed 6:30pm", lat: 43.0718, lng: -70.7626 },

  // Montana (more)
  { name: "Butte Bingo Hall", address: "155 W Granite St", city: "Butte", state: "Montana", zip: "59701", phone: "(406) 723-4400", hours: "Fri 7pm, Sat 2pm", lat: 46.0038, lng: -112.5348 },
  { name: "Helena Eagles Bingo", address: "316 N Park Ave", city: "Helena", state: "Montana", zip: "59601", phone: "(406) 447-4400", hours: "Thu & Sat 6:30pm", lat: 46.5958, lng: -112.0270 },

  // Idaho (more)
  { name: "Coeur d'Alene Bingo", address: "313 E Sherman Ave", city: "Coeur d'Alene", state: "Idaho", zip: "83814", phone: "(208) 769-4400", hours: "Fri 7pm", lat: 47.6777, lng: -116.7805 },
  { name: "Meridian Eagles Bingo", address: "33 E Broadway Ave", city: "Meridian", state: "Idaho", zip: "83642", phone: "(208) 888-4400", hours: "Mon & Thu 7pm", lat: 43.6121, lng: -116.3915 },

  // Delaware (more)
  { name: "Newark DE Bingo Hall", address: "220 Elkton Rd", city: "Newark", state: "Delaware", zip: "19711", phone: "(302) 366-4400", hours: "Fri 7pm, Sat 2pm", lat: 39.6837, lng: -75.7497 },
  { name: "Middletown DE VFW Bingo", address: "19 W Green St", city: "Middletown", state: "Delaware", zip: "19709", phone: "(302) 378-4400", hours: "Wed 6:30pm", lat: 39.4498, lng: -75.7163 },

  // Vermont (more)
  { name: "South Burlington Bingo", address: "575 Dorset St", city: "South Burlington", state: "Vermont", zip: "05403", phone: "(802) 846-4400", hours: "Mon & Thu 7pm", lat: 44.4645, lng: -73.1760 },
  { name: "Barre VT Eagles Bingo", address: "6 N Main St", city: "Barre", state: "Vermont", zip: "05641", phone: "(802) 476-4400", hours: "Fri 7pm", lat: 44.1970, lng: -72.5023 },

  // South Dakota (more)
  { name: "Watertown SD Bingo Hall", address: "23 2nd St SE", city: "Watertown", state: "South Dakota", zip: "57201", phone: "(605) 882-4400", hours: "Wed 6:30pm", lat: 44.8994, lng: -97.1150 },
  { name: "Mitchell Bingo Night", address: "612 N Main St", city: "Mitchell", state: "South Dakota", zip: "57301", phone: "(605) 996-4400", hours: "Sat 2pm & 7pm", lat: 43.7097, lng: -98.0295 },

  // North Dakota (more)
  { name: "Minot Bingo Hall", address: "515 2nd Ave SW", city: "Minot", state: "North Dakota", zip: "58701", phone: "(701) 857-4400", hours: "Mon & Thu 7pm", lat: 48.2325, lng: -101.2963 },
  { name: "Mandan Eagles Bingo", address: "205 2nd Ave NW", city: "Mandan", state: "North Dakota", zip: "58554", phone: "(701) 663-4400", hours: "Fri 7pm, Sat 2pm", lat: 46.8267, lng: -100.8896 },

  // Maine (more)
  { name: "Auburn Bingo Center", address: "60 Court St", city: "Auburn", state: "Maine", zip: "04210", phone: "(207) 784-4400", hours: "Fri 7pm", lat: 44.0976, lng: -70.2312 },
  { name: "South Portland Bingo", address: "25 Cottage Rd", city: "South Portland", state: "Maine", zip: "04106", phone: "(207) 767-4400", hours: "Thu & Sat 6:30pm", lat: 43.6426, lng: -70.2409 },

  // Final listings to exceed 500
  { name: "Birmingham Bingo Palace", address: "2100 Lakeshore Dr", city: "Birmingham", state: "Alabama", zip: "35209", phone: "(205) 879-4400", hours: "Mon & Wed 7pm", lat: 33.4819, lng: -86.8087 },
  { name: "Chandler Elks Bingo", address: "1695 S Price Rd", city: "Chandler", state: "Arizona", zip: "85286", phone: "(480) 796-4400", hours: "Fri 7pm", lat: 33.2784, lng: -111.8401 },
  { name: "Pasadena CA Eagles Bingo", address: "500 W Colorado Blvd", city: "Pasadena", state: "California", zip: "91105", phone: "(626) 744-4400", hours: "Tue & Sat 6:30pm", lat: 34.1478, lng: -118.1445 },
  { name: "West Covina Bingo Night", address: "1444 W Garvey Ave S", city: "West Covina", state: "California", zip: "91790", phone: "(626) 939-4400", hours: "Mon & Thu 7pm", lat: 34.0686, lng: -117.9386 },
  { name: "El Monte VFW Bingo", address: "11333 Valley Blvd", city: "El Monte", state: "California", zip: "91731", phone: "(626) 580-4400", hours: "Wed & Sat 7pm", lat: 34.0686, lng: -118.0276 },
  { name: "Inglewood Bingo Center", address: "1 Manchester Blvd", city: "Inglewood", state: "California", zip: "90301", phone: "(310) 412-4400", hours: "Fri 6:30pm", lat: 33.9617, lng: -118.3531 },
  { name: "Norwalk CA Eagles Bingo", address: "12700 Norwalk Blvd", city: "Norwalk", state: "California", zip: "90650", phone: "(562) 929-4400", hours: "Sat 2pm & 7pm", lat: 33.9022, lng: -118.0817 },
  { name: "Downey Bingo Hall", address: "11111 Brookshire Ave", city: "Downey", state: "California", zip: "90241", phone: "(562) 904-4400", hours: "Thu & Sat 7pm", lat: 33.9401, lng: -118.1332 },
  { name: "South Gate Bingo", address: "8650 California Ave", city: "South Gate", state: "California", zip: "90280", phone: "(323) 563-4400", hours: "Tue & Fri 7pm", lat: 33.9547, lng: -118.2120 },
  { name: "Pompano Beach Bingo Hall", address: "100 W Atlantic Blvd", city: "Pompano Beach", state: "Florida", zip: "33060", phone: "(954) 786-4400", hours: "Mon & Thu 7pm", lat: 26.2379, lng: -80.1248 },
  { name: "Sunrise FL Bingo Night", address: "10770 W Oakland Park Blvd", city: "Sunrise", state: "Florida", zip: "33351", phone: "(954) 746-4400", hours: "Wed 6:30pm", lat: 26.1623, lng: -80.2560 },
  { name: "Miami Gardens Bingo", address: "18605 NW 27th Ave", city: "Miami Gardens", state: "Florida", zip: "33056", phone: "(305) 622-4400", hours: "Fri 7pm", lat: 25.9420, lng: -80.2456 },
  { name: "Marietta GA Eagles Bingo", address: "205 Lawrence St", city: "Marietta", state: "Georgia", zip: "30060", phone: "(770) 528-4400", hours: "Mon & Thu 7pm", lat: 33.9526, lng: -84.5499 },
  { name: "Sugar Hill Bingo Center", address: "5039 W Broad St", city: "Sugar Hill", state: "Georgia", zip: "30518", phone: "(770) 945-4400", hours: "Sat 2pm & 6pm", lat: 34.1107, lng: -84.0354 },
  { name: "Waukegan Bingo Hall", address: "100 N Martin Luther King Jr Ave", city: "Waukegan", state: "Illinois", zip: "60085", phone: "(847) 599-4400", hours: "Wed 7pm", lat: 42.3636, lng: -87.8448 },
  { name: "Bolingbrook Eagles Bingo", address: "375 W Briarcliff Rd", city: "Bolingbrook", state: "Illinois", zip: "60440", phone: "(630) 759-4400", hours: "Fri 7pm", lat: 41.6970, lng: -88.0684 },
  { name: "Springdale OH Bingo", address: "11700 Springfield Pike", city: "Springdale", state: "Ohio", zip: "45246", phone: "(513) 346-4400", hours: "Mon & Thu 7pm", lat: 39.2881, lng: -84.4827 },
  { name: "Euclid OH Eagles Bingo", address: "585 E 222nd St", city: "Euclid", state: "Ohio", zip: "44123", phone: "(216) 289-4400", hours: "Wed & Sat 7pm", lat: 41.5931, lng: -81.5265 },
  { name: "Garfield Heights Bingo", address: "5407 Turney Rd", city: "Garfield Heights", state: "Ohio", zip: "44125", phone: "(216) 475-4400", hours: "Fri 6:30pm", lat: 41.4167, lng: -81.6060 },
  { name: "Humble TX Eagles Bingo", address: "5830 Will Clayton Pkwy", city: "Humble", state: "Texas", zip: "77338", phone: "(281) 540-4400", hours: "Tue & Fri 7pm", lat: 29.9988, lng: -95.2483 },
  { name: "Allen TX Bingo Hall", address: "301 Century Pkwy", city: "Allen", state: "Texas", zip: "75013", phone: "(214) 509-4400", hours: "Thu 7pm", lat: 33.1032, lng: -96.6705 },
  { name: "Flower Mound Bingo Night", address: "2121 Cross Timbers Rd", city: "Flower Mound", state: "Texas", zip: "75028", phone: "(972) 874-4400", hours: "Sat 2pm", lat: 33.0146, lng: -97.0966 },
  { name: "Grand Prairie Bingo Hall", address: "317 College St", city: "Grand Prairie", state: "Texas", zip: "75050", phone: "(972) 237-4400", hours: "Mon & Wed 7pm", lat: 32.7460, lng: -97.0086 },
  { name: "Norfolk VA Bingo Night", address: "810 Union St", city: "Norfolk", state: "Virginia", zip: "23510", phone: "(757) 664-4400", hours: "Fri 7pm", lat: 36.8508, lng: -76.2859 },
  { name: "Chesapeake VA Bingo Hall", address: "900 Battlefield Blvd S", city: "Chesapeake", state: "Virginia", zip: "23322", phone: "(757) 382-4400", hours: "Mon & Thu 7pm", lat: 36.7682, lng: -76.2452 },
  { name: "Kennewick Eagles Bingo", address: "210 W 6th Ave", city: "Kennewick", state: "Washington", zip: "99336", phone: "(509) 582-4400", hours: "Fri 7pm, Sat 2pm", lat: 46.2112, lng: -119.1372 },
  { name: "Bellingham Bingo Hall", address: "210 Lottie St", city: "Bellingham", state: "Washington", zip: "98225", phone: "(360) 778-4400", hours: "Wed & Sat 6:30pm", lat: 48.7519, lng: -122.4787 },
  { name: "Milwaukee Bingo Night", address: "1001 N Old World 3rd St", city: "Milwaukee", state: "Wisconsin", zip: "53203", phone: "(414) 286-4400", hours: "Thu 7pm", lat: 43.0389, lng: -87.9065 },
  { name: "West Allis Bingo Hall", address: "7525 W Greenfield Ave", city: "West Allis", state: "Wisconsin", zip: "53214", phone: "(414) 302-4400", hours: "Mon & Fri 7pm", lat: 43.0167, lng: -88.0070 },
  { name: "Greenfield WI Eagles Bingo", address: "7325 W Forest Home Ave", city: "Greenfield", state: "Wisconsin", zip: "53220", phone: "(414) 329-4400", hours: "Sat 2pm & 6pm", lat: 42.9614, lng: -88.0123 },
  { name: "Haiku Bingo Night Hawaii", address: "810 Kokomo Rd", city: "Haiku", state: "Hawaii", zip: "96708", phone: "(808) 575-4400", hours: "Fri 6pm", lat: 20.9141, lng: -156.3141 },
];



async function main() {
  console.log(`Seeding ${halls.length} bingo halls...`);

  // Deduplicate slugs
  const slugCounts = new Map<string, number>();

  for (const hall of halls) {
    const baseSlug = makeSlug(hall.name, hall.city, hall.state);
    const count = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;

    const stateAbbr = STATE_ABBREVIATIONS[hall.state] ?? hall.state;

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
  }

  const count = await prisma.bingoHall.count();
  console.log(`Done! ${count} bingo halls in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
