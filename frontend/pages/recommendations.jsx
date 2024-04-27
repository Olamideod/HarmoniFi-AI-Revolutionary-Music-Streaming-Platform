import { useEffect, useState } from 'react'
import axios from 'axios'

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/auth/recommendations')
        setRecommendations(response.data)
        console.log(response.data) // Log the recommendations data to the console
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
      }
    }

    fetchRecommendations()
  }, [])

  return (
    <div>
      {recommendations.map((recommendation, index) => (
        <p key={index}>{recommendation.title}</p>
      ))}
    </div>
  )
}

export default RecommendationsPage