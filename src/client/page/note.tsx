import { createRoot } from 'react-dom/client'
import Note from '../../app/page/note'

const container = document.getElementById('main')
const root = createRoot(container)
root.render(<Note />)
