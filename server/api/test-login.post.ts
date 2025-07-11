import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event)
      console.log('Test login body:', body)
      
      return { 
        success: true, 
        message: 'Test endpoint working',
        receivedData: body 
      }
    } catch (error) {
      console.error('Error in test login:', error)
      return { success: false, message: 'Error interno del servidor' }
    }
  } else {
    event.node.res.statusCode = 405
    return { error: `Method ${event.node.req.method} Not Allowed` }
  }
}) 