import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticles } from "../../api/articlesApi";
import ArticleCard from "../../components/ArticleCard";
import api from "../../api/api";
import { useSuperData } from "../../components/contexts/SuperContext";
import { getOneCategory } from "../../api/categoriesApi";

const CategoryDetail = () => {
  const { catId } = useParams();
  const { categories } = useSuperData();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [endArticles, setEndArticles] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadArticles = useCallback(async () => {
    try {
      const data = await getArticles(catId, skip);
      setArticles((prevArticles) => [...prevArticles, ...data.data]);
      setEndArticles(data.endArticles);
      setSkip((prevSkip) => prevSkip + data.data.length);
    } catch (error) {
      console.error(error);
    }
  }, [catId, skip]);

  const fetchCategoryName = useCallback(async () => {
    if (!categories || categories.length === 0) {
      const data = await getOneCategory(catId);
      if (!data || data === "") {
        navigate("/superadmin/categories");
        return;
      }
      setCategoryName(data.info.name);
      setArticles(data.articles);
      return;
    }
    try {
      const tmp_category = categories.find((category) => category._id === catId);
      if (tmp_category) {
        setCategoryName(tmp_category.name);
      }
    } catch (error) {
      console.error(error);
    }
  }, [catId, categories, navigate]);

  useEffect(() => {
    setArticles([]);
    setSkip(0);
    setEndArticles(false);
    loadArticles();
    fetchCategoryName();
  }, [loadArticles, fetchCategoryName]);

  const handleDelete = async () => {
    try {
      const response = await api.post("/superadmin/categories/delete", { _id: catId });
      if (response.data.ok) {
        navigate("/superadmin/categories");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/superadmin/categories/update", {
        _id: catId,
        name: newCategoryName,
      });
      setCategoryName(newCategoryName);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <div className="simple-container">
        <div className="info-flex">
          <div className="path-nav">
            <a className="path-btn" href="/superadmin"><i className="fas fa-home"></i></a>
            <a className="path-btn path-btn-current" href="/superadmin/categories"><i className="fas fa-list"></i></a>
          </div>
          <div className="cat-title-container">
            <div className="cat-title">
              {isEditing ? (
                <form style={{ display: "inline-flex" }} onSubmit={handleEdit}>
                  <div style={{ color: "var(--c-1)" }}>
                    <input
                      className="input"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <label className="update-cat-btn">
                    <i className="fas fa-check"></i>
                    <input type="submit" hidden />
                  </label>
                </form>
              ) : (
                <div onClick={() => { setIsEditing(true); setNewCategoryName(categoryName) }}>
                  {categoryName}
                </div>
              )}
            </div>
            <div className="action-buttons">
              <div
                tabIndex="0"
                className="square-btn"
                onClick={() => {
                  setIsEditing(true);
                  setNewCategoryName(categoryName);
                }}
              >
                <i className="fas fa-edit"></i>
              </div>
              {!isEditing && <div
                tabIndex="0"
                className="square-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <i className="fas fa-trash"></i>
              </div>
              }
            </div>
          </div>
        </div>
        {showDeleteConfirm && (
          <div className="modal">
            <div className="modal-message">
              Supprimer {categoryName}?
            </div>
            <div className="modal-btn-group">
              <div className="flat-btn btn-red" onClick={handleDelete}>Oui</div>
              <div className="flat-btn btn-blue" onClick={() => setShowDeleteConfirm(false)}>Non</div>
            </div>
          </div>
        )}
        <div className="card-list-2">
          <a
            className="article-card article-add"
            href={`/superadmin/addArticle/${catId}`}
          >
            <i className="fas fa-plus"></i>
          </a>
          {articles.map((article, index) => (
            <ArticleCard key={article._id + index} article={article} />
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
