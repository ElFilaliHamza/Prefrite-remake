import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArticles } from '../../api/articlesApi';
import '../../assets/css/Styles/CategoryDetail.css'; // Custom CSS for styling
import defaultSVG from '../../assets/images/default_article.svg';

const CategoryDetail = () => {
  const { catId } = useParams();
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [endArticles, setEndArticles] = useState(false);
  const [categoryName, setCategoryName] = useState(''); // Assume you have a way to get category name
  const effectRan = useRef(false);

  useEffect(() => {
    // Reset articles and skip when catId changes
    if (!effectRan.current) {
      setArticles([]);
      setSkip(0);
      setEndArticles(false);
      loadArticles();
      effectRan.current = true;
    }
    return () => {
       effectRan.current = true;
    } 
  }, [catId]);

  const loadArticles = async () => {
    try {
      const data = await getArticles(catId, skip);
      setArticles(prevArticles => [...prevArticles, ...data.data]);
      setEndArticles(data.endArticles);
      setSkip(prevSkip => prevSkip + data.data.length);
      // console.log(...data.data);
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

        {articles.map((article, index) => (
          <Link to={`/superadmin/article/${article._id}`} key={article._id+index} className="article-card">
            <div className="card-icon">
            {article.img ? (
                <img src={article.img} alt={article.name} />
              ) : (
                <img src={defaultSVG} alt="default" />
              )}
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
