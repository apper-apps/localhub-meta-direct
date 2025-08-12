import answersData from "@/services/mockData/answers.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let answers = [...answersData];

const answerService = {
  async getAll() {
    await delay(300);
    return answers.map(a => ({ ...a }));
  },

  async getById(id) {
    await delay(200);
    const answer = answers.find(a => a.Id === parseInt(id));
    if (!answer) {
      throw new Error("Answer not found");
    }
    return { ...answer };
  },

  async getByQuestionId(questionId) {
    await delay(300);
    return answers
      .filter(a => a.questionId === parseInt(questionId))
      .map(a => ({ ...a }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(answerData) {
    await delay(400);
    const maxId = Math.max(...answers.map(a => a.Id), 0);
    const newAnswer = {
      Id: maxId + 1,
      ...answerData,
      userId: "current-user",
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString()
    };
    answers.push(newAnswer);
    return { ...newAnswer };
  },

  async vote(id, voteValue) {
    await delay(300);
    const answer = answers.find(a => a.Id === parseInt(id));
    if (!answer) {
      throw new Error("Answer not found");
    }
    answer.votes += voteValue;
    return { ...answer };
  },

  async update(id, updateData) {
    await delay(400);
    const index = answers.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Answer not found");
    }
    answers[index] = { ...answers[index], ...updateData };
    return { ...answers[index] };
  },

  async delete(id) {
    await delay(300);
    const index = answers.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Answer not found");
    }
    answers.splice(index, 1);
    return true;
  }
};

export default answerService;