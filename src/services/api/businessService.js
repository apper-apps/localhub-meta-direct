import businessesData from "@/services/mockData/businesses.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let businesses = [...businessesData];

const businessService = {
  async getAll() {
    await delay(400);
    return businesses.map(b => ({ ...b }));
  },

  async getById(id) {
    await delay(200);
    const business = businesses.find(b => b.Id === parseInt(id));
    if (!business) {
      throw new Error("Business not found");
    }
    return { ...business };
  },

  async create(businessData) {
    await delay(500);
    const maxId = Math.max(...businesses.map(b => b.Id), 0);
    const newBusiness = {
      Id: maxId + 1,
      ...businessData,
      createdAt: new Date().toISOString()
    };
    businesses.push(newBusiness);
    return { ...newBusiness };
  },

  async update(id, updateData) {
    await delay(500);
    const index = businesses.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Business not found");
    }
    businesses[index] = { ...businesses[index], ...updateData };
    return { ...businesses[index] };
  },

  async delete(id) {
    await delay(300);
    const index = businesses.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Business not found");
    }
    businesses.splice(index, 1);
    return true;
  },

  async searchByLocation(city, state) {
    await delay(400);
    return businesses
      .filter(b => b.location.city === city && b.location.state === state)
      .map(b => ({ ...b }));
  },

  async searchByCategory(category) {
    await delay(300);
    return businesses
      .filter(b => b.category === category)
      .map(b => ({ ...b }));
  }
};

export default businessService;