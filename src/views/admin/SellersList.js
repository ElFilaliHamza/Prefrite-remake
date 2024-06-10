import React, { useEffect, useState } from 'react';
import { fetchAdminSellers } from '../../api/adminAPI';
import Loading from '../../components/Loading'; // Assuming you have a Loading component
import '../../assets/css/Styles/SellersList.css';

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const data = await fetchAdminSellers();
        setSellers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app-container">
      <div className="user-home">
        <div className="simple-container">
          <div className="card-list card-list-sellers">
            {sellers.map(seller => (
              <a key={seller._id} className="app-card" href={`/admin/vendeur/${seller._id}`}>{seller.name}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellersList;
