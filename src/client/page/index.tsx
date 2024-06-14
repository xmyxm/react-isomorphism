import { createRoot } from 'react-dom/client'
import Index from '../../app/page/index'

const container = document.getElementById('main')
const root = createRoot(container)
root.render(<Index />)
