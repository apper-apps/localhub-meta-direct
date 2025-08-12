import locationsData from "@/services/mockData/locations.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const locationService = {
  async getPopularLocations() {
    await delay(300);
    return [...locationsData];
  },

  async searchLocations(query) {
    await delay(400);
    const searchTerm = query.toLowerCase();
    return locationsData.filter(location => 
      location.city.toLowerCase().includes(searchTerm) ||
      location.state.toLowerCase().includes(searchTerm)
    );
  },

  async getById(id) {
    await delay(200);
    const location = locationsData.find(l => l.Id === parseInt(id));
    if (!location) {
      throw new Error("Location not found");
    }
    return { ...location };
  }
};

export default locationService;