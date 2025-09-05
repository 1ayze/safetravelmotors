import React from 'react'
import { useParams } from 'react-router-dom'

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="container py-8">
      <h1 className="heading-1 mb-8">Blog Post</h1>
      <p>Post Slug: {slug}</p>
      <p className="text-gray-600">This page will show the individual blog post content.</p>
    </div>
  )
}

export default BlogPostPage
