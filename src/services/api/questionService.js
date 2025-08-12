import questionsData from "@/services/mockData/questions.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let questions = [...questionsData];

const questionService = {
  async getAll() {
    await delay(400);
    return questions.map(q => ({ ...q }));
  },

  async getById(id) {
    await delay(200);
    const question = questions.find(q => q.Id === parseInt(id));
    if (!question) {
      throw new Error("Question not found");
    }
    return { ...question };
  },

  async create(questionData) {
    await delay(500);
    const maxId = Math.max(...questions.map(q => q.Id), 0);
    const newQuestion = {
      Id: maxId + 1,
      ...questionData,
      userId: "current-user",
      votes: 0,
      answerCount: 0,
      createdAt: new Date().toISOString()
    };
    questions.unshift(newQuestion);
    return { ...newQuestion };
  },

  async vote(id, voteValue) {
    await delay(300);
    const question = questions.find(q => q.Id === parseInt(id));
    if (!question) {
      throw new Error("Question not found");
    }
    question.votes += voteValue;
    return { ...question };
  },

  async update(id, updateData) {
    await delay(500);
    const index = questions.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Question not found");
    }
    questions[index] = { ...questions[index], ...updateData };
    return { ...questions[index] };
  },

  async delete(id) {
    await delay(300);
    const index = questions.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Question not found");
    }
    questions.splice(index, 1);
    return true;
  }
};

export default questionService;