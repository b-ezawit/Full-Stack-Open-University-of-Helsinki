const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

jest.setTimeout(10000)
let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
  await user.save()

  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'sekret' })

  token = response.body.token
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid blog can be added with token', async () => {
    const newBlog = {
      title: 'Canonical code style',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) 
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(1)
    expect(blogsAtEnd[0].title).toBe('Canonical code style')
  })

  test('addition of a new blog fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Hacker',
      url: 'http://example.com',
      likes: 0,
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('token missing')

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(0)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})