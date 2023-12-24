import { dataSource } from '../plugins/typeorm.js'

const counterRepository = dataSource.getRepository('Counter')

class DatabaseService {
  static async findCounter(payload) {
    return counterRepository.findOne({ where: { name: payload } })
  }
  static async updateCounter(payload) {
    return counterRepository.save(payload)
  }
  static async deleteCounter(payload) {
    return counterRepository.delete({ name: payload })
  }
}

export { DatabaseService }
