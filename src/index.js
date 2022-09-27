import 'dotenv/config'
import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import userRouter from './routes/user.js'
import postRouter from './routes/post.js'
import authRouter from './routes/auth.js'
import cohortRouter from './routes/cohort.js'
import deliveryLogRouter from './routes/deliveryLog.js'
import { sendDataResponse } from './utils/responses.js'

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRouter)
app.use('/users', userRouter)
app.use('/post', postRouter)
app.use('/posts', postRouter)
app.use('/cohort', cohortRouter)
app.use('/log', deliveryLogRouter)
app.use('/', authRouter)

app.get('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    data: {
      resource: 'Not found'
    }
  })
})

app.use((error, req, res, next) => {
  console.error(error)

  if (error.code === 'P2025') {
    return sendDataResponse(res, 404, 'Record does not exist')
  }

  return sendDataResponse(res, 500)
})

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`\n Server is running on port ${port}\n`)
})
