export const computeSellerStatistics = (seller) => {
  try {
    const sellerStats = seller.sellerStats || {};
    const paid = Number(sellerStats.paid) || 0;
    const revenu = paid;

    const commission = revenu * 0.02;

    const charges = Number(seller.charges) || 0;

    const benefice = Number(sellerStats.profit) || 0;

    const debit = Number(sellerStats.debit) || 0;

    const statut = benefice - charges - commission;

    const credit = Number(sellerStats.credit) || 0;

    // console.log(statut, benefice, charges);
    console.log(statut, benefice, revenu, debit, commission, charges, credit);
    return {
      sellerInfo: seller,
      statut: Number(statut),
      benefice: benefice,
      revenu:revenu,
      commission: commission,
      charges: charges,
      credit: credit,
    };
  } catch (err) {
    console.error("seller stats error: ", err);
    return {
      statut: 0,
      benefice: 0,
      revenu: 0,
      commission: 0,
      charges: 0,
    };
  }
};

export const computeOverallStatistics = (sellers, daysInterval = 1) => {
  let totalRevenu = 0;
  let totalBenefice = 0;
  let totalCommission = 0;
  let totalCharges = 0;
  let totalStatut = 0;
  //   let totalDebit = 0;
  let totalCredit = 0;

  sellers.forEach((seller) => {
    const sellerStats = seller.sellerStats || {};

    const paid = sellerStats.paid || 0;
    totalRevenu += paid;

    const commission = paid * 0.02;
    totalCommission += commission;

    let charges = seller.charges || 0;

    totalCharges += charges;

    const benefice = sellerStats.profit || 0;
    totalBenefice += benefice;

    const debit = sellerStats.debit || 0;
    // totalDebit += debit;

    const statut = benefice - charges - commission;
    totalStatut += statut;

    const credit = sellerStats.credit || 0;
    totalCredit += credit;
  });

  return {
    statut: totalStatut.toFixed(2),
    benefice: totalBenefice.toFixed(2),
    revenu: totalRevenu.toFixed(2),
    commission: totalCommission.toFixed(2),
    charges: totalCharges.toFixed(2),
    credit: totalCredit.toFixed(2),
  };
};

export const getSellersRevenue = (sellers) => {
  const sellerRevenues = sellers.map((seller) => {
    const sellerStats = seller.sellerStats || {};

    const paid = Number(sellerStats.paid) || 0;
    const revenu = paid;

    const commission = revenu * 0.02;

    const charges = Number(seller.charges) || 0;

    const benefice = Number(sellerStats.profit) || 0;

    const debit = Number(sellerStats.debit) || 0;

    const statut = benefice - charges - commission;

    const credit = Number(sellerStats.credit) || 0;

    return {
      sellerInfo: seller,
      statut: Number(statut),
      benefice: benefice,
      revenu: revenu,
      commission: commission,
      charges: charges,
      credit: credit,
    };
  });

  return sellerRevenues;
};
