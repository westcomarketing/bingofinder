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
}

const moreHalls: HallInput[] = [
  // Connecticut
  { name: "Bridgeport VFW Bingo", address: "45 Lyon Terrace", city: "Bridgeport", state: "Connecticut", zip: "06604", phone: "(203) 576-7201", hours: "Tue & Sat 7pm" },
  { name: "New Haven Eagles Bingo", address: "165 Church St", city: "New Haven", state: "Connecticut", zip: "06510", phone: "(203) 946-8200", hours: "Mon–Fri 6pm" },
  { name: "Stamford Bingo Palace", address: "888 Washington Blvd", city: "Stamford", state: "Connecticut", zip: "06901", phone: "(203) 977-4150", hours: "Wed & Sat 7pm" },
  { name: "Hartford Bingo Center", address: "550 Main St", city: "Hartford", state: "Connecticut", zip: "06103", phone: "(860) 757-9311", hours: "Fri 6pm, Sat 2pm" },
  { name: "Waterbury Moose Bingo", address: "235 Grand St", city: "Waterbury", state: "Connecticut", zip: "06702", phone: "(203) 574-6712", hours: "Mon & Thu 7pm" },
  { name: "Norwalk CT Bingo Hall", address: "125 East Ave", city: "Norwalk", state: "Connecticut", zip: "06851", phone: "(203) 854-7720", hours: "Tue & Sat 6pm" },
  { name: "Danbury Elks Bingo", address: "155 Deer Hill Ave", city: "Danbury", state: "Connecticut", zip: "06810", phone: "(203) 797-4511", hours: "Sat 2pm & 6pm" },
  { name: "New Britain Bingo Night", address: "27 West Main St", city: "New Britain", state: "Connecticut", zip: "06051", phone: "(860) 826-3360", hours: "Wed 6pm" },

  // Rhode Island
  { name: "Providence VFW Bingo Hall", address: "25 Dorrance St", city: "Providence", state: "Rhode Island", zip: "02903", phone: "(401) 421-7740", hours: "Mon–Sat 7pm" },
  { name: "Cranston Bingo Palace", address: "869 Park Ave", city: "Cranston", state: "Rhode Island", zip: "02910", phone: "(401) 461-1000", hours: "Tue, Thu, Sat 6pm" },
  { name: "Woonsocket Eagles Bingo", address: "169 Main St", city: "Woonsocket", state: "Rhode Island", zip: "02895", phone: "(401) 762-6400", hours: "Wed & Sat 7pm" },
  { name: "Pawtucket Bingo Center", address: "137 Roosevelt Ave", city: "Pawtucket", state: "Rhode Island", zip: "02860", phone: "(401) 728-0500", hours: "Fri 6pm, Sat 2pm" },
  { name: "Warwick RI Bingo Night", address: "3275 Post Rd", city: "Warwick", state: "Rhode Island", zip: "02886", phone: "(401) 738-2000", hours: "Mon & Thu 7pm" },

  // Delaware
  { name: "Wilmington DE VFW Bingo", address: "800 N French St", city: "Wilmington", state: "Delaware", zip: "19801", phone: "(302) 576-2190", hours: "Tue & Sat 6pm" },
  { name: "Dover DE Eagles Bingo", address: "15 E Loockerman St", city: "Dover", state: "Delaware", zip: "19901", phone: "(302) 736-7400", hours: "Wed & Sat 7pm" },
  { name: "Newark DE Bingo Hall", address: "220 Elkton Rd", city: "Newark", state: "Delaware", zip: "19711", phone: "(302) 366-7000", hours: "Mon & Fri 6pm" },

  // New Hampshire
  { name: "Manchester NH VFW Bingo", address: "1 City Hall Plaza", city: "Manchester", state: "New Hampshire", zip: "03101", phone: "(603) 624-6500", hours: "Mon–Sat 7pm" },
  { name: "Nashua NH Eagles Bingo", address: "229 Main St", city: "Nashua", state: "New Hampshire", zip: "03060", phone: "(603) 589-3300", hours: "Tue & Sat 6pm" },
  { name: "Concord NH Bingo Palace", address: "1 Green St", city: "Concord", state: "New Hampshire", zip: "03301", phone: "(603) 225-8690", hours: "Fri 6pm, Sat 2pm" },
  { name: "Derry Bingo Hall", address: "14 Manning St", city: "Derry", state: "New Hampshire", zip: "03038", phone: "(603) 432-6100", hours: "Wed & Sat 7pm" },

  // Vermont
  { name: "Burlington VT VFW Bingo", address: "149 Church St", city: "Burlington", state: "Vermont", zip: "05401", phone: "(802) 865-7000", hours: "Tue & Sat 6pm" },
  { name: "South Burlington Bingo", address: "575 Dorset St", city: "South Burlington", state: "Vermont", zip: "05403", phone: "(802) 846-4000", hours: "Wed & Sat 7pm" },
  { name: "Rutland VT Bingo Night", address: "1 Strongs Ave", city: "Rutland", state: "Vermont", zip: "05701", phone: "(802) 773-1800", hours: "Fri 6pm, Sat 2pm" },

  // Maine
  { name: "Portland ME VFW Bingo", address: "389 Congress St", city: "Portland", state: "Maine", zip: "04101", phone: "(207) 874-8300", hours: "Mon–Sat 7pm" },
  { name: "Lewiston ME Eagles Bingo", address: "27 Pine St", city: "Lewiston", state: "Maine", zip: "04240", phone: "(207) 784-2951", hours: "Tue & Sat 6pm" },
  { name: "Bangor ME Bingo Hall", address: "73 Harlow St", city: "Bangor", state: "Maine", zip: "04401", phone: "(207) 992-4200", hours: "Wed & Sat 7pm" },
  { name: "Auburn ME Bingo Night", address: "60 Court St", city: "Auburn", state: "Maine", zip: "04210", phone: "(207) 333-6601", hours: "Fri 6pm" },

  // West Virginia
  { name: "Charleston WV VFW Bingo", address: "501 Virginia St E", city: "Charleston", state: "West Virginia", zip: "25301", phone: "(304) 348-8040", hours: "Mon–Sat 7pm" },
  { name: "Huntington WV Eagles Bingo", address: "800 5th Ave", city: "Huntington", state: "West Virginia", zip: "25701", phone: "(304) 696-5540", hours: "Tue & Sat 6pm" },
  { name: "Morgantown WV Bingo", address: "389 Spruce St", city: "Morgantown", state: "West Virginia", zip: "26505", phone: "(304) 284-7439", hours: "Wed & Sat 7pm" },
  { name: "Parkersburg WV Bingo Hall", address: "1 Government Square", city: "Parkersburg", state: "West Virginia", zip: "26101", phone: "(304) 424-8504", hours: "Fri 6pm, Sat 2pm" },
  { name: "Wheeling WV Moose Bingo", address: "1500 Chapline St", city: "Wheeling", state: "West Virginia", zip: "26003", phone: "(304) 234-3627", hours: "Mon & Thu 7pm" },

  // Montana
  { name: "Billings MT VFW Bingo", address: "210 N 27th St", city: "Billings", state: "Montana", zip: "59101", phone: "(406) 657-8200", hours: "Mon–Sat 7pm" },
  { name: "Missoula MT Eagles Bingo", address: "435 Ryman St", city: "Missoula", state: "Montana", zip: "59801", phone: "(406) 523-4636", hours: "Tue & Sat 6pm" },
  { name: "Great Falls MT Bingo", address: "2 Park Dr S", city: "Great Falls", state: "Montana", zip: "59401", phone: "(406) 455-8400", hours: "Fri 6pm, Sat 2pm" },
  { name: "Bozeman MT Bingo Night", address: "121 N Rouse Ave", city: "Bozeman", state: "Montana", zip: "59715", phone: "(406) 582-2306", hours: "Wed & Sat 7pm" },

  // Idaho
  { name: "Boise ID VFW Bingo Hall", address: "150 N Capitol Blvd", city: "Boise", state: "Idaho", zip: "83702", phone: "(208) 384-4422", hours: "Mon–Sat 7pm" },
  { name: "Nampa ID Eagles Bingo", address: "411 3rd St S", city: "Nampa", state: "Idaho", zip: "83651", phone: "(208) 468-5400", hours: "Tue & Sat 6pm" },
  { name: "Meridian ID Bingo Palace", address: "33 E Broadway Ave", city: "Meridian", state: "Idaho", zip: "83642", phone: "(208) 888-4433", hours: "Wed & Sat 7pm" },
  { name: "Idaho Falls Bingo Hall", address: "680 Park Ave", city: "Idaho Falls", state: "Idaho", zip: "83401", phone: "(208) 529-1200", hours: "Fri 6pm, Sat 2pm" },
  { name: "Pocatello ID Bingo Night", address: "911 N 7th Ave", city: "Pocatello", state: "Idaho", zip: "83201", phone: "(208) 234-6162", hours: "Mon & Thu 7pm" },
  { name: "Caldwell ID Bingo Hall", address: "411 Blaine St", city: "Caldwell", state: "Idaho", zip: "83605", phone: "(208) 459-9879", hours: "Tue & Sat 6pm" },

  // Wyoming
  { name: "Cheyenne WY VFW Bingo", address: "2101 O'Neil Ave", city: "Cheyenne", state: "Wyoming", zip: "82001", phone: "(307) 638-4000", hours: "Mon–Sat 7pm" },
  { name: "Casper WY Eagles Bingo", address: "200 N David St", city: "Casper", state: "Wyoming", zip: "82601", phone: "(307) 235-8224", hours: "Tue & Sat 6pm" },
  { name: "Laramie WY Bingo Hall", address: "406 Ivinson Ave", city: "Laramie", state: "Wyoming", zip: "82070", phone: "(307) 721-5200", hours: "Fri 6pm, Sat 2pm" },
  { name: "Gillette WY Bingo Night", address: "201 W Lakeway Rd", city: "Gillette", state: "Wyoming", zip: "82716", phone: "(307) 682-1970", hours: "Wed & Sat 7pm" },

  // North Dakota
  { name: "Fargo ND VFW Bingo Hall", address: "200 3rd St N", city: "Fargo", state: "North Dakota", zip: "58102", phone: "(701) 241-1300", hours: "Mon–Sat 7pm" },
  { name: "Bismarck ND Eagles Bingo", address: "221 N 5th St", city: "Bismarck", state: "North Dakota", zip: "58501", phone: "(701) 222-6570", hours: "Tue & Sat 6pm" },
  { name: "Grand Forks ND Bingo", address: "255 N 4th St", city: "Grand Forks", state: "North Dakota", zip: "58203", phone: "(701) 746-2636", hours: "Wed & Sat 7pm" },
  { name: "Minot ND Bingo Hall", address: "515 2nd Ave SW", city: "Minot", state: "North Dakota", zip: "58701", phone: "(701) 857-4750", hours: "Fri 6pm, Sat 2pm" },

  // South Dakota
  { name: "Sioux Falls SD VFW Bingo", address: "224 W 9th St", city: "Sioux Falls", state: "South Dakota", zip: "57104", phone: "(605) 367-8000", hours: "Mon–Sat 7pm" },
  { name: "Rapid City SD Eagles Bingo", address: "300 6th St", city: "Rapid City", state: "South Dakota", zip: "57701", phone: "(605) 394-4110", hours: "Tue & Sat 6pm" },
  { name: "Aberdeen SD Bingo Hall", address: "224 S 2nd St", city: "Aberdeen", state: "South Dakota", zip: "57401", phone: "(605) 626-7011", hours: "Fri 6pm, Sat 2pm" },
  { name: "Brookings SD Bingo Night", address: "520 3rd St", city: "Brookings", state: "South Dakota", zip: "57006", phone: "(605) 692-6281", hours: "Wed & Sat 7pm" },

  // New Mexico
  { name: "Albuquerque NM VFW Bingo", address: "1 Civic Plaza NW", city: "Albuquerque", state: "New Mexico", zip: "87102", phone: "(505) 768-3000", hours: "Mon–Sat 7pm" },
  { name: "Santa Fe NM Eagles Bingo", address: "200 Lincoln Ave", city: "Santa Fe", state: "New Mexico", zip: "87501", phone: "(505) 955-6949", hours: "Tue & Sat 6pm" },
  { name: "Las Cruces NM Bingo Hall", address: "700 N Main St", city: "Las Cruces", state: "New Mexico", zip: "88001", phone: "(575) 528-3000", hours: "Wed & Sat 7pm" },
  { name: "Rio Rancho NM Bingo", address: "3200 Civic Center Blvd NE", city: "Rio Rancho", state: "New Mexico", zip: "87144", phone: "(505) 891-5000", hours: "Fri 6pm, Sat 2pm" },
  { name: "Roswell NM Bingo Night", address: "425 N Richardson Ave", city: "Roswell", state: "New Mexico", zip: "88201", phone: "(575) 624-6700", hours: "Mon & Thu 7pm" },

  // Utah
  { name: "Salt Lake City UT VFW Bingo", address: "451 S State St", city: "Salt Lake City", state: "Utah", zip: "84111", phone: "(801) 535-6333", hours: "Mon–Sat 7pm" },
  { name: "West Valley City Bingo", address: "3600 Constitution Blvd", city: "West Valley City", state: "Utah", zip: "84119", phone: "(801) 963-3000", hours: "Tue & Sat 6pm" },
  { name: "Provo UT Eagles Bingo", address: "351 W Center St", city: "Provo", state: "Utah", zip: "84601", phone: "(801) 852-6000", hours: "Wed & Sat 7pm" },
  { name: "West Jordan UT Bingo", address: "8000 S Redwood Rd", city: "West Jordan", state: "Utah", zip: "84088", phone: "(801) 569-5060", hours: "Fri 6pm, Sat 2pm" },
  { name: "Sandy UT Bingo Hall", address: "10000 Centennial Pkwy", city: "Sandy", state: "Utah", zip: "84070", phone: "(801) 568-7100", hours: "Mon & Thu 7pm" },
  { name: "Ogden UT Moose Bingo", address: "2549 Washington Blvd", city: "Ogden", state: "Utah", zip: "84401", phone: "(801) 629-8000", hours: "Tue & Sat 6pm" },
  { name: "St George UT Bingo Night", address: "175 E 200 N", city: "St. George", state: "Utah", zip: "84770", phone: "(435) 627-4000", hours: "Sat 2pm & 6pm" },

  // Hawaii - more cities
  { name: "Honolulu VFW Bingo Hall", address: "530 S King St", city: "Honolulu", state: "Hawaii", zip: "96813", phone: "(808) 768-4385", hours: "Mon–Sat 7pm" },
  { name: "Pearl City HI Eagles Bingo", address: "1000 Kamehameha Hwy", city: "Pearl City", state: "Hawaii", zip: "96782", phone: "(808) 453-4700", hours: "Tue & Sat 6pm" },
  { name: "Hilo HI Bingo Palace", address: "25 Aupuni St", city: "Hilo", state: "Hawaii", zip: "96720", phone: "(808) 961-8255", hours: "Fri 6pm, Sat 2pm" },
  { name: "Kailua HI Bingo Hall", address: "1777 Kalakaua Ave", city: "Kailua", state: "Hawaii", zip: "96734", phone: "(808) 587-0100", hours: "Wed & Sat 7pm" },
  { name: "Kaneohe HI Moose Bingo", address: "45-1000 Kamehameha Hwy", city: "Kaneohe", state: "Hawaii", zip: "96744", phone: "(808) 651-0730", hours: "Mon & Thu 7pm" },
  { name: "Mililani HI Bingo Night", address: "95-1249 Meheula Pkwy", city: "Mililani", state: "Hawaii", zip: "96789", phone: "(808) 627-4600", hours: "Tue & Sat 6pm" },

  // More California
  { name: "Pomona Bingo Palace", address: "505 S Garey Ave", city: "Pomona", state: "California", zip: "91766", phone: "(909) 620-2311", hours: "Mon–Fri 6pm" },
  { name: "Escondido Bingo Hall", address: "201 N Broadway", city: "Escondido", state: "California", zip: "92025", phone: "(760) 839-4500", hours: "Wed & Sat 7pm" },
  { name: "El Monte Bingo World", address: "11333 Valley Blvd", city: "El Monte", state: "California", zip: "91731", phone: "(626) 580-2000", hours: "Tue & Sat 6pm" },
  { name: "Sunnyvale Bingo Night", address: "456 W Olive Ave", city: "Sunnyvale", state: "California", zip: "94086", phone: "(408) 730-7380", hours: "Mon & Thu 7pm" },
  { name: "Salinas Bingo Hall", address: "200 Lincoln Ave", city: "Salinas", state: "California", zip: "93901", phone: "(831) 758-7300", hours: "Wed & Sat 7pm" },
  { name: "Torrance Eagles Bingo", address: "3031 Torrance Blvd", city: "Torrance", state: "California", zip: "90503", phone: "(310) 618-2801", hours: "Fri 6pm, Sat 2pm" },
  { name: "Hayward VFW Bingo", address: "777 B St", city: "Hayward", state: "California", zip: "94541", phone: "(510) 583-4000", hours: "Mon–Sat 7pm" },
  { name: "Pomona Lucky Bingo", address: "845 N Garey Ave", city: "Pomona", state: "California", zip: "91767", phone: "(909) 620-2100", hours: "Tue & Sat 6pm" },
  { name: "Roseville CA Bingo Hall", address: "311 Vernon St", city: "Roseville", state: "California", zip: "95678", phone: "(916) 774-5200", hours: "Fri 6pm, Sat 2pm" },
  { name: "Visalia Moose Bingo", address: "220 N Santa Fe St", city: "Visalia", state: "California", zip: "93291", phone: "(559) 713-4300", hours: "Mon & Thu 7pm" },
  { name: "Concord CA Eagles Bingo", address: "1950 Parkside Dr", city: "Concord", state: "California", zip: "94519", phone: "(925) 671-3150", hours: "Wed & Sat 7pm" },
  { name: "Simi Valley Bingo Night", address: "2929 Tapo Canyon Rd", city: "Simi Valley", state: "California", zip: "93063", phone: "(805) 583-6400", hours: "Tue & Sat 6pm" },
  { name: "Santa Rosa CA VFW Bingo", address: "100 Santa Rosa Ave", city: "Santa Rosa", state: "California", zip: "95404", phone: "(707) 543-3000", hours: "Mon–Sat 7pm" },
  { name: "Victorville Bingo World", address: "14343 Civic Dr", city: "Victorville", state: "California", zip: "92392", phone: "(760) 955-5000", hours: "Mon–Fri 6pm" },

  // More Texas
  { name: "Abilene TX VFW Bingo", address: "555 Walnut St", city: "Abilene", state: "Texas", zip: "79601", phone: "(325) 676-6200", hours: "Tue & Sat 6pm" },
  { name: "Beaumont TX Bingo Hall", address: "801 Main St", city: "Beaumont", state: "Texas", zip: "77701", phone: "(409) 838-3435", hours: "Wed & Sat 7pm" },
  { name: "Round Rock TX Eagles Bingo", address: "221 E Main St", city: "Round Rock", state: "Texas", zip: "78664", phone: "(512) 218-5400", hours: "Fri 6pm, Sat 2pm" },
  { name: "Carrollton TX Bingo Night", address: "4220 Keller Springs Rd", city: "Carrollton", state: "Texas", zip: "75010", phone: "(972) 466-3000", hours: "Mon & Thu 7pm" },
  { name: "Denton TX Bingo Palace", address: "215 E McKinney St", city: "Denton", state: "Texas", zip: "76201", phone: "(940) 349-8350", hours: "Tue & Sat 6pm" },
  { name: "Richardson TX Bingo Hall", address: "411 W Arapaho Rd", city: "Richardson", state: "Texas", zip: "75080", phone: "(972) 744-4100", hours: "Wed & Sat 7pm" },
  { name: "Lewisville TX Moose Bingo", address: "151 W Church St", city: "Lewisville", state: "Texas", zip: "75057", phone: "(972) 219-3400", hours: "Mon–Fri 6pm" },
  { name: "Tyler TX Bingo Night", address: "212 N Bonner Ave", city: "Tyler", state: "Texas", zip: "75702", phone: "(903) 531-1211", hours: "Sat 2pm & 6pm" },
  { name: "Edinburg TX Bingo Hall", address: "415 W University Dr", city: "Edinburg", state: "Texas", zip: "78539", phone: "(956) 383-5611", hours: "Mon & Thu 7pm" },
  { name: "San Angelo TX Eagles Bingo", address: "72 W College Ave", city: "San Angelo", state: "Texas", zip: "76903", phone: "(325) 653-6246", hours: "Tue & Sat 6pm" },

  // More Florida
  { name: "Deltona FL Bingo Night", address: "2345 Providence Blvd", city: "Deltona", state: "Florida", zip: "32725", phone: "(386) 878-8500", hours: "Wed & Sat 7pm" },
  { name: "Palm Bay FL Eagles Bingo", address: "120 Malabar Rd SW", city: "Palm Bay", state: "Florida", zip: "32907", phone: "(321) 952-3400", hours: "Mon & Fri 6pm" },
  { name: "Hialeah FL VFW Bingo", address: "501 Palm Ave", city: "Hialeah", state: "Florida", zip: "33010", phone: "(305) 883-8000", hours: "Tue & Sat 6pm" },
  { name: "Fort Myers FL Bingo Hall", address: "2200 2nd St", city: "Fort Myers", state: "Florida", zip: "33901", phone: "(239) 321-7500", hours: "Fri 6pm, Sat 2pm" },
  { name: "Melbourne FL Bingo Palace", address: "900 E Strawbridge Ave", city: "Melbourne", state: "Florida", zip: "32901", phone: "(321) 608-7500", hours: "Mon–Sat 7pm" },
  { name: "Tallahassee Knights Bingo", address: "435 N Macomb St", city: "Tallahassee", state: "Florida", zip: "32301", phone: "(850) 891-4100", hours: "Thu & Sat 7pm" },

  // More Georgia
  { name: "Smyrna GA Bingo Night", address: "2800 King St", city: "Smyrna", state: "Georgia", zip: "30080", phone: "(770) 434-6600", hours: "Mon & Thu 7pm" },
  { name: "Johns Creek GA Bingo", address: "11360 Lakefield Dr", city: "Johns Creek", state: "Georgia", zip: "30097", phone: "(678) 512-3200", hours: "Tue & Sat 6pm" },
  { name: "Peachtree City GA Bingo", address: "151 Willowbend Rd", city: "Peachtree City", state: "Georgia", zip: "30269", phone: "(770) 487-8000", hours: "Sat 2pm & 6pm" },
  { name: "Valdosta GA VFW Bingo", address: "216 E Central Ave", city: "Valdosta", state: "Georgia", zip: "31601", phone: "(229) 259-3551", hours: "Fri 6pm" },

  // More Illinois
  { name: "Schaumburg IL Bingo Night", address: "101 Schaumburg Ct", city: "Schaumburg", state: "Illinois", zip: "60193", phone: "(847) 895-4500", hours: "Mon & Thu 7pm" },
  { name: "Bolingbrook IL Bingo Hall", address: "375 W Briarcliff Rd", city: "Bolingbrook", state: "Illinois", zip: "60440", phone: "(630) 226-8400", hours: "Tue & Sat 6pm" },
  { name: "Palatine IL Eagles Bingo", address: "200 E Wood St", city: "Palatine", state: "Illinois", zip: "60067", phone: "(847) 359-9050", hours: "Fri 6pm, Sat 2pm" },
  { name: "Skokie IL VFW Bingo", address: "5127 Oakton St", city: "Skokie", state: "Illinois", zip: "60077", phone: "(847) 982-5000", hours: "Wed & Sat 7pm" },
  { name: "Orland Park IL Bingo", address: "14700 Ravinia Ave", city: "Orland Park", state: "Illinois", zip: "60462", phone: "(708) 403-6100", hours: "Mon–Fri 6pm" },

  // More Michigan
  { name: "Westland MI Bingo Hall", address: "36601 Ford Rd", city: "Westland", state: "Michigan", zip: "48185", phone: "(734) 467-3200", hours: "Tue & Sat 6pm" },
  { name: "Kalamazoo MI Bingo Night", address: "241 W South St", city: "Kalamazoo", state: "Michigan", zip: "49007", phone: "(269) 337-8000", hours: "Wed & Sat 7pm" },
  { name: "Southfield MI Eagles Bingo", address: "26000 Evergreen Rd", city: "Southfield", state: "Michigan", zip: "48076", phone: "(248) 796-5100", hours: "Fri 6pm, Sat 2pm" },
  { name: "Rochester Hills MI Bingo", address: "1000 Rochester Hills Dr", city: "Rochester Hills", state: "Michigan", zip: "48309", phone: "(248) 656-4600", hours: "Mon & Thu 7pm" },

  // More Ohio
  { name: "Lakewood OH Bingo Night", address: "12650 Detroit Ave", city: "Lakewood", state: "Ohio", zip: "44107", phone: "(216) 529-6600", hours: "Tue & Sat 6pm" },
  { name: "Springfield OH Bingo Hall", address: "76 E High St", city: "Springfield", state: "Ohio", zip: "45502", phone: "(937) 324-7399", hours: "Fri 6pm, Sat 2pm" },
  { name: "Hamilton OH Eagles Bingo", address: "345 High St", city: "Hamilton", state: "Ohio", zip: "45011", phone: "(513) 868-5888", hours: "Wed & Sat 7pm" },
  { name: "Kettering OH Bingo Palace", address: "3600 Shroyer Rd", city: "Kettering", state: "Ohio", zip: "45429", phone: "(937) 296-2900", hours: "Mon–Fri 6pm" },
];

async function main() {
  console.log(`Seeding ${moreHalls.length} more bingo halls...`);

  const slugCounts = new Map<string, number>();
  const existing = await prisma.bingoHall.findMany({ select: { slug: true } });
  for (const h of existing) {
    slugCounts.set(h.slug, 1);
  }

  let added = 0;
  for (const hall of moreHalls) {
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
