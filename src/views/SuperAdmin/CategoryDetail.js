import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArticles } from '../../api/articlesApi';
import './CategoryDetail.css'; // Custom CSS for styling

const CategoryDetail = () => {
  const { catId } = useParams();
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [endArticles, setEndArticles] = useState(false);
  const [categoryName, setCategoryName] = useState(''); // Assume you have a way to get category name

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await getArticles(catId, skip);
      setArticles(prevArticles => [...prevArticles, ...data.data]);
      setEndArticles(data.endArticles);
      setSkip(prevSkip => prevSkip + data.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="category-detail-container">
      <h1>{categoryName}</h1>
      <Link to="/superadmin/categories" className="back-link">
        <i className="fas fa-home"></i>
      </Link>
      <div className="card-container">
        <Link to={`/superadmin/addArticle?catId=${catId}`} className="article-card add-card">
          <div className="card-icon"><i className="fas fa-plus"></i></div>
        </Link>
        {articles.map(article => (
          <Link to={`/superadmin/article/${article._id}`} key={article._id} className="article-card">
            <div className="card-icon">
              <img src={article.img} alt={article.name} />
            </div>
            <div className="card-title">{article.name}</div>
            <div className="card-price">{article.prixVente} DHS</div>
          </Link>
        ))}
      </div>
      {!endArticles && (
        <button onClick={loadArticles} className="load-more-btn">Load More</button>
      )}
    </div>
  );
};

export default CategoryDetail;
