import eventsData from "@/services/mockData/events.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let events = [...eventsData];

const eventService = {
  async getAll() {
    await delay(400);
    return events.map(e => ({ ...e }));
  },

  async getById(id) {
    await delay(200);
    const event = events.find(e => e.Id === parseInt(id));
    if (!event) {
      throw new Error("Event not found");
    }
    return { ...event };
  },

  async create(eventData) {
    await delay(500);
    const maxId = Math.max(...events.map(e => e.Id), 0);
    const newEvent = {
      Id: maxId + 1,
      ...eventData,
      organizerId: "current-user",
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    return { ...newEvent };
  },

  async update(id, updateData) {
    await delay(500);
    const index = events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Event not found");
    }
    events[index] = { ...events[index], ...updateData };
    return { ...events[index] };
  },

  async delete(id) {
    await delay(300);
    const index = events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Event not found");
    }
    events.splice(index, 1);
    return true;
  },

  async getByLocation(city, state) {
    await delay(400);
    return events
      .filter(e => e.location.city === city && e.location.state === state)
      .map(e => ({ ...e }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    return events
      .filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= startDate && eventDate <= endDate;
      })
      .map(e => ({ ...e }));
  }
};

export default eventService;