import React, { useEffect, useState } from 'react';
import api from '../api/api'; // Adjust the import based on your file structure

const ArticleCard = ({ article }) => {
    const [imgSrc, setImgSrc] = useState(null);

    const fetchImageBlob = async (filename) => {
        try {
            const response = await api.get(`/serve/img${filename}`, { responseType: 'blob' });
            const blob = response.data;
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    };

    useEffect(() => {
        const loadImage = async () => {
            if (article.img) {
                const blobUrl = await fetchImageBlob(article.img);
                setImgSrc(blobUrl);
            }
        };
        loadImage();
    }, [article.img]);

    return (
        <a className="article-card" href={`/superadmin/article/${article._id}`}>
            <div className="article-card-name">
                <div>{article.name}</div>
            </div>
            <div className="article-card-img">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={article.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/path/to/default/image.jpg'; // fallback image
                        }}
                    />
                ) : (
                    <i className="fad fa-images notfound-img"></i>
                )}
            </div>
            <div className="article-card-price">{article.prixVente} DHS</div>
        </a>
    );
};

export default ArticleCard;
