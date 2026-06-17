export const downloadTransactionsAsCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert("⚠️ Belum ada log transaksi di database cloud untuk di-export!");
    return;
  }

  const headers = ["ID Transaksi", "Tanggal", "Arus Data", "Kategori", "Deskripsi", "Nominal (Rp)"];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.type.toUpperCase(),
    t.category,
    `"${(t.description || '').replace(/"/g, '""')}"`, 
    t.amount
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `fincore_analytics_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};