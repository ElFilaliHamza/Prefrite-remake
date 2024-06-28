import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [skip, setSkip] = useState(0);
  const [endCats, setEndCats] = useState(false);
  const effectRan = useRef(false);

  useEffect(() => {
    console.log("effect ran");
    if (effectRan.current === false) {
      loadCategories();
      console.log("effect becomes true");
      effectRan.current = true;
    }
    return () => {
      effectRan.current = true;
    };
  });

  const loadCategories = async () => {
    try {
      const data = await getCategories(skip);
      setCategories((prevCategories) => [...prevCategories, ...data.array]);
      setEndCats(data.endCats);
      setSkip((prevSkip) => prevSkip + data.array.length);
    } catch (error) {
      console.error(error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      "rgb(122, 154, 230)",
      // 'rgb(71, 111, 178)',
      // 'rgb(97, 138, 114)',
      // 'rgb(68, 247, 228)',
      // 'rgb(27, 49, 170)',
      // 'rgb(128, 66, 132)',
      // 'rgb(187, 185, 37)',
      // 'rgb(82, 213, 166)',
      // 'rgb(193, 6, 47)',
      // 'rgb(155, 54, 24)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="app-container">
      <div className="simple-container">
        <div className="card-list">
          <Link to="/superadmin/addCategory" className="app-card card-add black-card-text">
            <i className="fas fa-plus"></i>
          </Link>
          {categories.map((category) => (
            <Link
              to={`/superadmin/category/${category._id}`}
              key={category._id}
              className="app-card modern-app-card"
              style={{
                backgroundColor: getRandomColor(),
                color: "#fff",
              }}
            >
              {category.name}
              <div className="card-badge" style={{ color: "var(--c-9)" }}>
                <i className="fas fa-folder-open"></i>
              </div>
            </Link>
          ))}
        </div>
        {!endCats && (
          <button
            onClick={loadCategories}
            className="flat-btn-small btn-blue show-more-btn"
          >
            Afficher plus
          </button>
        )}
      </div>
      <div className="footer-copyright">
        <div>Tous Droits Réservés © 2020 - 2024 | Ilias Al Fakir</div>
        <div>développé pour Younes Belhouss</div>
      </div>
    </div>
  );
};

export default Categories;
