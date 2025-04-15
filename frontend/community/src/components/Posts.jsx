import React, { useState, useEffect } from 'react';
import './Posts.css';

const API = "http://localhost:8080";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API}/api/posts`);
      const data = await res.json();
      setPosts(data.reverse());
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setError("");
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handlePost = async () => {
    if (!image) {
      setError("Please upload an image.");
      return;
    }

    if (!image.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);

    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      
      const newPost = await res.json();
      // Fix by adding _id property
      const postWithId = { ...newPost, _id: newPost.id };
      setPosts([postWithId, ...posts]);
      setImage(null);
      setPreviewUrl(null);
      setDescription("");
      document.getElementById('imageInput').value = "";
    } catch (err) {
      console.error("Post failed:", err);
      setError("Upload failed. Try again.");
    }

    setLoading(false);
  };

  const handleLike = async (id) => {
    // Update UI immediately before waiting for backend
    setPosts(posts.map(p => {
      if (p._id === id || p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));

    try {
      const res = await fetch(`${API}/api/posts/${id}/like`, {
        method: "PUT",
      });
      const updatedPost = await res.json();
      
      // Synchronize with backend response if needed
      setPosts(posts.map(p => {
        if (p._id === id || p.id === id) {
          // Use backend id format to match the post correctly
          return { ...updatedPost, _id: updatedPost.id || id };
        }
        return p;
      }));
    } catch (err) {
      console.error("Like failed:", err);
      // Revert optimistic update on failure
      fetchPosts();
    }
  };

  return (
    <div className="posts-container">
      <div className="create-post">
        <h2>Create Post</h2>
        {error && <div className="error">{error}</div>}
        
        <div className="upload-container">
          <label htmlFor="imageInput" className="custom-file-upload">
            <i className="fa fa-cloud-upload"></i> Choose Image
          </label>
          <input
            id="imageInput"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="file-input"
          />
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>
        
        <textarea
          placeholder="What's on your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={280}
          className="post-textarea"
        />
        <button 
          className="post-button" 
          onClick={handlePost} 
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      <div className="post-feed">
        {posts.map((post) => (
          <div className="post-card" key={post._id || post.id}>
            <div className="post-header">
              <div className="user-info">
                <div className="avatar"></div>
                <span className="username">User</span>
              </div>
              <span className="timestamp">{formatDate(post.createdAt)}</span>
            </div>
            <img 
              src={post.image && post.image.startsWith('http') 
                ? post.image 
                : `${API}/uploads/${post.image}`} 
              alt="Post" 
              className="post-image"
            />
            <div className="post-actions">
              <button 
                className={`like-button ${post.liked ? 'liked' : ''}`} 
                onClick={() => handleLike(post._id || post.id)}
              >
                <i className="heart-icon">❤️</i>
              </button>
              <button className="comment-button">
                <i className="comment-icon">💬</i>
              </button>
            </div>
            <div className="likes-count">
              <span>{post.likes} likes</span>
            </div>
            <div className="post-content">
              <span className="username">User</span>
              <span className="description">{post.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;