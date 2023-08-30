import React, { useState, useEffect } from "react";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./LandingPage.css";

function LandingPage() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  const fetchArticles = async (currentPage) => {
    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${currentPage}`
      );
      const data = await response.json();
      const articlesWithLikes = data.map((article) => ({
        ...article,
        likes: 0
      }));
      setArticles((prevArticles) => [...prevArticles, ...articlesWithLikes]);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchArticles(page);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleLike = (index) => {
    setArticles((prevArticles) => {
      const updatedArticles = [...prevArticles];
      updatedArticles[index] = {
        ...updatedArticles[index],
        likes: updatedArticles[index].likes + 1
      };
      return updatedArticles;
    });
  };

  return (
    <div className="article-list">
      {articles.map((article, index) => (
        <div className="article" key={`${article.id}-${index}`}>
          <img src={article.download_url} alt="Article" />
          <div className="author">Author: {article.author}</div>
          <div className="like">
            <FontAwesomeIcon
              icon={faThumbsUp}
              onClick={() => handleLike(index)}
            />
            <span>{article.likes}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LandingPage;
