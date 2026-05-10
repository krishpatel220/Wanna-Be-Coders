export const geographyData = {
  "United States": {
    "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose"],
    "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
    "Texas": ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
    "Illinois": ["Chicago", "Springfield", "Peoria", "Rockford", "Naperville"]
  },
  "India": {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
  },
  "Canada": {
    "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"],
    "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"]
  },
  "United Kingdom": {
    "England": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
    "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
    "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Bangor"]
  },
  "Australia": {
    "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Maitland", "Tweed Heads"],
    "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Melton"],
    "Queensland": ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns"]
  }
};

export const getAllCountries = () => Object.keys(geographyData);
export const getStatesForCountry = (country) => geographyData[country] ? Object.keys(geographyData[country]) : [];
export const getCitiesForState = (country, state) => (geographyData[country] && geographyData[country][state]) ? geographyData[country][state] : [];
