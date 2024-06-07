import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticles } from "../../api/articlesApi";

const CategoryDetail = () => {
  const { catId } = useParams();
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [endArticles, setEndArticles] = useState(false);
  const [categoryName, setCategoryName] = useState("Mozzarella"); // Set your default or fetched category name
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      setArticles([]);
      setSkip(0);
      setEndArticles(false);
      loadArticles();
      effectRan.current = true;
    }
    return () => {
      effectRan.current = true;
    };
  }, [catId]);

  const loadArticles = async () => {
    try {
      const data = await getArticles(catId, skip);
      setArticles((prevArticles) => [...prevArticles, ...data.data]);
      setEndArticles(data.endArticles);
      setSkip((prevSkip) => prevSkip + data.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <div className="simple-container">
        <div className="card-list-2">
          <a
            className="article-card article-add"
            href={`/superadmin/addArticle/${catId}`}
          >
            <i className="fas fa-plus"></i>
          </a>
          {articles.map((article, index) => (
            <a
              key={article._id + index}
              className="article-card"
              href={`/superadmin/article/${article._id}`}
            >
              <div className="article-card-name">
                <div>{article.name}</div>
              </div>
              <div className="article-card-img">
                {article.img ? (
                  <img src={article.img} alt={article.name} />
                ) : (
                  <i class="fad fa-images notfound-img"></i>
                )}
              </div>
              <div className="article-card-price">{article.prixVente} DHS</div>
            </a>
          ))}
        </div>
        {!endArticles && (
          <div
            className="flat-btn-small btn-blue show-more-btn"
            onClick={loadArticles}
          >
            Afficher plus
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
