import bcrypt from 'bcryptjs'

import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'
import getUserId from '../utils/getUserId'

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password)
    const user = await prisma.mutation.createUser({ data: { ...args.data, password } })

    return { user, token: generateToken(user.id) }
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: args.data.email } })

    if (!user) {
      throw new Error('Invalid email or password!')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error('Invalid email or password!')
    }

    return { user, token: generateToken(user.id) }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({ where: { id: userId } }, info)
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password)
    }

    return prisma.mutation.updateUser({ where: { id: userId }, data }, info)
  }
}

export default Mutation
