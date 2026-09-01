import { createHashRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { TopicPage } from './pages/TopicPage'
import { SubtopicPage } from './pages/SubtopicPage'
import { QuestionPage } from './pages/QuestionPage'
import { SearchPage } from './pages/SearchPage'
import { ReviewPage } from './pages/ReviewPage'
import { SettingsPage } from './pages/SettingsPage'
import { JavaSyntaxPage } from './pages/JavaSyntaxPage'

export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/topic/:topicId', element: <TopicPage /> },
      { path: '/topic/:topicId/subtopic/:subtopicId', element: <SubtopicPage /> },
      { path: '/topic/:topicId/question/:questionId', element: <QuestionPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/review', element: <ReviewPage /> },
      { path: '/java-syntax', element: <JavaSyntaxPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
])
